import {CxCommandOutput} from "./CxCommandOutput";
import CxScan from "../scan/CxScan";
import { logger } from "./loggerConfig";
import * as fs from "fs"
import * as os from "os";
import * as path from "path";
import CxResult from "../results/CxResult";
import CxProject from "../project/CxProject";
import CxCodeBashing from "../codebashing/CxCodeBashing";
import CxBFL from "../bfl/CxBFL";
import spawner = require('child_process');
import CxKicsRealTime from "../kicsRealtime/CxKicsRealTime";
import CxKicsRemediation from "../remediation/CxKicsRemediation";



function isJsonString(s: string) {
    try {
        const stringObject = s.split('\n')[0];
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
    let r = "";
    if(n) r = n.replace(/["']/g, "").replace("/[, ]/g",",");
    return r;
}

export class ExecutionService {
    private fsObject  : any = undefined

    executeCommands(pathToExecutable: string, commands: string[], output? : string ): Promise<CxCommandOutput> {
        return (new Promise( (resolve, reject)=> {
            let stderr = "";
            let stdout ="";

            this.fsObject = spawner.spawn(pathToExecutable, transformation(commands));
            this.fsObject.on('error', (data: { toString: () => string; }) => {
                if (data) {
                    logger.error(data.toString().replace('\n', ''));
                    stderr += data.toString();
                }
                reject()
            });
            this.fsObject.on('exit',(code: number) => {

                logger.info("Exit code received from AST-CLI: " + code);
                if(code==1){
                    stderr = stdout
                }
                resolve(ExecutionService.onCloseCommand(code, stderr, stdout, output));
            });
            this.fsObject.stdout.on('data', (data: { toString: () => string; }) => {
                if (data) {
                  logger.info(data.toString().replace('\n', ''));
                  stdout += data.toString();
                }
            });
            this.fsObject.stderr.on('data', (data: { toString: () => string; }) => {
              if (data) {
                logger.error(data.toString().replace('\n', ''));
                stderr += data.toString();
              }
            });
        }));
    }

    executeKicsCommands(pathToExecutable: string, commands: string[], output? : string ): [Promise<CxCommandOutput>,any] {
        return [new Promise( (resolve, reject)=> {
            let stderr = "";
            let stdout ="";

            this.fsObject = spawner.spawn(pathToExecutable, transformation(commands));
            this.fsObject.on('error', (data: { toString: () => string; }) => {
                if (data) {
                    logger.error(data.toString().replace('\n', ''));
                    stderr += data.toString();
                }
                reject()
            });
            this.fsObject.on('exit',(code: number) => {
                logger.info("Exit code received from AST-CLI: " + code);
                if(code==1){
                    stderr = stdout
                }
                resolve(ExecutionService.onCloseCommand(code, stderr, stdout, output));
            });
            this.fsObject.stdout.on('data', (data: { toString: () => string; }) => {
                if (data) {
                    logger.info(data.toString().replace('\n', ''));
                    stdout += data.toString();
                }
            });
            this.fsObject.stderr.on('data', (data: { toString: () => string; }) => {
                if (data) {
                    logger.error(data.toString().replace('\n', ''));
                    stderr += data.toString();
                }
            });
        }), this.fsObject];
    }

    private static onCloseCommand(code: number, stderr: string, stdout: string, output: string) : CxCommandOutput {
      const cxCommandOutput = new CxCommandOutput();
      cxCommandOutput.exitCode = code;
      if (stderr) {
        cxCommandOutput.status = stderr;
      }
      if (stdout) {
            const stdoutSplit = stdout.split('\n');
            const data = stdoutSplit.find(isJsonString);
            if (data) {
              const resultObject = JSON.parse(data);
              switch (output) {
                case "CxScan":
                  const scans = CxScan.parseProject(resultObject);
                  cxCommandOutput.payload = scans;
                  break;
                case "CxProject":
                  const projects = CxProject.parseProject(resultObject);
                  cxCommandOutput.payload = projects;
                  break;
                case "CxCodeBashing":
                  const codeBashing = CxCodeBashing.parseCodeBashing(resultObject);
                  cxCommandOutput.payload = codeBashing;
                  break;
                case "CxBFL":
                    const bflNode = CxBFL.parseBFLResponse(resultObject);
                    cxCommandOutput.payload = bflNode;
                    break;
                case "CxKicsRealTime":
                    const kicsResults = CxKicsRealTime.parseKicsRealTimeResponse(resultObject);
                    cxCommandOutput.payload = [kicsResults];
                    break;
                  case "CxKicsRemediation":
                    const kicsRemediationOutput = CxKicsRemediation.parseKicsRemediation(resultObject)
                    cxCommandOutput.payload = [kicsRemediationOutput]
                    break;
                default:
                  cxCommandOutput.payload = resultObject;
              }
            }
      }

      return cxCommandOutput;
    }

    executeResultsCommands(pathToExecutable: string, commands: string[]): Promise<CxCommandOutput> {
        return new Promise(function (resolve, reject) {
            let stderr = '';
            const cxCommandOutput = new CxCommandOutput();
            const cp = spawner.spawn(pathToExecutable, commands);
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
        const read = fs.readFileSync(filePath,'utf8');
        const cxCommandOutput = new CxCommandOutput();
        // Need to check if file output is json or html
        if(fileExtension.includes("json")){
            const read_json = JSON.parse(read.replace(/:([0-9]{15,}),/g, ':"$1",'));
            if (read_json.results){
                const r : CxResult[] = read_json.results.map((member:any)=>{return Object.assign( new CxResult(),member);});
                cxCommandOutput.payload = r;
            }
            else{
                cxCommandOutput.exitCode = 1;
                cxCommandOutput.status = "Error in the json file."
            }
        }
        // In case of html output
        else{
            const html_arrray:string[] = []
            html_arrray.push(read)
            cxCommandOutput.payload = html_arrray;
        }
        return cxCommandOutput;
    }
}
