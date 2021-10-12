import {CxScanConfig} from "./CxScanConfig";
import {CxParamType} from "./CxParamType";
import {ExecutionService} from "./ExecutionService";
import {CxCommandOutput} from "./CxCommandOutput";
import * as fs from "fs"
import * as os from "os";
import * as path from "path";


type ParamTypeMap = Map<CxParamType, string>;

export class CxAuth {
    baseUri: string = "";
    clientId: string = "";
    clientSecret: string = "";
    apiKey: string = "";
    pathToExecutable: string;
    tenant: string;

    constructor(cxScanConfig: CxScanConfig) {
        let path = require("path");
        if (cxScanConfig.clientId  && cxScanConfig.clientSecret) {
            console.log("Received clientId and clientSecret");
            this.clientId = cxScanConfig.clientId;
            this.clientSecret = cxScanConfig.clientSecret;
        } else if (cxScanConfig.apiKey) {
            this.apiKey = cxScanConfig.apiKey;
        } else {
            console.log("Did not receive ClientId/Secret or ApiKey from cli arguments");
        }
        let executablePath: string;

        if (cxScanConfig.pathToExecutable) {
            this.pathToExecutable = cxScanConfig.pathToExecutable;
        } else if (process.platform === 'win32') {
            executablePath = path.join(__dirname, '/resources/cx.exe');
            this.pathToExecutable = executablePath;
        } else if (process.platform === 'darwin') {
            executablePath = path.join(__dirname, '/resources/cx-mac');
            this.pathToExecutable = executablePath;
            fs.chmodSync(this.pathToExecutable, 0o777);
        } else {
            executablePath = path.join(__dirname, '/resources/cx-linux');
            this.pathToExecutable = executablePath;
            fs.chmodSync(this.pathToExecutable, 0o777);
        }

        if (cxScanConfig.baseUri) {
            this.baseUri = cxScanConfig.baseUri;
        }

        if (cxScanConfig.tenant) {
            this.tenant = cxScanConfig.tenant;
        }
    }

    initializeCommands(formatRequired: boolean): string[] {
        const list: string[] = [];
        if (this.clientId) {
            list.push("--client-id");
            list.push(this.clientId);
        }
        if (this.clientSecret) {
            list.push("--client-secret");
            list.push(this.clientSecret);
        }
        if (this.apiKey) {
            list.push("--apikey");
            list.push(this.apiKey);
        }
        if (this.baseUri) {
            list.push("--base-uri");
            list.push(this.baseUri);
        }
        if (this.tenant) {
            list.push("--tenant");
            list.push(this.tenant);
        }
        if (formatRequired) {
            list.push("--format");
            list.push("json");
        }
        return list;
    }

    async scanCreate(params: ParamTypeMap): Promise<CxCommandOutput> {
        const commands: string[] = ["scan", "create"];
        commands.push(...this.initializeCommands(true));
        params.forEach((value: string, key: CxParamType) => {
            if (key !== CxParamType.ADDITIONAL_PARAMETERS && key.length !== 1 && value) {
                commands.push("--" + key.toString().replace(/_/g, "-").toLowerCase());
                commands.push(value);
            } else if (key.length === 1 && value) {
                commands.push("-" + key.toString().replace(/_/g, "-").toLowerCase());
                commands.push(value);
            } else if (key === CxParamType.ADDITIONAL_PARAMETERS) {
                let paramList = value.match(/(?:[^\s"]+|"[^"]*")+/g);
                console.log("Additional parameters refined: " + paramList)
                if (paramList) {
                    paramList.forEach((element) => {
                        commands.push(element);
                    });
                }
            }
        });

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands);
    }

    async scanShow(id: string): Promise<CxCommandOutput> {
        const commands: string[] = ["scan", "show", "--scan-id", id];
        commands.push(...this.initializeCommands(true));

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands);
    }

    async scanList(): Promise<CxCommandOutput> {
        const commands: string[] = ["scan", "list"];
        commands.push(...this.initializeCommands(true));

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands);
    }

    async projectList(): Promise<CxCommandOutput> {
        const commands: string[] = ["project", "list"];
        commands.push(...this.initializeCommands(true));

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands);
    }

    async getResultsList(scanId: string) {
        return this.executeResultsCommands(scanId, "json", ".json");
    }

    async getResultsSummary(scanId: string): Promise<string> {
        return this.executeResultsCommands(scanId, "summaryHTML", ".html");
    }

    async getResults(scanId: string, resultType:string, outputFileName: string, outputFilePath: string) {
        const commands = this.createResultCommand(scanId, resultType, outputFileName, outputFilePath)

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands);
    }

    async executeResultsCommands(scanId: string, resultType: string, fileExtension: string): Promise<string> {
        const fileName = new Date().getTime().toString();
        const commands = this.createResultCommand(scanId, resultType, fileName, os.tmpdir())

        const exec = new ExecutionService();
        await exec.executeResultsCommands(this.pathToExecutable, commands)

        const filePath = path.join(os.tmpdir(), fileName + fileExtension)

        return fs.readFileSync(filePath,'utf8');
    }

    createResultCommand(scanId: string, reportFormat: string, outputFileName: string, outputPath: string): string[] {
        const commands: string[] = ["result", "--scan-id", scanId, "--report-format", reportFormat];

        if (outputFileName) {
            commands.push("--output-name")
            commands.push(outputFileName)
        }
        if (outputPath) {
            commands.push("--output-path")
            commands.push(outputPath)
        }
        commands.push(...this.initializeCommands(false));

        return commands;
    }
}


