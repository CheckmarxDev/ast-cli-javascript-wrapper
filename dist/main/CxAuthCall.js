"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CxAuthCall = void 0;
require("regenerator-runtime/runtime");
var CxParamType_1 = require("./CxParamType");
var ExecutionService_1 = require("./ExecutionService");
var child_process_1 = require("child_process");
var CxAuthCall = /** @class */ (function () {
    function CxAuthCall(cxScanConfig) {
        this.baseUri = "";
        this.clientId = "";
        this.clientSecret = "";
        this.apiKey = "";
        this.commands = [];
        var path = require("path");
        if (cxScanConfig.clientId !== null && cxScanConfig.clientSecret !== null && cxScanConfig.clientId !== '' && cxScanConfig.clientId !== '') {
            console.log("Received clientId and clientSecret");
            this.clientId = cxScanConfig.clientId;
            this.clientSecret = cxScanConfig.clientSecret;
        }
        else if (cxScanConfig.apiKey != null) {
            this.apiKey = cxScanConfig.apiKey;
        }
        else {
            console.log("Did not receive ClientId/Secret or ApiKey from cli arguments");
        }
        var executablePath;
        if (cxScanConfig.pathToExecutable !== null && cxScanConfig.pathToExecutable !== "") {
            this.pathToExecutable = cxScanConfig.pathToExecutable;
        }
        else if (process.platform === 'win32') {
            executablePath = path.join(__dirname, '/resources/cx.exe');
            this.pathToExecutable = executablePath;
            // fs.copyFile(executablePath,"/tmp/",(err) => {
            //     if (err) throw err;
            //     console.log('File was copied to destination');
            // });
            // this.pathToExecutable = fs.chmod(executablePath, 0o600, () => {
            //     fs.copyFile(executablePath, "/tmp/", (err) => {
            //         if (err) throw err;
            //         console.log("File copied****")
            //     })
            // })
            // console.log("Current File Mode:", fs.statSync("/tmp/cx.exe").mode);
            // this.pathToExecutable = "/tmp/cx.exe";
            // console.log(this.pathToExecutable)
        }
        else if (process.platform === 'darwin') {
            executablePath = path.join(__dirname, '/resources/cx-mac');
            this.pathToExecutable = executablePath;
        }
        else {
            executablePath = path.join(__dirname, '/resources/cx-linux');
            this.pathToExecutable = executablePath;
        }
        if (cxScanConfig.baseUri !== null && cxScanConfig.baseUri !== '') {
            this.baseUri = cxScanConfig.baseUri;
        }
    }
    CxAuthCall.prototype.initializeCommands = function (formatRequired) {
        var list = [];
        if (this.clientId !== null && this.clientId.length > 1) {
            list.push("--client-id");
            list.push(this.clientId);
        }
        if (this.clientSecret !== null && this.clientSecret.length > 1) {
            list.push("--client-secret");
            list.push(this.clientSecret);
        }
        if (this.apiKey !== null && this.apiKey.length > 1) {
            list.push("--apikey");
            list.push(this.apiKey);
        }
        if (this.baseUri !== null && this.baseUri.length > 1) {
            list.push("--base-uri");
            list.push(this.baseUri);
        }
        if (formatRequired) {
            list.push("--format");
            list.push("json");
            list.push("-v");
        }
        return list;
    };
    CxAuthCall.prototype.scanCreate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var exec;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.commands = this.initializeCommands(true);
                        this.commands.push("scan");
                        this.commands.push("create");
                        params.forEach(function (value, key) {
                            if (key !== CxParamType_1.CxParamType.ADDITIONAL_PARAMETERS && key.length !== 1 && value !== null && value !== undefined && value.length > 1) {
                                _this.commands.push("--" + key.toString().replace(/_/g, "-").toLowerCase());
                                _this.commands.push(value);
                            }
                            else if (key.length === 1 && value !== null && value !== undefined) {
                                _this.commands.push("-" + key.toString().replace(/_/g, "-").toLowerCase());
                                _this.commands.push(value);
                            }
                            else if (key === CxParamType_1.CxParamType.ADDITIONAL_PARAMETERS) {
                                var paramList = value.match(/(?:[^\s"]+|"[^"]*")+/g);
                                console.log("Additional parameters refined: " + paramList);
                                if (paramList !== null) {
                                    paramList.forEach(function (element) {
                                        _this.commands.push(element);
                                    });
                                }
                            }
                        });
                        exec = new ExecutionService_1.ExecutionService();
                        return [4 /*yield*/, exec.executeCommands(this.pathToExecutable, this.commands)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CxAuthCall.prototype.scanShow = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var exec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.commands = this.initializeCommands(true);
                        this.commands.push("scan");
                        this.commands.push("show");
                        this.commands.push(id);
                        exec = new ExecutionService_1.ExecutionService();
                        return [4 /*yield*/, exec.executeCommands(this.pathToExecutable, this.commands)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CxAuthCall.prototype.scanList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var exec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.commands = this.initializeCommands(true);
                        this.commands.push("scan");
                        this.commands.push("list");
                        exec = new ExecutionService_1.ExecutionService();
                        return [4 /*yield*/, exec.executeCommands(this.pathToExecutable, this.commands)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CxAuthCall.prototype.projectList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var exec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.commands = this.initializeCommands(true);
                        this.commands.push("project");
                        this.commands.push("list");
                        exec = new ExecutionService_1.ExecutionService();
                        return [4 /*yield*/, exec.executeCommands(this.pathToExecutable, this.commands)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CxAuthCall.prototype.getResults = function (scanId, targetPath, resultParam) {
        return __awaiter(this, void 0, void 0, function () {
            var cp;
            return __generator(this, function (_a) {
                this.commands = this.initializeCommands(false);
                this.commands.push("result");
                this.commands.push(resultParam);
                if (targetPath !== null && targetPath !== "") {
                    this.commands.push("--target");
                    this.commands.push(targetPath);
                }
                cp = child_process_1.spawn(this.pathToExecutable, this.commands);
                cp.stdout.on('data', function (data) {
                    console.log("stdout: " + data);
                    var fs = require('fs');
                    fs.readFile((targetPath) ? targetPath : "./simple-results.json", 'utf-8', function (err, data) {
                        if (err) {
                            throw err;
                        }
                        var val = JSON.stringify(JSON.parse(data), null, 2);
                        fs.writeFile((targetPath) ? targetPath : "./simple-results.json", val, function (err) {
                            if (err) {
                                throw err;
                            }
                            console.log("Data has been written to file successfully.");
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    return CxAuthCall;
}());
exports.CxAuthCall = CxAuthCall;
//# sourceMappingURL=CxAuthCall.js.map