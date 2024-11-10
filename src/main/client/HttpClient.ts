import axios, {AxiosRequestConfig} from 'axios';
import {logger} from '../wrapper/loggerConfig';
import * as fs from 'fs';
import {finished} from 'stream/promises';
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

    public async downloadFile(url: string, outputPath: string): Promise<void> {
        logger.info(`Starting download from URL: ${url}`);
        const writer = fs.createWriteStream(outputPath);

        try {
            if (this.axiosConfig.proxy) {
                logger.info(
                    `Using proxy - Host: ${this.axiosConfig.proxy.host}, Port: ${this.axiosConfig.proxy.port},`  +
                    `Protocol: ${this.axiosConfig.proxy.protocol}, Auth: ${this.axiosConfig.proxy.auth ? 'Yes' : 'No'}`
                );
            }
            const response = await axios({...this.axiosConfig, url});
            response.data.pipe(writer);
            await finished(writer);
            logger.info(`Download completed successfully. File saved to: ${outputPath}`);
        } catch (error) {
            logger.error(`Error downloading file from ${url}: ${error.message || error}`);
            throw error;
        } finally {
            writer.close();
            logger.info('Write stream closed.');
        }
    }
}
