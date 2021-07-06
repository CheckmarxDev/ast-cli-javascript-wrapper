"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.loggerService = void 0;
var typescript_logging_1 = require("typescript-logging");
// Optionally change default settings, in this example set default logging to Info.
// Without changing configuration, categories will log to Error.
typescript_logging_1.CategoryServiceFactory.setDefaultConfiguration(new typescript_logging_1.CategoryConfiguration(typescript_logging_1.LogLevel.Info));
// Create categories, they will autoregister themselves, one category without parent (root) and a child category.
exports.loggerService = new typescript_logging_1.Category("service");
exports.logger = new typescript_logging_1.Category("product", exports.loggerService);
// Optionally get a logger for a category, since 0.5.0 this is not necessary anymore, you can use the category itself to log.
// export const log: CategoryLogger = CategoryServiceFactory.getLogger(cat);
//# sourceMappingURL=loggerConfig.js.map