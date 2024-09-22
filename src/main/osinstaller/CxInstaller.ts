import * as fs from 'fs/promises';
import * as fs1 from 'fs';
import * as path from 'path';
import * as tar from 'tar';
import axios from 'axios';
import * as unzipper from 'unzipper';
import { Semaphore } from 'async-mutex';
import * as os from "os";

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
        // Acquire the semaphore, ensuring only one installation happens at a time
        const [_, release] = await CxInstaller.installSemaphore.acquire();
        try {
            if (this.checkExecutableExists()) {
                console.log('Executable already installed.');
                return;
            }

            const url = await this.getDownloadURL();
            const zipPath = path.join(os.tmpdir(), `ast-cli.${this.platform === 'win32' ? 'zip' : 'tar.gz'}`);

            await this.downloadFile(url, zipPath);
            console.log('Downloaded CLI to:', zipPath);

            await this.extractArchive(zipPath, this.resourceDirPath);
            fs1.chmodSync(this.getExecutablePath(), 0o777);
            console.log('Extracted CLI to:', this.resourceDirPath);
        } catch (error) {
            console.error('Error during installation:', error);
        } finally {
            // Release the semaphore lock to allow the next waiting process to continue
            release(); // Call the release function
        }
    }

    async extractArchive(zipPath: string, extractPath: string): Promise<void> {
        if (zipPath.endsWith('.zip')) {
            console.log('Extracting ZIP file...');
            await unzipper.Open.file(zipPath)
                .then(d => d.extract({ path: extractPath }));
            console.log('Extracted ZIP file to:', extractPath);
        } else if (zipPath.endsWith('.tar.gz')) {
            console.log('Extracting TAR.GZ file...');
            await tar.extract({ file: zipPath, cwd: extractPath });
            console.log('Extracted TAR.GZ file to:', extractPath);
        } else {
            console.error('Unsupported file type. Only .zip and .tar.gz are supported.');
        }
    }

    async downloadFile(url: string, outputPath: string) {
        console.log('Downloading file from:', url);
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
            throw new Error('Error reading AST CLI version: ' + error.message);
        }
    }
}
