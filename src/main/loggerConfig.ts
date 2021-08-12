import { configure, getLogger } from 'log4js';

// appenders
configure({
  appenders: {
    console: { type: 'stdout', layout: { type: "messagePassThrough" } },
},
categories: {
    default: { appenders: ['console'], level: "info" }
  }
});

// fetch logger and export
export const logger = getLogger();