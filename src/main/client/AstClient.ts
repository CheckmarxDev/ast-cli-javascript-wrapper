import { logger } from '../wrapper/loggerConfig';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import { CxError } from "../errors/CxError";
import * as tunnel from 'tunnel';

export class AstClient {
    /**
     * Creates a request handler with a proxy agent if the HTTP_PROXY environment variable is set.
     * Returns `undefined` if no proxy is configured or if an error occurs while parsing the proxy URL.
     */
    private retryInterval = 2000;
    private maxAttempts = 3;
    private createProxyRequestHandler(): any | undefined {
        const proxyEnv = process.env.HTTP_PROXY;
        if (!proxyEnv) {
            logger.info('No proxy configured; proceeding with direct download.');
            return undefined;
        }

        try {
            const proxyUrl = new URL(proxyEnv);
            const proxyPort = proxyUrl.port || (proxyUrl.protocol === 'http:' ? '80' : proxyUrl.protocol === 'https:' ? '443' : '');
            if (proxyPort === '') {
                logger.error(`Invalid proxy URL: ${proxyUrl}. Port is missing. Proceeding without proxy agent.`);
                return undefined;
            }
            
            const proxyAuth = proxyUrl.username && proxyUrl.password ?
                `${proxyUrl.username}:${proxyUrl.password}`
                : undefined;

            const agent = tunnel.httpsOverHttp({
                proxy: {
                    host: proxyUrl.hostname,
                    port: Number(proxyPort),
                    proxyAuth,
                }
            });

            logger.info(`Using proxy agent for host: ${proxyUrl.hostname} and port: ${proxyPort}`);

            return {
                prepareRequest: (options: any): any => {
                    options.agent = agent;
                    return options;
                }
            };
        } catch (error) {
            logger.error(
                `Error parsing HTTP_PROXY value: ${proxyEnv}. Proceeding without proxy agent. Error: ${error}`
            );
            return undefined;
        }
    }

    public async downloadFile(url: string, outputPath: string): Promise<void> {
        logger.info(`Starting download from URL: ${url}`);

        const requestHandlers: any[] = [];
        const proxyHandler = this.createProxyRequestHandler();
        if (proxyHandler) {
            requestHandlers.push(proxyHandler);
        }

        try {
            const downloadedPath = await toolLib.downloadToolWithRetries(url, outputPath, requestHandlers, undefined, this.maxAttempts, this.retryInterval);
            logger.info(`Download completed successfully. File saved to: ${downloadedPath}`);
        } catch (error: any) {
            logger.error(`Error downloading file from ${url}: ${error.message || error}`);
            throw new CxError(error.message || error);
        }
    }
}
