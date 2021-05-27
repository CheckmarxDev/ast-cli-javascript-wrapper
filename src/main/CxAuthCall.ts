/*
1. Create CxScanConfig object, CxScan object, ExecutionService call, CxParamType enum, CxAuthType enum, CxException exception class, CxAuth class
2. Create global variables for this class(CxAuth)
3. Based on the passed CxScanConfig object, grab the authentication credentials and save them in global variables
4. Check if path to the executable is provided. if not, use the packaged module
5. Create a function to return mandatory auth parameters that needs to be passed with every call.
6. Create scanCreate, scanShow, scanList functions
7. Check if the returned object is of CxScan object or not and return it for each function call.
8. Add the executables for other environments.
*/

import {CxScanConfigCall} from "./CxScanConfigCall";
import {CxParamType} from "./CxParamType";
import {ExecutionService} from "./ExecutionService";
import {spawn} from "child_process";


type ParamTypeMap = Map<CxParamType, string>;
export  class CxAuthCall {
    baseUri: string = "";
    clientId: string = "";
    clientSecret: string = "";
    apiKey: string = "";
    commands: string[] = [];
    pathToExecutable: string;

    constructor(cxScanConfig: CxScanConfigCall) {
        let path = require("path");
        if (cxScanConfig.clientId !== null && cxScanConfig.clientSecret !== null) {
            console.log("Received clientId and clientSecret");
            this.clientId = cxScanConfig.clientId;
            this.clientSecret = cxScanConfig.clientSecret;
        } else if (cxScanConfig.apiKey != null) {
            this.apiKey = cxScanConfig.apiKey;
        } else {
            console.log("Did not receive ClientId/Secret or ApiKey");
        }
        if (cxScanConfig.pathToExecutable !== null && cxScanConfig.pathToExecutable !== "") {
            this.pathToExecutable = cxScanConfig.pathToExecutable;
        } else if(process.platform === 'win32'){
            let executablePath = path.join(__dirname,'/resources/cx.exe');
            this.pathToExecutable = executablePath;
        }
        else if(process.platform === 'darwin'){
            let executablePath = path.join(__dirname,'/resources/cx-mac');
            this.pathToExecutable = executablePath;
        }
        else {
            let executablePath = path.join(__dirname,'/resources/cx-linux');
            this.pathToExecutable = executablePath;
        }
        if (cxScanConfig.baseUri !== null) {
            this.baseUri = cxScanConfig.baseUri;
        }
    }

    initializeCommands(formatRequired:boolean): string[] {
        let list: string[] = [];
        if (this.clientId !== null && this.clientId !== "") {
            list.push("--client-id");
            list.push(this.clientId);
        }
        if (this.clientSecret !== null && this.clientSecret !== "") {
            list.push("--client-secret");
            list.push(this.clientSecret);
        }
        if (this.apiKey !== null && this.apiKey !== "") {
            list.push("--apikey");
            list.push(this.apiKey);
        }
        if (this.baseUri !== null && this.baseUri !== "") {
            list.push("--base-uri");
            list.push(this.baseUri);
        }
        if(formatRequired) {
            list.push("--format");
            list.push("json");
            list.push("-v");
        }
        return list;
    }

    async scanCreate(params: ParamTypeMap): Promise<string> {
        this.commands = this.initializeCommands(true);
        this.commands.push("scan");
        this.commands.push("create");
        params.forEach((value: string, key: CxParamType) => {
            if (key !== CxParamType.ADDITIONAL_PARAMETERS && key.length !== 1) {
                this.commands.push("--" + key.toString().replace(/_/g, "-").toLowerCase());
                this.commands.push(value);
            } else if (key.length === 1) {
                this.commands.push("-" + key.toString().replace(/_/g, "-").toLowerCase());
                this.commands.push(value);
            } else {
                let paramList = value.match(/(?:[^\s"]+|"[^"]*")+/g);
                console.log("Additional parameters refined: " + paramList)
                if (paramList !== null) {
                    paramList.forEach((element) => {
                        this.commands.push(element);
                    });
                }
            }
        });

        let exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, this.commands);
    }

    async scanShow(id: string): Promise<string> {
        this.commands = this.initializeCommands(true);
        this.commands.push("scan");
        this.commands.push("show");
        this.commands.push(id);
        let exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, this.commands);
    }

    async scanList(): Promise<string> {
        this.commands = this.initializeCommands(true);
        this.commands.push("scan");
        this.commands.push("list");
        let exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, this.commands);
    }

    async projectList(): Promise<string> {
        this.commands = this.initializeCommands(true);
        this.commands.push("project");
        this.commands.push("list");
        let exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, this.commands);
    }

     async getResults(scanId:string, target:string) {
        this.commands = this.initializeCommands(false);
        this.commands.push("result");
        this.commands.push("list-simple");
        if(target !== null && target !== ""){
            this.commands.push("--target");
            this.commands.push(target);
        }
         const cp = spawn(this.pathToExecutable, this.commands);
         cp.stdout.on('data', (data: any) => {
             console.log(`stdout: ${data}`);
                 const fs = require('fs');
                 fs.readFile((target)?target:"./simple-results.json", 'utf-8', (err: any, data: any) => {
                     if(err) {
                         throw err;
                     }
                     const val = JSON.stringify(JSON.parse(data),null,2);
                     fs.writeFile((target)?target:"./simple-results.json",val, (err: any) => {
                         if(err) {
                             throw err;
                         }
                         console.log("Data has been written to file successfully.");
                     });

                 });



                 // const val = fs.readFileSync(resultPath)
                 // fs.writeFileSync(resultPath,JSON.stringify(val,null,4))


                 });
        // let exec = new ExecutionService();
        // await exec.executeCommands(this.pathToExecutable, this.commands)
        //     .then(value => {
        //         const fs = require('fs');
        //         let resultPath:string= "";
        //         if(target !== null && target !== "") {
        //             resultPath = "./simple-results.json"
        //         }
        //         else {
        //             resultPath = target;
        //         }
        //         const data = fs.readFileSync(resultPath)
        //         fs.writeFileSync(resultPath,JSON.stringify(data,null,4))
        //     });
    }
}


