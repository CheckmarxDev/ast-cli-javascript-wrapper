import {CxScanConfig} from "./CxScanConfig";
import {CxParamType} from "./CxParamType";
import {ExecutionService} from "./ExecutionService";
import {spawn} from "child_process";
import {CxResultType} from "./CxResultType";
import {CxCommandOutput} from "./CxCommandOutput";
import * as fs from "fs"


type ParamTypeMap = Map<CxParamType, string>;

export class CxAuth {
    baseUri: string = "";
    clientId: string = "";
    clientSecret: string = "";
    apiKey: string = "";
    commands: string[] = [];
    pathToExecutable: string;

    constructor(cxScanConfig: CxScanConfig) {
        let path = require("path");
        if (cxScanConfig.clientId !== null && cxScanConfig.clientSecret !== null && cxScanConfig.clientId !== '' && cxScanConfig.clientId !== '') {
            console.log("Received clientId and clientSecret");
            this.clientId = cxScanConfig.clientId;
            this.clientSecret = cxScanConfig.clientSecret;
        } else if (cxScanConfig.apiKey != null) {
            this.apiKey = cxScanConfig.apiKey;
        } else {
            console.log("Did not receive ClientId/Secret or ApiKey from cli arguments");
        }
        let executablePath: string;


        if (cxScanConfig.pathToExecutable !== null && cxScanConfig.pathToExecutable !== "") {
            this.pathToExecutable = cxScanConfig.pathToExecutable;
        } else if (process.platform === 'win32') {
            executablePath = path.join(__dirname, '/resources/cx.exe');
            this.pathToExecutable = executablePath;
        } else if (process.platform === 'darwin') {
            executablePath = path.join(__dirname, '/resources/cx-mac');
            this.pathToExecutable = executablePath;
            fs.chmod(this.pathToExecutable, 7, function(err){
                console.log("Permission function output: ",err)
            })          
        } 
        else {

            executablePath = path.join(__dirname, '/resources/cx-linux');
            this.pathToExecutable = executablePath;
            fs.chmod(this.pathToExecutable, 7, function(err){
                console.log("Permission function output: ",err)
            })

        }
        if (cxScanConfig.baseUri !== null && cxScanConfig.baseUri !== '') {
            this.baseUri = cxScanConfig.baseUri;
        }
    }

    initializeCommands(formatRequired: boolean): string[] {
        let list: string[] = [];
        if (this.clientId !== null && this.clientId.length > 1) {
            list.push("--client-id");
            list.push(this.clientId);
        }
        if (this.clientSecret !== null && this.clientSecret.length > 1) {
            list.push("--client-secret");
            list.push(this.clientSecret);
        }
        if (this.apiKey !== null && this.apiKey.length > 1) {
            list.push("--apikey");
            list.push(this.apiKey);
        }
        if (this.baseUri !== null && this.baseUri.length > 1) {
            list.push("--base-uri");
            list.push(this.baseUri);
        }
        if (formatRequired) {
            list.push("--format");
            list.push("json");
            list.push("-v");
        }
        return list;
    }

    async scanCreate(params: ParamTypeMap): Promise<CxCommandOutput> {
        this.commands = this.initializeCommands(true);
        this.commands.push("scan");
        this.commands.push("create");
        params.forEach((value: string, key: CxParamType) => {
            if (key !== CxParamType.ADDITIONAL_PARAMETERS && key.length !== 1 && value !== null && value!== undefined && value.length > 1) {
                this.commands.push("--" + key.toString().replace(/_/g, "-").toLowerCase());
                this.commands.push(value);
            } else if (key.length === 1 && value !== null && value!== undefined) {
                this.commands.push("-" + key.toString().replace(/_/g, "-").toLowerCase());
                this.commands.push(value);
            } else if(key === CxParamType.ADDITIONAL_PARAMETERS) {
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

    async scanShow(id: string): Promise<CxCommandOutput> {
        this.commands = this.initializeCommands(true);
        this.commands.push("scan");
        this.commands.push("show");
        this.commands.push("--scan-id");
        this.commands.push(id);
        let exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, this.commands);
    }

    async scanList(): Promise<CxCommandOutput> {
        this.commands = this.initializeCommands(true);
        this.commands.push("scan");
        this.commands.push("list");
        let exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, this.commands);
    }

    async projectList(): Promise<CxCommandOutput> {
        this.commands = this.initializeCommands(true);
        this.commands.push("project");
        this.commands.push("list");
        let exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, this.commands);
    }

    async getResults(scanId: string, targetPath: string, resultParam: CxResultType) {
        this.commands = this.initializeCommands(false);
        this.commands.push("result");
        this.commands.push(resultParam);
        if (targetPath !== null && targetPath !== "") {
            this.commands.push("--target");
            this.commands.push(targetPath);
        }
        const cp = spawn(this.pathToExecutable, this.commands);
        cp.stdout.on('data', (data: any) => {
            console.log(`stdout: ${data}`);
            const fs = require('fs');
            fs.readFile((targetPath) ? targetPath : "./simple-results.json", 'utf-8', (err: any, data: any) => {
                if (err) {
                    throw err;
                }
                const val = JSON.stringify(JSON.parse(data), null, 2);
                fs.writeFile((targetPath) ? targetPath : "./simple-results.json", val, (err: any) => {
                    if (err) {
                        throw err;
                    }
                    console.log("Data has been written to file successfully.");
                });

            });

        });
    }
}


