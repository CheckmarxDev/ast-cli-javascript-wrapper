import {CxConfig} from "./CxConfig";
import {CxParamType} from "./CxParamType";
import {CxConstants} from "./CxConstants";
import {ExecutionService} from "./ExecutionService";
import {CxCommandOutput} from "./CxCommandOutput";
import { logger } from "./loggerConfig";
import * as fs from "fs"
import * as os from "os";

type ParamTypeMap = Map<CxParamType, string>;

export class CxWrapper {
    config: CxConfig = new CxConfig();

    constructor(cxScanConfig: CxConfig) {
        let path = require("path");
        if (cxScanConfig.clientId  && cxScanConfig.clientSecret) {
            logger.info("Received clientId and clientSecret");
            this.config.clientId = cxScanConfig.clientId;
            this.config.clientSecret = cxScanConfig.clientSecret;
        } else if (cxScanConfig.apiKey) {
            this.config.apiKey = cxScanConfig.apiKey;
        } else {
            logger.info("Did not receive ClientId/Secret or ApiKey from cli arguments");
        }
        let executablePath: string;
        if (cxScanConfig.pathToExecutable) {
            this.config.pathToExecutable = cxScanConfig.pathToExecutable;
        } else if (process.platform === 'win32') {
            executablePath = path.join(__dirname, '/resources/cx.exe');
            this.config.pathToExecutable = executablePath;
        } else if (process.platform === 'darwin') {
            executablePath = path.join(__dirname, '/resources/cx-mac');
            this.config.pathToExecutable = executablePath;
            fs.chmodSync(this.config.pathToExecutable, 0o777);
        } else {
            executablePath = path.join(__dirname, '/resources/cx-linux');
            this.config.pathToExecutable = executablePath;
            fs.chmodSync(this.config.pathToExecutable, 0o777);
        }
        if (cxScanConfig.baseUri) {
            this.config.baseUri = cxScanConfig.baseUri;
        }
        if (cxScanConfig.tenant) {
            this.config.tenant = cxScanConfig.tenant;
        }
    }

    initializeCommands(formatRequired: boolean): string[] {
        const list: string[] = [];
        if (this.config.clientId) {
            list.push(CxConstants.CLIENT_ID);
            list.push(this.config.clientId);
        }
        if (this.config.clientSecret) {
            list.push(CxConstants.CLIENT_SECRET);
            list.push(this.config.clientSecret);
        }
        if (this.config.apiKey) {
            list.push(CxConstants.API_KEY);
            list.push(this.config.apiKey);
        }
        if (this.config.baseUri) {
            list.push(CxConstants.BASE_URI);
            list.push(this.config.baseUri);
        }
        if (this.config.tenant) {
            list.push(CxConstants.TENANT);
            list.push(this.config.tenant);
        }
        if (formatRequired) {
            list.push(CxConstants.FORMAT);
            list.push(CxConstants.FORMAT_JSON);
        }
        return list;
    }

