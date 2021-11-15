import {CxCommandOutput} from "./CxCommandOutput";
import CxScan from "../scan/CxScan";
import CxProject from "../project/CxProject";
import { logger } from "./loggerConfig";
import * as fs from "fs"
import * as os from "os";
import * as path from "path";
import CxResult from "../results/CxResult";

const spawn = require('child_process').spawn;

function isJsonString(s: string) {
    try {
        let stringObject = s.split('\n')[0];
        JSON.parse(stringObject);
    } catch (e) {
        return false;
    }
    return true;
}

function transformation(commands: string[]):string[] {
    const result:string[] = commands.map(transform);
    return result;
}

function transform(n:string) {
    return n.replace(/["']/g, "").replace("/[, ]/g",",")
}

export class ExecutionService {
    executeCommands(pathToExecutable: string, commands: string[], output? : string ): Promise<CxCommandOutput> {
        return new Promise(function (resolve, reject) {
            let stderr = '';
            let cxCommandOutput = new CxCommandOutput();
            let output_string ="";
            commands = transformation(commands);
            const cp = spawn(pathToExecutable, commands);
            cp.stderr.on('data', function (chunk: string) {
                stderr += chunk;
            });
            cp.on('error', reject)
                .on('close', function (code: number) {
                    cxCommandOutput.exitCode = code;
                    cxCommandOutput.status =  stderr;
                    logger.info("Exit code received from AST-CLI: " + code);
                    logger.info(stderr);
                    resolve(cxCommandOutput);
                });
            cp.stdout.on('data', (data: any) => {
                if (data) {
                    output_string+=data;
                }
            });
            cp.stdout.on('close', (data: any) => {
                logger.info(`${output_string.toString().trim()}`);
                // Check if the json is valid
                if (isJsonString(output_string.toString())) {
                    let resultObject = JSON.parse(output_string.toString().split('\n')[0]);
                    // Some cli outputs have array format, must be checked
                    if (resultObject instanceof Array) {
                        // Check if there is a specific type for the output and make conversions
                        switch(output){
                            case 'CxScan':
                                let r = resultObject.map((member)=>{return Object.assign( new CxScan(),member);}) ;
                                cxCommandOutput.payload = r;
                                break;
                            case 'CxProject':
                                r = resultObject.map((member)=>{return Object.assign( new CxProject(),member);}) ;
                                cxCommandOutput.payload = r;
                                break;
                            default:
                                logger.info(JSON.stringify(resultObject));
                                cxCommandOutput.payload = resultObject;
                        }
                    } else {
                        let resultArray: any [] = [];
                        // Check if there is a specific type for the output and make conversions
                        switch(output){
                            case 'CxScan':
                                let r = Object.assign( new CxScan(),resultObject);
                                resultArray.push(r);
                                cxCommandOutput.payload = resultArray;
                                break;
                            case 'CxProject':
                                r = Object.assign( new CxProject(),resultObject);
                                resultArray.push(r);
                                cxCommandOutput.payload = resultArray;
                                break;
                            default:
                                resultArray.push(resultObject);
                                cxCommandOutput.payload = resultArray;
                        }
                    }
                }
            });
        });
    }

    executeResultsCommands(pathToExecutable: string, commands: string[]): Promise<CxCommandOutput> {
        return new Promise(function (resolve, reject) {
            let stderr = '';
            let cxCommandOutput = new CxCommandOutput();
            const cp = spawn(pathToExecutable, commands);
            cp.stderr.on('data', function (chunk: string) {
                stderr += chunk;
            });
            cp.on('error', reject)
                .on('close', function (code: number) {
                    logger.info("Exit code received from AST-CLI: " + code);
                    logger.info(stderr);
                    cxCommandOutput.status = stderr;
                    cxCommandOutput.exitCode = code;
                    resolve(cxCommandOutput)
                });
            cp.stdout.on('data', (data: any) => {
                logger.info(`${data}`);
                cxCommandOutput.payload = data;
            });
        });
    }

    async executeResultsCommandsFile(scanId: string, resultType: string, fileExtension: string,commands: string[], pathToExecutable: string,fileName:string): Promise<CxCommandOutput> {
        const filePath = path.join(os.tmpdir(), fileName + fileExtension)
        let read = fs.readFileSync(filePath,'utf8');
        let cxCommandOutput = new CxCommandOutput();
        // Need to check if file output is json or html
        if(fileExtension.includes("json")){
            let read_json = JSON.parse(read);
            if (read_json.results){
                let r : CxResult[] = read_json.results.map((member:any)=>{return Object.assign( new CxResult(),member);});
                cxCommandOutput.payload = r;
            }
            else{
                cxCommandOutput.exitCode = 1;
                cxCommandOutput.status = "Error in the json file."
            }
        }
        // In case of html output
        else{
            let html_arrray:any = []
            html_arrray.push(read)
            cxCommandOutput.payload = html_arrray;
        }
        return cxCommandOutput;
    }
}
