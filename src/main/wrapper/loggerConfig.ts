import { configure, getLogger } from 'log4js';

function configurationWithFile(logFilePath: string) {
	return configure({
		appenders: {
			file: { type: 'fileSync', filename: logFilePath },
			console: { type: 'stdout', layout: { type: "messagePassThrough" } },
		},
		categories: {
			default: { appenders: ['console', 'file'], level: "info" }
		}
	});
}

function configurationWithoutFile() {
	return configure({
		appenders: {
			console: { type: 'stdout', layout: { type: "messagePassThrough" } },
		},
		categories: {
			default: { appenders: ['console',], level: "info" }
		}
	});
}

export function getLoggerWithFilePath(logFilePath?: string) {
	logFilePath ? configurationWithFile(logFilePath) : configurationWithoutFile()
}

export const logger = getLogger();