import 'regenerator-runtime/runtime';
import { CxScanConfigCall } from "./CxScanConfigCall";
import { CxParamType } from "./CxParamType";
import { CxResultType } from "./CxResultType";
declare type ParamTypeMap = Map<CxParamType, string>;
export declare class CxAuthCall {
    baseUri: string;
    clientId: string;
    clientSecret: string;
    apiKey: string;
    commands: string[];
    pathToExecutable: string;
    constructor(cxScanConfig: CxScanConfigCall);
    initializeCommands(formatRequired: boolean): string[];
    scanCreate(params: ParamTypeMap): Promise<string>;
    scanShow(id: string): Promise<string>;
    scanList(): Promise<string>;
    projectList(): Promise<string>;
    getResults(scanId: string, targetPath: string, resultParam: CxResultType): Promise<void>;
}
export {};
