import {CxCommandOutput} from "./CxCommandOutput";
import CxScan from "./CxScan";
import { logger } from "./loggerConfig";

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
    executeCommands(pathToExecutable: string, commands: string[]): Promise<CxCommandOutput> {
        return new Promise(function (resolve, reject) {
            let stderr = '';
            let cxCommandOutput = new CxCommandOutput();
            commands = transformation(commands)
            const cp = spawn(pathToExecutable, commands);
            cp.stderr.on('data', function (chunk: string) {
                stderr += chunk;
            });
            cp.on('error', reject)
                .on('close', function (code: number) {
                    cxCommandOutput.exitCode = code;
                    logger.info("Exit code received from AST-CLI: " + code)
                    resolve(cxCommandOutput)
                    logger.info(stderr)
                });
            cp.stdout.on('data', (data: any) => {
                if (data) {
                    logger.info(`test ${data}`);
                    if (isJsonString(data.toString())) {
                        let resultObject = JSON.parse(data.toString().split('\n')[0]);
                        if (resultObject instanceof Array) {
                            logger.info(JSON.stringify(resultObject))
                            cxCommandOutput.scanObjectList = resultObject
                        } else {
                            let resultArray: CxScan[] = [];
                            resultArray.push(resultObject);
                            cxCommandOutput.scanObjectList = resultArray;

                        }
                    }
                }
            });
        });
    }
    executeResultsCommands(pathToExecutable: string, commands: string[]): Promise<string> {
        return new Promise(function (resolve, reject) {
            let stderr = '';
            let results:string = '';
            const cp = spawn(pathToExecutable, commands);
            cp.stderr.on('data', function (chunk: string) {
                stderr += chunk;
            });
            cp.on('error', reject)
                .on('close', function (code: number) {
                    logger.info("Exit code received from AST-CLI: " + code)
                    resolve(results)
                    logger.info(stderr)
                });
            cp.stdout.on('data', (data: any) => {
                logger.info(`${data}`);
                results += data;
            });
        });
    }
}
