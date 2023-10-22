// https://nodejs.org/api/process

import shell from 'shelljs';
import dotenv from 'dotenv';
import fs from 'fs';

import { loggerFactory } from './logger.js';

dotenv.config();

const logger = loggerFactory(import.meta);

// process.exit();

const getRootDirectory = () => process.cwd().replace(/\\/g, '/');

const ProcessController = {
  SIG: {
    data: [
      'SIGPIPE',
      'SIGHUP',
      'SIGTERM',
      'SIGINT',
      'SIGBREAK',
      'SIGWINCH',
      'SIGKILL',
      'SIGSTOP',
      'SIGBUS',
      'SIGFPE',
      'SIGSEGV',
      'SIGILL',
    ],
    onListen: function () {
      return this.data.map((sig) =>
        process.on(sig, (...args) => {
          logger.info(`process on ${sig}`, args);
        })
      );
    },
  },
  init: function () {
    process.on('exit', (...args) => {
      logger.info(`process on exit`, args);
    });
    this.SIG.onListen();
  },
};

const shellExec = (cmd) => {
  logger.info(`cmd`, cmd);
  return shell.exec(cmd);
};

const shellCd = (cd) => {
  logger.info(`cd`, cd);
  return shell.cd(cd);
};

const envController = async () => {
  const confPrivateServerPath = `./engine-private/conf.server.private.json`;
  if (process.env.NODE_ENV === 'production' && fs.existsSync(confPrivateServerPath))
    fs.writeFileSync(
      `./src/conf.server.json`,
      JSON.stringify(JSON.parse(fs.readFileSync(confPrivateServerPath, 'utf8')), null, 4),
      'utf8'
    );
};

export { ProcessController, getRootDirectory, shellExec, shellCd, envController };
