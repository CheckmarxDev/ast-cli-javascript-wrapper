"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionService = void 0;
var spawn = require('child_process').spawn;
function isJsonString(s) {
    try {
        var stringObject = s.split('\n')[0];
        JSON.parse(stringObject);
    }
    catch (e) {
        return false;
    }
    return true;
}
var ExecutionService = /** @class */ (function () {
    function ExecutionService() {
    }
    ExecutionService.prototype.executeCommands = function (pathToExecutable, commands) {
        return new Promise(function (resolve, reject) {
            var stderr = '';
            var cp = spawn(pathToExecutable, commands);
            cp.stderr.on('data', function (chunk) {
                stderr += chunk;
            });
            cp.on('error', reject)
                .on('close', function (code) {
                if (code !== 0) {
                    reject(stderr);
                }
            });
            cp.stdout.on('data', function (data) {
                console.log("" + data);
                if (isJsonString(data.toString())) {
                    resolve(data.toString().split('\n')[0]);
                    reject(data.toString().split('\n')[0]);
                }
            });
        });
    };
    return ExecutionService;
}());
exports.ExecutionService = ExecutionService;
//# sourceMappingURL=ExecutionService.js.map