    async authValidate(): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_AUTH, CxConstants.SUB_CMD_VALIDATE];
        commands.push(...this.initializeCommands(false));
        let exec = new ExecutionService();
        return await exec.executeCommands(this.config.pathToExecutable, commands);
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
        return await exec.executeCommands(this.config.pathToExecutable, commands, CxConstants.SCAN_TYPE);
    }

    async scanShow(id: string): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_SCAN, CxConstants.SUB_CMD_SHOW, CxConstants.SCAN_ID, id];
        commands.push(...this.initializeCommands(true));
        const exec = new ExecutionService();
        return await exec.executeCommands(this.config.pathToExecutable, commands, CxConstants.SCAN_TYPE);
    }

    async scanList(filters:string): Promise<CxCommandOutput> {
        const validated_filters = this.filterArguments(filters);
        const commands: string[] = [CxConstants.CMD_SCAN, "list"].concat(validated_filters);
        commands.push(...this.initializeCommands(true));
        const exec = new ExecutionService();
        return await exec.executeCommands(this.config.pathToExecutable, commands, CxConstants.SCAN_TYPE);
    }

    async projectList(filters:string): Promise<CxCommandOutput> {
        const validated_filters = this.filterArguments(filters);
        const commands: string[] = [CxConstants.CMD_PROJECT, "list"].concat(validated_filters);
        commands.push(...this.initializeCommands(true));
        const exec = new ExecutionService();
        return await exec.executeCommands(this.config.pathToExecutable, commands, CxConstants.PROJECT_TYPE);
    }

    async projectBranches(projectId: string, filters: string): Promise<CxCommandOutput> {
        // Verify and add possible branch filter by name
        const validated_filters = this.filterArguments(CxConstants.BRANCH_NAME + filters)
        const commands: string[] = [CxConstants.CMD_PROJECT , CxConstants.SUB_CMD_BRANCHES, CxConstants.PROJECT_ID, projectId].concat(validated_filters);
        commands.push(...this.initializeCommands(false));
        const exec = new ExecutionService();
        return await exec.executeCommands(this.config.pathToExecutable, commands);
    }

    async projectShow(projectId: string): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_PROJECT, CxConstants.SUB_CMD_SHOW, CxConstants.PROJECT_ID,projectId];
        commands.push(...this.initializeCommands(true));
        const exec = new ExecutionService();
        return await exec.executeCommands(this.config.pathToExecutable, commands, CxConstants.PROJECT_TYPE);
    }

    async triageShow(projectId: string, similarityId: string, scanType: string ): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_TRIAGE, CxConstants.SUB_CMD_SHOW, CxConstants.PROJECT_ID, projectId, CxConstants.SIMILARITY_ID, similarityId, CxConstants.SCAN_TYPES_SUB_CMD, scanType];
        commands.push(...this.initializeCommands(true));
        const exec = new ExecutionService();
        return await exec.executeCommands(this.config.pathToExecutable, commands, CxConstants.PREDICATE_TYPE);
    }  
    
    async triageUpdate(projectId: string, similarityId: string, scanType: string, state: string, comment: string, severity: string): Promise<CxCommandOutput> {
        const commands: string[] = [CxConstants.CMD_TRIAGE, CxConstants.SUB_CMD_UPDATE, CxConstants.PROJECT_ID, projectId, CxConstants.SIMILARITY_ID, similarityId, CxConstants.SCAN_TYPES_SUB_CMD, scanType, CxConstants.STATE, state, CxConstants.COMMENT, comment, CxConstants.SEVERITY, severity];
        commands.push(...this.initializeCommands(false));
        console.log(commands)
        const exec = new ExecutionService();
        return await exec.executeCommands(this.config.pathToExecutable, commands);
    }  

    async getResultsList(scanId: string) {
        const exec = new ExecutionService();
        const fileName = new Date().getTime().toString();
        const commands = this.createResultCommand(scanId, CxConstants.FORMAT_JSON, fileName, os.tmpdir())
        // Executes the command and creates a result file
        await exec.executeResultsCommands(this.config.pathToExecutable, commands)
        // Reads the result file and retrieves the results
        return exec.executeResultsCommandsFile(scanId, CxConstants.FORMAT_JSON, CxConstants.FORMAT_JSON_FILE, commands,this.config.pathToExecutable,fileName);
    }

    async getResultsSummary(scanId: string): Promise<CxCommandOutput> {
        const exec = new ExecutionService();
        const fileName = new Date().getTime().toString();
        const commands = this.createResultCommand(scanId, CxConstants.FORMAT_HTML_CLI, fileName, os.tmpdir());
        // Executes the command and creates a result file
        await exec.executeResultsCommands(this.config.pathToExecutable, commands);
        // Reads the result file and retrieves the results
        return exec.executeResultsCommandsFile(scanId, CxConstants.FORMAT_HTML, CxConstants.FORMAT_HTML_FILE, commands,this.config.pathToExecutable,fileName);
    }

    async getResults(scanId: string, resultType:string, outputFileName: string, outputFilePath: string) {
        const commands = this.createResultCommand(scanId, resultType, outputFileName, outputFilePath)
        const exec = new ExecutionService();
        return await exec.executeCommands(this.config.pathToExecutable, commands);
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
            r.push(filters);
        }
        return r;
    }
}