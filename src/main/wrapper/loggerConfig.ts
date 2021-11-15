import { configure, getLogger } from 'log4js';

// Appenders
configure({
  appenders: {
    console: { type: 'stdout', layout: { type: "messagePassThrough" } },
},
categories: {
    default: { appenders: ['console'], level: "info" }
  }
});

// Fetch logger and export
export const logger = getLogger();