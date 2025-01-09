import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../wrapper/loggerConfig';
import { Client } from "./Client";
import { HttpsProxyAgent } from 'https-proxy-agent'; // Import as a function

export class HttpClient implements Client {
    private readonly axiosConfig: AxiosRequestConfig;
    private readonly domainErrMsg = 'Unable to download the CLI from the URL. Try adding the domain: \'download.checkmarx.com\' to your allow list.';

    constructor() {
        this.axiosConfig = {
            responseType: 'stream',
            httpsAgent: this.getProxyConfig(), // Use httpsAgent instead of proxy
        };
    }

    public getProxyConfig() {
        const proxyUrl = process.env.HTTP_PROXY;
        if (proxyUrl) {
            logger.info(`Detected proxy configuration in HTTP_PROXY`);
            return new HttpsProxyAgent(proxyUrl);
        }
        logger.info('No proxy configuration detected.');
        return undefined;
    }

    public async request(url: string, method: string, data: any): Promise<AxiosResponse<any, any>> {
        logger.info(`Sending ${method} request to URL: ${url}`);
        if (this.axiosConfig.httpsAgent) {
            logger.info(`Using proxy - URL: ${process.env.HTTP_PROXY}`);
        }
        try {
            const response = await axios({ ...this.axiosConfig, url, method, data });
            logger.info(`Request completed successfully.`);
            return response;
        } catch (error) {
            logger.error(`Error sending ${method} request to ${url}: ${error.message || error}`);
            if (this.axiosConfig.httpsAgent !== undefined) {
                throw new Error(`${this.domainErrMsg} \nError: ${error.message || error}`);
            }
            throw error;
        }
    }
}