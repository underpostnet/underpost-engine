import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';

import { commonFunctions } from './common.js';
import { copyDir, deleteFolderRecursive } from './files.js';
import { baseCss } from './css.js';
import { ssrColor } from './colors.js';
import { ssrWS } from './ws-server.js';
import { maps } from './maps.js';

dotenv.config();

const renderInstanceTitle = (pathObj) =>
  `${pathObj.name_map.replaceAll('-', ' ').toUpperCase()}${pathObj.name_map === '' ? '' : ' | '}CYBERIA`;

const httpServer = () => {
  const server = express();
  const dir = './public';

  deleteFolderRecursive(`${dir}`);
  copyDir('./node_modules/socket.io/client-dist', `${dir}/socket.io`);
  copyDir('./node_modules/pixi.js/dist', `${dir}/pixi.js`);
  copyDir('./node_modules/pathfinding/visual/lib', `${dir}/pathfinding`);
  copyDir('./src/assets', `${dir}`);

  maps.map((pathObj) => {
    let path = pathObj.name_map;
    if (path !== '') path += '/';
    if (!fs.existsSync(`${dir}/${path}`)) fs.mkdirSync(`${dir}/${path}`, { recursive: true });
    console.log('render: ', path);

    fs.writeFileSync(
      `${dir}/${path}index.html`,
      /*html*/ `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${renderInstanceTitle(pathObj)}</title>
                <link rel='icon' type='image/x-icon' href='/favicon.ico'>
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
                <script src="/socket.io/socket.io.js"></script>
                <script src="/pixi.js/pixi.js"></script>
                <script src="/pathfinding/pathfinding-browser.min.js"></script>
                <style>${baseCss}</style>
            </head>
            <body>
                <script>
                  ${commonFunctions()}
                  ${fs.readFileSync('./src/vanilla.js', 'utf8')}
                  const renderInstanceTitle = ${renderInstanceTitle};
                  ${ssrColor}
                  ${ssrWS}
                  if (!dev) {
                    console.log = () => null;
                    console.warn = () => null;
                  }
                  ${fs.readFileSync('./src/client.js', 'utf8')}
                </script>
            </body>
            </html>  
        `,
      'utf8'
    );
  });

  // server.use('/', express.static('./builds/www'));
  server.use('/', express.static(dir));

  return server;
};

export { httpServer };
