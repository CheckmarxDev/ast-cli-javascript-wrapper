"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = void 0;
var typescript_logging_1 = require("typescript-logging");
var options = new typescript_logging_1.LoggerFactoryOptions()
    .addLogGroupRule(new typescript_logging_1.LogGroupRule(new RegExp("model.+"), typescript_logging_1.LogLevel.Debug))
    .addLogGroupRule(new typescript_logging_1.LogGroupRule(new RegExp(".+"), typescript_logging_1.LogLevel.Info));
exports.factory = typescript_logging_1.LFService.createNamedLoggerFactory("LoggerFactory", options);
//# sourceMappingURL=ConfigLog4j.js.map