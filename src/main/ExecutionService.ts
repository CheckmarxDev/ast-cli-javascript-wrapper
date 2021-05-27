import {loggerService,logger} from "./loggerConfig";
import {resolve} from "dns/promises";
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
    resultObject :string = "";
    // async executeCommands(path: string, commands: string[]): Promise<string>{
    //     // let prc = spawn(path, commands)
    //     // prc.stdout.on('data', (data: any) => {
    //     //     console.log(`stdout: ${data}`);
    //     //     if(this.IsJsonString(data)) {
    //     //         this.resultObject = data;
    //     //     }
    //     // });
    //     //
    //     // prc.stderr.on('data', (data: any) => {
    //     //     console.error(`stderr: ${data}`);
    //     //     return data.toString();
    //     // });
    //     //
    //     // prc.on('close', (code: any) => {
    //     //     console.log(`child process exited with code ${code}`);
    //     // });
    //     // return this.resultObject;
    //
    //     /*
    //     * NEW IMPLEMENTATION START
    //     * */
    //     const source = spawn(path, commands,
    //         {stdio: ['ignore', 'pipe', process.stderr]}); // (A)
    //
    //     return this.echoReadable(source.stdout).toString(); // (B)
    //     // console.log('### DONE');
    //     // return this.resultObject;
    // }
    //

    //
    // async echoReadable(readable: string) {
    //     for await (const line of chunksToLinesAsync(readable)) { // (C)
    //         //console.log('LINE: ' + chomp(line))
    //         logger.info(line);
    //         if(this.IsJsonString(chomp(line))) {
    //             this.resultObject = chomp(line);
    //         }
    //        // return chomp(line);
    //     }
    //     await resolve(this.resultObject);
    // }


    // executeCommands(pathToExecutable: string, commands: string[]): Promise<string> {
    //     let prc = spawn(pathToExecutable, commands)
    //     prc.stdout.on('data', (data: any) => {
    //         console.log(`stdout: ${data}`);
    //     });
    //
    //
    //     prc.stderr.on('data', (data: any) => {
    //         console.error(`stderr: ${data}`);
    //         //return data.toString();
    //         return data;
    //     });
    //
    //
    //     prc.on('close', (code: any) => {
    //         console.log(`child process exited with code ${code}`);
    //         return code;
    //     });
    //
    // }
    executeCommands(pathToExecutable: string, commands: string[]): Promise<string> {
        return new Promise(function (resolve, reject) {
            let stderr = '';
            const cp = spawn(pathToExecutable, commands);
            cp.stderr.on('data', function (chunk: string) {
                stderr += chunk;
            });
            cp.on('error', reject)
                .on('close', function (code: number) {
                    if (code !== 0) {
                        reject(stderr);
                    }
                });
            cp.stdout.on('data', (data: any) => {
                console.log(`${data}`);
                if(isJsonString(data.toString())) {
                    resolve(data.toString().split('\n')[0]);
                    reject(data.toString().split('\n')[0]);
                }
            });
        });
    }
}
