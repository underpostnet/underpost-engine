import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';

import { commonFunctions, JSONweb } from '../../core/modules/common.js';
import { copyDir, deleteFolderRecursive } from '../../core/modules/files.js';
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

  fs.mkdirSync(`${dir}/.well-known`, { recursive: true });

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
                  ${fs.readFileSync(`./src/core/css/base.css`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/css/global.css`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/css/place-bar-select.css`, 'utf8')}
                </style>
            </head>
            <body>
                <script>

                ${process.env.NODE_ENV === 'dev' ? '' : `(function(){`}  
                  
                  const dev = ${process.env.NODE_ENV === 'dev'};
                  const NAME_APP = '${NAME_APP}';
                  const API_BASE = '${process.env.API_BASE}';
                  const IO_HOST = '${
                    process.env.NODE_ENV === 'prod' ? process.env.HOST : 'ws://localhost:' + process.env.PORT
                  }';
                  ${commonFunctions()}
                  ${fs.readFileSync('./src/core/components/vanilla.js', 'utf8')}
                  const renderInstanceTitle = ${renderInstanceTitle};
                  if (localStorage.getItem('lang')) s('html').lang = localStorage.getItem('lang');
                  ${ssrColor}
                  ${ssrWS}
                  if (!dev) {
                    console.log = () => null;
                    console.warn = () => null;
                  }                  
                  ${fs.readFileSync(`./src/${NAME_APP}/components/toggle-switch.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/dropdown.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/drag.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/create-account.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/login.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/koyn.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/bag.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/chat.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/quests.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/noti-circle.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/character-stats.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/css-controller.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/config.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/wiki.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/map.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/history-board.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/account.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/util.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/pixi-init.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/pixi-event.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/pixi-remove.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/gui.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/ws-client.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/touch.js`, 'utf8')}
                  ${fs.readFileSync(`./src/${NAME_APP}/components/screen-keys.js`, 'utf8')}

                ${process.env.NODE_ENV === 'dev' ? '' : `})()`}  
                
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
