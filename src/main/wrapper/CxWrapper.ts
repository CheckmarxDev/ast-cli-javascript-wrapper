import {CxScanConfig} from "../scan/CxScanConfig";
import {CxParamType} from "./CxParamType";
import {CxConstants} from "./CxConstants";
import {ExecutionService} from "./ExecutionService";
import {CxCommandOutput} from "./CxCommandOutput";
import { logger } from "./loggerConfig";

import * as fs from "fs"
import * as os from "os";



type ParamTypeMap = Map<CxParamType, string>;

export class CxWrapper {
    baseUri: string = "";
    clientId: string = "";
    clientSecret: string = "";
    apiKey: string = "";
    pathToExecutable: string;
    tenant: string;

    constructor(cxScanConfig: CxScanConfig) {
        let path = require("path");
        if (cxScanConfig.clientId  && cxScanConfig.clientSecret) {
            logger.info("Received clientId and clientSecret");
            this.clientId = cxScanConfig.clientId;
            this.clientSecret = cxScanConfig.clientSecret;
        } else if (cxScanConfig.apiKey) {
            this.apiKey = cxScanConfig.apiKey;
        } else {
            logger.info("Did not receive ClientId/Secret or ApiKey from cli arguments");
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
            list.push(CxConstants.CLIENT_ID);
            list.push(this.clientId);
        }
        if (this.clientSecret) {
            list.push(CxConstants.CLIENT_SECRET);
            list.push(this.clientSecret);
        }
        if (this.apiKey) {
            list.push(CxConstants.API_KEY);
            list.push(this.apiKey);
        }
        if (this.baseUri) {
            list.push(CxConstants.BASE_URI);
            list.push(this.baseUri);
        }
        if (this.tenant) {
            list.push(CxConstants.TENANT);
            list.push(this.tenant);
        }
        if (formatRequired) {
            list.push(CxConstants.FORMAT);
            list.push(CxConstants.FORMAT_JSON);
        }
        return list;
    }

    async scanCreate(params: ParamTypeMap): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_SCAN, CxConstants.SUB_CMD_CREATE];
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
                logger.info("Additional parameters refined: " + paramList)
                if (paramList) {
                    paramList.forEach((element) => {
                        commands.push(element);
                    });
                }
            }
        });

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands, CxConstants.SCAN_TYPE);
    }

    async authValidate(): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_AUTH, CxConstants.SUB_CMD_VALIDATE];
        commands.push(...this.initializeCommands(false));
        let exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands);
    }

    async scanShow(id: string): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_SCAN, CxConstants.SUB_CMD_SHOW, CxConstants.SCAN_ID, id];
        commands.push(...this.initializeCommands(true));

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands, CxConstants.SCAN_TYPE);
    }

    async scanList(): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_SCAN, CxConstants.SUB_CMD_LIST];
        commands.push(...this.initializeCommands(true));

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands, CxConstants.SCAN_TYPE);
    }

    async projectList(): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_PROJECT, CxConstants.SUB_CMD_LIST];
        commands.push(...this.initializeCommands(true));

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands, CxConstants.PROJECT_TYPE);
    }

    async projectBranches(projectId: string, filters: string): Promise<CxCommandOutput> {
        // Verify and add possible branch filter by name
        const validated_filters = this.filterArguments(filters)
        const commands: string[] = [CxConstants.CMD_PROJECT , CxConstants.SUB_CMD_BRANCHES, CxConstants.PROJECT_ID, projectId].concat(validated_filters);
        commands.push(...this.initializeCommands(false));

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands, CxConstants.PROJECT_TYPE);
    }

    async projectShow(projectId: string): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_PROJECT, CxConstants.SUB_CMD_SHOW, CxConstants.PROJECT_ID,projectId];
        commands.push(...this.initializeCommands(true));

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands, CxConstants.PROJECT_TYPE);
    }

    async getResultsList(scanId: string) {
        const exec = new ExecutionService();
        const fileName = new Date().getTime().toString();
        const commands = this.createResultCommand(scanId, CxConstants.FORMAT_JSON, fileName, os.tmpdir())
        // Executes the command and creates a result file
        await exec.executeResultsCommands(this.pathToExecutable, commands)
        // Reads the result file and retrieves the results
        return exec.executeResultsCommandsFile(scanId, CxConstants.FORMAT_JSON, CxConstants.FORMAT_JSON_FILE, commands,this.pathToExecutable,fileName);
    }

    async getResultsSummary(scanId: string): Promise<CxCommandOutput> {
        const exec = new ExecutionService();
        const fileName = new Date().getTime().toString();
        const commands = this.createResultCommand(scanId, CxConstants.FORMAT_HTML_CLI, fileName, os.tmpdir());
        // Executes the command and creates a result file
        await exec.executeResultsCommands(this.pathToExecutable, commands);
        // Reads the result file and retrieves the results
        return exec.executeResultsCommandsFile(scanId, CxConstants.FORMAT_HTML, CxConstants.FORMAT_HTML_FILE, commands,this.pathToExecutable,fileName);
    }

    async getResults(scanId: string, resultType:string, outputFileName: string, outputFilePath: string) {
        const commands = this.createResultCommand(scanId, resultType, outputFileName, outputFilePath)

        const exec = new ExecutionService();
        return await exec.executeCommands(this.pathToExecutable, commands);
    }

    createResultCommand(scanId: string, reportFormat: string, outputFileName: string, outputPath: string): string[] {
        const commands: string[] = [CxConstants.CMD_RESULT, CxConstants.SCAN_ID, scanId,CxConstants.REPORT_FORMAT , reportFormat];

        if (outputFileName) {
            commands.push(CxConstants.OUTPUT_NAME);
            commands.push(outputFileName);
        }
        if (outputPath) {
            commands.push(CxConstants.OUTPUT_PATH);
            commands.push(outputPath);
        }
        commands.push(...this.initializeCommands(false));

        return commands;
    }

    filterArguments(filters:string):string[]{
        let r = [];
        if(filters.length>0){
            r.push(CxConstants.FILTER);
            r.push(CxConstants.BRANCH_NAME + filters);
        }
        return r;
    }
}