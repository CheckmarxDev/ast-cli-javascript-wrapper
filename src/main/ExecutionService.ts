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

export class ExecutionService {
    executeCommands(pathToExecutable: string, commands: string[]): Promise<CxCommandOutput> {
        return new Promise(function (resolve, reject) {
            let stderr = '';
            let cxCommandOutput = new CxCommandOutput();
            const cp = spawn(pathToExecutable, commands);
            cp.stderr.on('data', function (chunk: string) {
                stderr += chunk;
            });
            cp.on('error', reject)
                .on('close', function (code: number) {
                    cxCommandOutput.exitCode = code;
                    logger.info("Exit code received from AST-CLI: " + code)
                    resolve(cxCommandOutput);
                    logger.error(stderr)
                });
            cp.stdout.on('data', (data: any) => {
                logger.info(`${data}`);
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
            });
        });
    }
}
