/*
1. Create CxScanConfig object, CxScan object, ExecutionService call, CxParamType enum, CxAuthType enum, CxException exception class, CxAuth class
2. Create global variables for this class(CxAuth)
3. Based on the passed CxScanConfig object, grab the authentication credentials and save them in global variables
4. Check if path to the executable is provided. if not, use the packaged module
5. Create a function to return mandatory auth parameters that needs to be passed with every call.
6. Create scanCreate, scanShow, scanList functions
7. Check if the returned object is of CxScan object or not and return it for each function call.
*/
import { factory } from "./ConfigLog4j";
import { CxScan } from "./CxScan";
import { CxScanConfigCall } from "./CxScanConfigCall";
import { CxParamType } from "./CxParamType";
const spawn = require('child_process').spawn;
type ParamTypeMap = Map<CxParamType, string>;
export class CxAuthCall {
    baseUri: string = " ";
    clientId: string = " ";
    clientSecret: string = " ";
    apiKey: string = " ";
    commands: string[] = [];
    log = factory.getLogger("CxAuth");
    pathToExecutable: string;
    constructor(cxScanConfig: CxScanConfigCall) {

        if (cxScanConfig.clientId !== null && cxScanConfig.clientSecret !== null) {
            console.log("Received clientId and clientSecret");
            this.clientId = cxScanConfig.clientId;
            this.clientSecret = cxScanConfig.clientSecret;
        }
        else if (cxScanConfig.apiKey != null) {
            this.apiKey = cxScanConfig.apiKey;
        }
        else {
            console.log("Did not receive ClientId/Secret or ApiKey");
        }
        if (cxScanConfig.pathToExecutable !== null) {
            this.pathToExecutable = cxScanConfig.pathToExecutable;
        }
        else {
            this.pathToExecutable = './cx.exe';
        }
    }

    scanCreate(params: ParamTypeMap): void {
        this.commands = this.initializeCommands();
        this.commands.push("scan");
        this.commands.push("create");
        // for (const paramKey of params.keys()) {
        //     if (paramKey !== CxParamType.ADDITIONAL_PARAMETERS) {
        //          this.commands.push(paramKey.toString().replace("/_/i", "-").toLowerCase());
        //          this.commands.push(params.get(paramKey) + " ");
        //     }
        //     else {
        //         // TODO: logic to seperate each param and add to the list
        //     }
        // }
        params.forEach((value: string, key: CxParamType) => {
            if (key !== CxParamType.ADDITIONAL_PARAMETERS) {
                this.commands.push(key.toString().replace("/_/i", "-").toLowerCase());
                this.commands.push(value);
            }
            else {
                // TODO: logic to seperate each param and add to the list
            }
        });
        let prc = null;
        prc = spawn(this.pathToExecutable, this.commands)
        prc.stdout.setEncoding('utf8');
        prc.stdout.on('data', (data: any) => {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            console.log(lines.join(""));
        });

        prc.on('close', (code: any) => {
            console.log('process exit code ' + code);
        });
    };

    initializeCommands(): string[] {
        let list: string[] = [];
        list.push(this.pathToExecutable);
        if (this.clientId !== null) {
            list.push("--client-id");
            list.push(this.clientId);
        }
        if (this.clientSecret !== null) {
            list.push("--client-secret");
            list.push(this.clientSecret);
        }
        if (this.apiKey !== null) {
            list.push("--apikey");
            list.push(this.apiKey);
        }
        if (this.baseUri !== null) {
            list.push("--base-uri");
            list.push(this.baseUri);
        }
        list.push();
        return list;
    }
}


