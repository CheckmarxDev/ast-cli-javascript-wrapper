import { logger } from '../wrapper/loggerConfig';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import { CxError } from "../errors/CxError";
import * as tunnel from 'tunnel';

export class AstClient {
    /**
     * Creates a request handler with a proxy agent if the HTTP_PROXY environment variable is set.
     * Returns `undefined` if no proxy is configured or if an error occurs while parsing the proxy URL.
     */
    private createProxyRequestHandler(): any | undefined {
        const proxyEnv = process.env.HTTP_PROXY;
        if (!proxyEnv) {
            logger.info('No proxy configured; proceeding with direct download.');
            return undefined;
        }

        try {
            const proxyUrl = new URL(proxyEnv);
            if (proxyUrl.port === '') {
                logger.error(`Invalid proxy URL: ${proxyUrl}. Port is missing. Proceeding without proxy agent.`);
                return undefined;
            }
            
            const proxyAuth = proxyUrl.username && proxyUrl.password ?
                `${proxyUrl.username}:${proxyUrl.password}`
                : undefined;

            const agent = tunnel.httpsOverHttp({
                proxy: {
                    host: proxyUrl.hostname,
                    port: Number(proxyUrl.port),
                    proxyAuth,
                }
            });

            logger.info(`Using proxy agent for host: ${proxyUrl.hostname} and port: ${proxyUrl.port}`);

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
            const downloadedPath = await toolLib.downloadTool(url, outputPath, requestHandlers);
            logger.info(`Download completed successfully. File saved to: ${downloadedPath}`);
        } catch (error: any) {
            logger.error(`Error downloading file from ${url}: ${error.message || error}`);
            throw new CxError(error.message || error);
        }
    }
}
