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
                if (isJsonString(data.toString())) {
                    resolve(data.toString().split('\n')[0]);
                    reject(data.toString().split('\n')[0]);
                }
            });
        });
    }
}
