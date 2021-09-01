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
    commands: string[] = [];
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
        let list: string[] = [];
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
            list.push("-v");
        }
        return list;
    }

    async scanCreate(params: ParamTypeMap): Promise<CxCommandOutput> {
        this.commands = this.initializeCommands(true);
        this.commands.push("scan");
        this.commands.push("create");
        params.forEach((value: string, key: CxParamType) => {
            if (key !== CxParamType.ADDITIONAL_PARAMETERS && key.length !== 1 && value) {
                this.commands.push("--" + key.toString().replace(/_/g, "-").toLowerCase());
                this.commands.push(value);
            } else if (key.length === 1 && value) {
                this.commands.push("-" + key.toString().replace(/_/g, "-").toLowerCase());
                this.commands.push(value);
            } else if (key === CxParamType.ADDITIONAL_PARAMETERS) {
                let paramList = value.match(/(?:[^\s"]+|"[^"]*")+/g);
                console.log("Additional parameters refined: " + paramList)
                if (paramList) {
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

    async getResultsList(scanId: string) {
        return this.executeResultsCommands(scanId, "json", ".json");
    }

    async getResultsSummary(scanId: string): Promise<string> {
        return this.executeResultsCommands(scanId, "summaryHTML", ".html");
    }

    async getResults(scanId: string, resultType:string, outputFileName: string, outputFilePath: string) {
        this.commands = this.createResultCommand(scanId, resultType, outputFileName, outputFilePath)

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, this.commands);
    }

    async executeResultsCommands(scanId: string, resultType: string, fileExtension: string): Promise<string> {
        const fileName = new Date().getTime().toString();
        this.commands = this.createResultCommand(scanId, resultType, fileName, os.tmpdir())

        const exec = new ExecutionService();
        await exec.executeResultsCommands(this.pathToExecutable, this.commands)

        const filePath = path.join(os.tmpdir(), fileName + fileExtension)

        return fs.readFileSync(filePath,'utf8');
    }

    createResultCommand(scanId: string, reportFormat: string, outputFileName: string, outputPath: string): string[] {
        const resultCommands = this.initializeCommands(false);
        resultCommands.push("result");
        resultCommands.push("--scan-id");
        resultCommands.push(scanId);
        resultCommands.push("--report-format");
        resultCommands.push(reportFormat);

        if (outputFileName) {
            resultCommands.push("--output-name")
            resultCommands.push(outputFileName)
        }
        if (outputPath) {
            resultCommands.push("--output-path")
            resultCommands.push(outputPath)
        }

        return resultCommands;
    }
}


