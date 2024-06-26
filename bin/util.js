import fs from 'fs-extra';
import merge from 'deepmerge';
import si from 'systeminformation';
import * as dir from 'path';

import { loggerFactory } from '../src/server/logger.js';
import { shellCd, shellExec } from '../src/server/process.js';
import { range } from '../src/client/components/core/CommonJs.js';
import { network } from '../src/server/network.js';
import { Config } from '../src/server/conf.js';
const logger = loggerFactory(import.meta);

logger.info('argv', process.argv);

const operator = process.argv[2];

try {
  // let cmd;
  switch (operator) {
    case 'cls':
      fs.removeSync('./public');
      fs.removeSync('./logs');
      fs.removeSync('./conf');
      //   fs.removeSync('./engine-private');
      //   fs.removeSync('./node_modules');
      break;
    case 'log':
      (() => {
        const logPath = `./logs/${process.argv[3]}/${process.argv[4]}.log`;
        logger.info('Read', logPath);
        console.log(fs.readFileSync(logPath, 'utf8'));
      })();
      break;
    case 'export-vs-extensions':
      shellExec(`code --list-extensions > vs-extensions.txt`);
      fs.writeFileSync(
        `./.vscode/extensions.json`,
        JSON.stringify(
          {
            recommendations: fs
              .readFileSync(`./vs-extensions.txt`, 'utf8')
              .split(`\n`)
              .filter((ext) => ext.trim()),
          },
          null,
          4,
        ),
        'utf8',
      );
      fs.removeSync(`./vs-extensions.txt`);
      break;
    case 'kill-ports':
      if (!process.argv[3]) process.argv[3] = '22,80,443,3000-3020';
      for (const port of process.argv[3].split(',')) {
        const rangePort = port.split('-');
        if (rangePort[1])
          for (const port of range(parseInt(rangePort[0]), parseInt(rangePort[1]))) {
            logger.info('clean port', port);
            await network.port.portClean(port);
          }
        else {
          logger.info('clean port', parseInt(port));
          await network.port.portClean(port);
        }
      }
      break;
    case 'system-info':
      await (async () => {
        for (const infoKey of Object.keys(si)) {
          if (typeof si[infoKey] === 'function') {
            //  'dockerInfo', 'vboxInfo'
            if (!['osInfo', 'graphics', 'cpu'].includes(infoKey)) continue;
            try {
              const infoInstance = await si[infoKey]();
              logger.info(infoKey, infoInstance);
            } catch (error) {
              logger.info('Not valid info function', infoKey);
            }
          }
        }
      })();
      break;
    case 'export-git-changes':
      {
        const baseFrom = process.argv[3];
        const baseTo = process.argv[4];
        if (fs.existsSync(baseTo)) fs.removeSync(baseTo);
        shellCd(baseFrom);
        {
          const output = shellExec('git status', { silent: true, stdout: true })
            .split(`to discard changes in working directory)`)[1]
            .split(`Untracked files:`)[0]
            .split('modified:')
            .map((c) => c.trim().replaceAll(`\n`, ''));
          output[output.length - 1] = output[output.length - 1].split('no changes added to commit')[0];
          output.shift();
          for (const fromPath of output) {
            const from = `${baseFrom}/${fromPath}`;
            const to = `${baseTo}/${fromPath}`;
            logger.info('Copy path', { from, to });
            fs.copySync(from, to);
          }
        }
        {
          const output = shellExec('git status', { silent: true, stdout: true })
            .split(`to include in what will be committed)`)[1]
            .split(`no changes added to commit`)[0]
            .split(`\n`)
            .map((l) => l.trim())
            .filter((l) => l);

          for (const fromPath of output) {
            const from = `${baseFrom}/${fromPath}`;
            const to = `${baseTo}/${fromPath}`;
            logger.info('Copy path', { from, to });
            fs.copySync(from, to);
          }
        }
      }
      break;
    case 'delete-empty-folder':
      function cleanEmptyFoldersRecursively(folder) {
        const isDir = fs.statSync(folder).isDirectory();
        if (!isDir) return;

        let files = fs.readdirSync(folder);
        if (files.length > 0) {
          files.forEach(function (file) {
            const fullPath = dir.join(folder, file);
            cleanEmptyFoldersRecursively(fullPath);
          });

          // re-evaluate files; after deleting subfolder
          // we may have parent folder empty now
          files = fs.readdirSync(folder);
        }

        if (files.length === 0) {
          console.log('removing: ', folder);
          fs.rmdirSync(folder);
          return;
        }
      }
      cleanEmptyFoldersRecursively('./');
    default:
      break;
  }
} catch (error) {
  logger.error(error, error.stack);
}
