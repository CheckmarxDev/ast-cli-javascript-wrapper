import * as fs from 'fs/promises';
import * as fs1 from 'fs';
import * as path from 'path';
import * as tar from 'tar';
import axios from 'axios';
import * as unzipper from 'unzipper';
import { Semaphore } from 'async-mutex';
import * as os from "os";
import {logger} from "../wrapper/loggerConfig";

export class CxInstaller {
    private readonly platform: string;
    private cliVersion: string;
    private readonly resourceDirPath: string;
    private static installSemaphore = new Semaphore(1);  // Semaphore with 1 slot

    constructor(platform: string) {
        this.platform = platform;
        this.resourceDirPath = path.join(__dirname, `../wrapper/resources`);
    }

    // Method to get the download URL based on OS and architecture
    async getDownloadURL(): Promise<string> {
        const cliVersion = await this.readASTCLIVersion();
        let platformString: string;
        let archiveExtension: string;

        switch (this.platform) {
            case 'win32':
                platformString = 'windows';
                archiveExtension = 'zip';
                break;
            case 'darwin':
                archiveExtension = 'tar.gz';
                platformString = 'darwin';
                break;
            case 'linux':
                archiveExtension = 'tar.gz';
                platformString = 'linux';
                break;
            default:
                throw new Error('Unsupported platform or architecture');
        }

        return `https://download.checkmarx.com/CxOne/CLI/${cliVersion}/ast-cli_${cliVersion}_${platformString}_x64.${archiveExtension}`;
    }

    getExecutablePath(): string {
        let executablePath;
        if (this.platform === 'win32') {
            executablePath = path.join(this.resourceDirPath, 'cx.exe');
        } else {
            executablePath = path.join(this.resourceDirPath, 'cx');
        }
        return executablePath;
    }

    async downloadIfNotInstalledCLI() {
        const [_, release] = await CxInstaller.installSemaphore.acquire();
        try {
            if (this.checkExecutableExists()) {
                logger.info('Executable already installed.');
                return;
            }

            const url = await this.getDownloadURL();
            const zipPath = path.join(os.tmpdir(), `ast-cli.${this.platform === 'win32' ? 'zip' : 'tar.gz'}`);

            await this.downloadFile(url, zipPath);
            logger.info('Downloaded CLI to:', zipPath);

            await this.extractArchive(zipPath, this.resourceDirPath);
            fs1.chmodSync(this.getExecutablePath(), 0o777);
            logger.info('Extracted CLI to:', this.resourceDirPath);
        } catch (error) {
            logger.error('Error during installation:', error);
        } finally {
            release(); 
        }
    }

    async extractArchive(zipPath: string, extractPath: string): Promise<void> {
        if (zipPath.endsWith('.zip')) {
            await unzipper.Open.file(zipPath)
                .then(d => d.extract({ path: extractPath }));
        } else if (zipPath.endsWith('.tar.gz')) {
            await tar.extract({ file: zipPath, cwd: extractPath });
        } else {
            logger.error('Unsupported file type. Only .zip and .tar.gz are supported.');
        }
    }

    async downloadFile(url: string, outputPath: string) {
        logger.info('Downloading file from:', url);
        const writer = fs1.createWriteStream(outputPath);
        const response = await axios({ url, responseType: 'stream' });
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    checkExecutableExists(): boolean {
        return fs1.existsSync(this.getExecutablePath());
    }

    async readASTCLIVersion(): Promise<string> {
        if (this.cliVersion) {
            return this.cliVersion;
        }
        try {
            const versionFilePath = path.join(process.cwd(), 'checkmarx-ast-cli.version');
            const versionContent = await fs.readFile(versionFilePath, 'utf-8');
            return versionContent.trim();
        } catch (error) {
            logger.error('Error reading AST CLI version: ' + error.message);
        }
    }
}
