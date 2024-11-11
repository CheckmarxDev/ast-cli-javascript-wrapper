import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {logger} from '../wrapper/loggerConfig';
import {Client} from "./Client";

export class HttpClient implements Client {
    private readonly axiosConfig: AxiosRequestConfig;

    constructor() {
        this.axiosConfig = {
            responseType: 'stream',
            proxy: this.getProxyConfig(),
        };
    }

    public getProxyConfig() {
        const proxyUrl = process.env.HTTP_PROXY;
        if (proxyUrl) {
            logger.info(`Detected proxy configuration in HTTP_PROXY`);
            const parsedProxy = new URL(proxyUrl);

            return {
                host: parsedProxy.hostname,
                port: parseInt(parsedProxy.port, 10),
                protocol: parsedProxy.protocol.replace(':', ''), // remove the colon
                auth: parsedProxy.username && parsedProxy.password
                    ? {username: parsedProxy.username, password: parsedProxy.password}
                    : undefined,
            };
        }
        logger.info('No proxy configuration detected.');
        return undefined;
    }
    
    public async request(url: string, method: string, data: any): Promise<AxiosResponse<any, any>> {
        logger.info(`Sending ${method} request to URL: ${url}`);
        if (this.axiosConfig.proxy) {
            logger.info(
                `Using proxy - Host: ${this.axiosConfig.proxy.host}, Port: ${this.axiosConfig.proxy.port},`  +
                `Protocol: ${this.axiosConfig.proxy.protocol}, Auth: ${this.axiosConfig.proxy.auth ? 'Yes' : 'No'}`
            );
        }
        try {
            const response = await axios({...this.axiosConfig, url, method, data});
            logger.info(`Request completed successfully.`);
            return response;
        } catch (error) {
            logger.error(`Error sending ${method} request to ${url}: ${error.message || error}`);
            throw error;
        }
    }
}
