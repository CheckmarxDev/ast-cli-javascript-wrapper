import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';
import * as tar from 'tar';
import axios from 'axios';
import * as unzipper from 'unzipper';
import {logger} from "../wrapper/loggerConfig";
import {finished} from 'stream/promises';

type SupportedPlatforms = 'win32' | 'darwin' | 'linux';

export class CxInstaller {
    private readonly platform: string;
    private cliVersion: string;
    private readonly resourceDirPath: string;
    private readonly installedCLIVersionFileName = 'cli-version';
    private readonly cliDefaultVersion = '2.2.5'; // This will be used if the version file is not found. Should be updated with the latest version.

    constructor(platform: string) {
        this.platform = platform;
        this.resourceDirPath = path.join(__dirname, `../wrapper/resources`);
    }

    private async getDownloadURL(): Promise<string> {
        const cliVersion = await this.readASTCLIVersion();

        const platforms: Record<SupportedPlatforms, { platform: string; extension: string }> = {
            win32: {platform: 'windows', extension: 'zip'},
            darwin: {platform: 'darwin', extension: 'tar.gz'},
            linux: {platform: 'linux', extension: 'tar.gz'}
        };

        const platformKey = this.platform as SupportedPlatforms;

        const platformData = platforms[platformKey];
        if (!platformData) {
            throw new Error('Unsupported platform or architecture');
        }

        return `https://download.checkmarx.com/CxOne/CLI/${cliVersion}/ast-cli_${cliVersion}_${platformData.platform}_x64.${platformData.extension}`;
    }

    public getExecutablePath(): string {
        const executableName = this.platform === 'win32' ? 'cx.exe' : 'cx';
        return path.join(this.resourceDirPath, executableName);
    }

    public async downloadIfNotInstalledCLI(): Promise<void> {
        try {
            await fs.promises.mkdir(this.resourceDirPath, {recursive: true});
            const cliVersion = await this.readASTCLIVersion();

            if (this.checkExecutableExists()) {
                const installedVersion = await this.readInstalledVersionFile(this.resourceDirPath);
                if (installedVersion === cliVersion) {
                    logger.info('Executable already installed.');
                    return;
                }
            }
            
            await this.cleanDirectoryContents(this.resourceDirPath);
            const url = await this.getDownloadURL();
            const zipPath = path.join(this.resourceDirPath, this.getCompressFolderName());

            await this.downloadFile(url, zipPath);
            logger.info('Downloaded CLI to:', zipPath);

            await this.extractArchive(zipPath, this.resourceDirPath);
            await this.saveVersionFile(this.resourceDirPath, cliVersion);

            fs.unlink(zipPath, (err) => {
                if (err) {
                    logger.warn('Error deleting the file:', err);
                } else {
                    logger.info('File deleted successfully!');
                }
            });

            fs.chmodSync(this.getExecutablePath(), 0o755);
            logger.info('Extracted CLI to:', this.resourceDirPath);
        } catch (error) {
            logger.error('Error during installation:', error);
        }
    }

    private async cleanDirectoryContents(directoryPath: string): Promise<void> {
        try {
            const files = await fsPromises.readdir(directoryPath);

            await Promise.all(files.map(async (file) => {
                const filePath = path.join(directoryPath, file);
                const fileStat = await fsPromises.stat(filePath);

                if (fileStat.isDirectory()) {
                    await fsPromises.rm(filePath, { recursive: true, force: true });
                    logger.info(`Directory ${filePath} deleted.`);
                } else {
                    await fsPromises.unlink(filePath);
                    logger.info(`File ${filePath} deleted.`);
                }
            }));

            logger.info(`All contents in ${directoryPath} have been cleaned.`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.info(`Directory at ${directoryPath} does not exist.`);
            } else {
                logger.error(`Failed to clean directory contents: ${error.message}`);
            }
        }
    }

    private async extractArchive(zipPath: string, extractPath: string): Promise<void> {
        if (zipPath.endsWith('.zip')) {
            await unzipper.Open.file(zipPath)
                .then(d => d.extract({path: extractPath}));
        } else if (zipPath.endsWith('.tar.gz')) {
            await tar.extract({file: zipPath, cwd: extractPath});
        } else {
            logger.error('Unsupported file type. Only .zip and .tar.gz are supported.');
        }
    }

    private async saveVersionFile(resourcePath: string, version: string): Promise<void> {
        const versionFilePath = path.join(resourcePath, this.installedCLIVersionFileName);
        try {
            await fsPromises.writeFile(versionFilePath, `${version}`, 'utf8');
            logger.info(`Version file created at ${versionFilePath} with version ${version}`);
        } catch (error) {
            logger.error(`Failed to create version file: ${error.message}`);
        }
    }

    private async readInstalledVersionFile(resourcePath: string): Promise<string | null> {
        const versionFilePath = path.join(resourcePath, this.installedCLIVersionFileName);
        try {
            const content = await fsPromises.readFile(versionFilePath, 'utf8');
            logger.info(`Version file content: ${content}`);
            return content;
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.warn(`Version file not found at ${versionFilePath}.`);
            } else {
                logger.error(`Failed to read version file: ${error.message}`);
            }
            return null;
        }
    }

    private async downloadFile(url: string, outputPath: string) {
        logger.info('Downloading file from:', url);
        const writer = fs.createWriteStream(outputPath);

        try {
            const response = await axios({url, responseType: 'stream'});
            response.data.pipe(writer);

            await finished(writer); // Use stream promises to await the writer
            logger.info('Download finished');
        } catch (error) {
            logger.error('Error downloading file:', error.message || error);
        } finally {
            writer.close();
        }
    }
    
    private checkExecutableExists(): boolean {
        return fs.existsSync(this.getExecutablePath());
    }

    private async readASTCLIVersion(): Promise<string> {
        if (this.cliVersion) {
            return this.cliVersion;
        }
        try {
            const versionFilePath = this.getVersionFilePath();
            const versionContent = await fsPromises.readFile(versionFilePath, 'utf-8');
            return versionContent.trim();
        } catch (error) {
            logger.warn('Error reading AST CLI version: ' + error.message);
            return this.cliDefaultVersion;
        }
    }

    private getVersionFilePath(): string {
        return path.join(__dirname,'../../../checkmarx-ast-cli.version');
    }

    private getCompressFolderName(): string {
        return `ast-cli.${this.platform === 'win32' ? 'zip' : 'tar.gz'}`;
    }
}
