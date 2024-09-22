import * as fs from 'fs/promises';
import * as fs1 from "fs"
import * as path from 'path';
import * as tar from 'tar';
import axios from 'axios';
import * as unzipper from "unzipper";


export class CxInstaller {
    private readonly platform: string;
    private cliVersion: string;
    private readonly resourceDirPath: string;

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
        if (!this.checkExecutableExists()) {
            const url = await this.getDownloadURL();
            const zipPath = this.getZipPath();
            try {
                await this.downloadFile(url, zipPath);
                console.log('Downloaded CLI to:', zipPath);

                await this.extractArchive(zipPath, this.resourceDirPath);
                console.log('Extracted CLI to:', this.resourceDirPath);
                console.log('Done!');
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    async extractArchive(zipPath: string, extractPath: string): Promise<void> {
        if (zipPath.endsWith('.zip')) {
            console.log('Extracting ZIP file...');
            // Use unzipper to extract ZIP files
            await unzipper.Open.file(zipPath)
                .then(d => d.extract({path: extractPath}));
            console.log('Extracted ZIP file to:', extractPath);
        } else if (zipPath.endsWith('.tar.gz')) {
            console.log('Extracting TAR.GZ file...');
            // Use tar.extract to extract TAR.GZ files
            await tar.extract({file: zipPath, cwd: extractPath});
            console.log('Extracted TAR.GZ file to:', extractPath);
        } else {
            console.error('Unsupported file type. Only .zip and .tar.gz are supported.');
        }
    }

    async downloadFile(url: string, outputPath: string) {
        const writer = fs1.createWriteStream(outputPath);
        const response = await axios({url, responseType: 'stream'});
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    getZipPath(): string {
        let executablePath;
        if (this.platform === 'win32') {
            executablePath = path.join(this.resourceDirPath, 'cx.zip');
        } else {
            executablePath = path.join(this.resourceDirPath, 'cx.tar.gz');
        }
        return executablePath;
    }

    checkExecutableExists(): boolean {
        if (fs1.existsSync(this.getExecutablePath())){
            console.log('Executable exists:', this.getExecutablePath());
            return true;
        } else {
            return false;
        }
    }

    // Method to read the AST CLI version from the file
    async readASTCLIVersion(): Promise<string> {
        if (this.cliVersion) {
            return this.cliVersion;
        }
        try {
            console.log('Reading AST CLI version...');
            console.log('Current working directory:',process.cwd(), '/checkmarx-ast-cli.version');
            const versionFilePath = path.join(process.cwd(), 'checkmarx-ast-cli.version');
            const versionContent = await fs.readFile(versionFilePath, 'utf-8');
            return versionContent.trim();
        } catch (error) {
            console.error('Error reading AST CLI version:', error);
            throw error;
        }
    }
}

