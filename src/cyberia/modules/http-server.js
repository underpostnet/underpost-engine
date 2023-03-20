import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';

import { commonFunctions, JSONweb } from '../../core/modules/common.js';
import { copyDir, deleteFolderRecursive } from '../../core/modules/files.js';
import { baseCss } from '../../core/modules/css.js';
import { ssrColor } from '../../core/modules/colors.js';

import { ssrWS } from './ws-server.js';
import { maps } from './maps.js';

dotenv.config();

const NAME_APP = 'cyberia';

const renderInstanceTitle = (pathObj) =>
  `${pathObj.name_map.replaceAll('-', ' ').toUpperCase()}${
    pathObj.name_map === '' ? '' : ' | '
  }${NAME_APP.toUpperCase()}`;

const httpClient = (app) => {
  const dir = './public/' + NAME_APP;

  deleteFolderRecursive(`${dir}`);
  copyDir('./node_modules/socket.io/client-dist', `${dir}/socket.io`);
  copyDir('./node_modules/pixi.js/dist', `${dir}/pixi.js`);
  copyDir('./node_modules/pathfinding/visual/lib', `${dir}/pathfinding`);
  copyDir(`./src/${NAME_APP}/assets`, `${dir}`);

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
                <style>
                  ${baseCss}
                  ${fs.readFileSync(`./src/${NAME_APP}/css/global.css`, 'utf8')}
                </style>
            </head>
            <body>
                <script>
                  const NAME_APP = '${NAME_APP}';
                  const API_BASE = '${process.env.API_BASE}';
                  ${commonFunctions()}
                  ${fs.readFileSync('./src/core/components/vanilla.js', 'utf8')}
                  const renderInstanceTitle = ${renderInstanceTitle};
                  ${ssrColor}
                  ${ssrWS}
                  if (!dev) {
                    console.log = () => null;
                    console.warn = () => null;
                  }
                  ${fs.readFileSync(`./src/${NAME_APP}/components/create-account.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/login.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/client.js`, 'utf8')}
                </script>
            </body>
            </html>  
        `,
      'utf8'
    );
  });

  // app.use('/', express.static('./builds/www'));
  app.use('/', express.static(dir));
};

export { httpClient };
