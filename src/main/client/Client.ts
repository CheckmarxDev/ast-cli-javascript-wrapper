import {AxiosResponse} from "axios";

export interface Client {
    getProxyConfig(): any;
    request(url: string, method: string, data: any): Promise<AxiosResponse<any, any>>;
}
