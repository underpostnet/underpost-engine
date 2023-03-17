import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';

import { commonFunctions } from '../../core/modules/common.js';
import { copyDir, deleteFolderRecursive } from '../../core/modules/files.js';
import { baseCss } from '../../core/modules/css.js';

dotenv.config();

const NAME_APP = 'cryptokoyn';

const httpClient = (app) => {
  const dir = './public/' + NAME_APP;
  const path = '';

  deleteFolderRecursive(`${dir}`);
  copyDir(`./src/${NAME_APP}/assets`, `${dir}`);

  // let path = pathObj.name_map;
  // if (path !== '') path += '/';
  if (!fs.existsSync(`${dir}/${path}`)) fs.mkdirSync(`${dir}/${path}`, { recursive: true });
  // console.log('render: ', path);

  fs.writeFileSync(
    `${dir}/${path}index.html`,
    /*html*/ `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <title>${NAME_APP}</title>
              <link rel='icon' type='image/x-icon' href='/favicon.ico'>
              <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
              <style>${baseCss}</style>
          </head>
          <body>
              <script>
                ${commonFunctions()}
                ${fs.readFileSync('./src/core/components/vanilla.js', 'utf8')}
                ${fs.readFileSync(`./src/${NAME_APP}/components/client.js`, 'utf8')}
              </script>
          </body>
          </html>  
      `,
    'utf8'
  );

  app.use('/', express.static(dir));
};

export { httpClient };
