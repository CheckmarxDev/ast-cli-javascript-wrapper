import {CxCommandOutput} from "./CxCommandOutput";
import CxScan from "../scan/CxScan";
import { logger } from "./loggerConfig";
import * as fs from "fs"
import * as os from "os";
import * as path from "path";
import CxResult from "../results/CxResult";
import CxProject from "../project/CxProject";

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
    let r = "";
    if(n) r = n.replace(/["']/g, "").replace("/[, ]/g",",");
    return r;
}

export class ExecutionService {
    executeCommands(pathToExecutable: string, commands: string[], output? : string ): Promise<CxCommandOutput> {
        return new Promise(function (resolve, reject) {
            let stderr = "";
            let stdout ="";

            let cp = spawn(pathToExecutable, transformation(commands));
            cp.on('error', reject);
            cp.on('close', function (code: number) {
                console.log(" " + Date.now().toLocaleString())
              logger.info("Exit code received from AST-CLI: " + code);
              logger.info(stdout);
              logger.info(stderr);

              resolve(ExecutionService.onCloseCommand(code, stderr, stdout, output ));
            });
            cp.stdout.on('data', (data: any) => {
                if (data) {
                  logger.info(data.toString());
                  stdout += data.toString();
                }
            });
            cp.stderr.on('data', function (data: any) {
              if (data) {
                logger.error(data.toString());
                stderr += data.toString();
              }
            });
        });
    }

    private static onCloseCommand(code: number, stderr: string, stdout: string, output: string) : CxCommandOutput {
      const cxCommandOutput = new CxCommandOutput();
      cxCommandOutput.exitCode = code;
      if (stderr) {
        cxCommandOutput.status = stderr;
      }
      if (stdout) {
        // Check if the json is valid
        if (isJsonString(stdout)) {
          let resultObject = JSON.parse(stdout.split('\n')[0]);
          switch(output){
            case 'CxScan':
              let scans = CxScan.parseProject(resultObject)
              cxCommandOutput.payload = scans;
              break;
            case 'CxProject':
              let projects = CxProject.parseProject(resultObject)
              cxCommandOutput.payload = projects;
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
