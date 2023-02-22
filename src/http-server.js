import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';

import { commonFunctions, random } from './common.js';
import { copyDir, deleteFolderRecursive } from './files.js';
import { baseCss } from './css.js';
import { ssrColor } from './colors.js';
import { ssrWS } from './ws-server.js';
import { maps } from './maps.js';

dotenv.config();

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
                <title>${pathObj.name_map.replaceAll('-', ' ').toUpperCase()} | CYBERIA</title>
                <link rel='icon' type='image/x-icon' href='/favicon.ico'>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <script src="/socket.io/socket.io.js"></script>
                <script src="/pixi.js/pixi.js"></script>
                <script src="/pathfinding/pathfinding-browser.min.js"></script>
                <style>${baseCss}</style>
            </head>
            <body>
                <script>
                  ${commonFunctions()}
                  ${fs.readFileSync('./src/vanilla.js', 'utf8')}
                  ${ssrColor}
                  ${ssrWS}
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

  server.listen(process.env.CLIENT_PORT, () => {
    console.log(`Client Server is running on port ${process.env.CLIENT_PORT}`);
  });

  server.get('/', (req, res) => res.redirect(`/${maps[random(0, maps.length - 1)].name_map}`));
};

export { httpServer };
