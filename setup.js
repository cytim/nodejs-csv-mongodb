require('dotenv').config();

const pino = require('pino');
const VError = require('verror');

global.log = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: {
    translateTime: true,
  },
});

global.VError = VError;
