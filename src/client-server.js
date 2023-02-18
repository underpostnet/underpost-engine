import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';

import { commonFunctions } from './common.js';
import { copyDir, deleteFolderRecursive } from './files.js';
import { baseCss } from './css.js';
import { ssrColor } from './colors.js';
import { ssrWS } from './ws-server.js';

dotenv.config();

const clientServer = (options) => {
  const { paths, dir } = options;
  const server = express();

  deleteFolderRecursive(`${dir}`);
  copyDir('./node_modules/socket.io/client-dist', `${dir}/socket.io`);
  copyDir('./node_modules/pixi.js/dist', `${dir}/pixi.js`);
  paths.map((pathObj) => {
    let { path } = pathObj;
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
                <title>CYBERIA</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <script src="/socket.io/socket.io.js"></script>
                <script src="/pixi.js/pixi.js"></script>
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
};

export { clientServer };
