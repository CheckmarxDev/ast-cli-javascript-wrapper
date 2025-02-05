import { logger } from '../wrapper/loggerConfig';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import { CxError } from "../errors/CxError";
import * as tunnel from 'tunnel';

export class AstClient {
    public async downloadFile(url: string, outputPath: string): Promise<void> {
        logger.info(`Starting download from URL: ${url}`);

        const requestHandlers: any[] = [];

        if (process.env.HTTP_PROXY) {
            try {
                const proxyUrl = process.env.HTTP_PROXY;
                const parsedUrl = new URL(proxyUrl);

                const proxyPort = parsedUrl.port ? Number(parsedUrl.port) : 80;

                // Extract credentials if provided in the URL (e.g., http://username:password@host:port)
                let proxyAuth: string | undefined = undefined;
                if (parsedUrl.username && parsedUrl.password) {
                    proxyAuth = `${parsedUrl.username}:${parsedUrl.password}`;
                }

                const agent = tunnel.httpsOverHttp({
                    proxy: {
                        host: parsedUrl.hostname,
                        port: proxyPort,
                        proxyAuth: proxyAuth,
                    }
                });

                logger.info(`Using proxy agent for host: ${parsedUrl.hostname} and port: ${proxyPort}`);

                // Add a handler that applies the proxy agent to each request.
                requestHandlers.push({
                    prepareRequest: (options: any): any => {
                        options.agent = agent;
                        return options;
                    }
                });
            } catch (err) {
                logger.error(`Error parsing HTTP_PROXY value: ${process.env.HTTP_PROXY}. Proceeding without proxy agent. Error: ${err}`);
            }
        } else {
            logger.info('No proxy configured; proceeding with direct download.');
        }

        try {
            const downloadedPath = await toolLib.downloadTool(url, outputPath, requestHandlers);
            logger.info(`Download completed successfully. File saved to: ${downloadedPath}`);
        } catch (error) {
            logger.error(`Error downloading file from ${url}: ${error.message || error}`);
            throw new CxError(error.message || error);
        }
    }
}
