import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import UglifyJS from 'uglify-js';
import CleanCSS from 'clean-css';

import { commonFunctions, JSONweb } from '../../core/modules/common.js';
import { copyDir, deleteFolderRecursive } from '../../core/modules/files.js';
import { ssrColor } from '../../core/modules/colors.js';

import { ssrWS } from './ws-server.js';
import { maps } from './maps.js';
import { authValidator } from './auth.js';
import { mimes } from '../../core/modules/mime.js';

dotenv.config();
const nameApp = process.env.NAME_APP;
const description = {
  en: 'Cyberia OnLine Massively Multiplayer OnLine Role-Playing Game',
  es: 'Cyberia OnLine Juego de Rol Multijugador OnLine',
};
const themeColor = '#1a1a1a';
const author = 'https://github.com/underpostnet';
const socialImgPath = '/social/CYBERIA.jpg';
const nameSrcFileApp = 'app';
const dir = './public/' + nameApp;
const keywords = 'cyberia, MMORPG, browser, free';

const fxEngineRender = fs.readFileSync(`./src/${nameApp}/engine/map.js`, 'utf8');
const userRender = (req, res) => {
  try {
    if (req.user && req.user.admin === true) {
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'ok',
          render: fxEngineRender,
        },
      });
    }
    return res.status(401).json({
      status: 'error',
      data: {
        message: 'user not admin',
        render: '',
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      data: {
        message: error.message,
      },
    });
  }
};

const renderInstanceTitle = (pathObj) =>
  `${pathObj.name_map.replaceAll('-', ' ').toUpperCase()}${
    pathObj.name_map === '' ? '' : ' | '
  }${nameApp.toUpperCase()}`;

const httpClient = (app, internalApi) => {
  deleteFolderRecursive(`${dir}`);
  const npmModules = [
    ['./node_modules/socket.io/client-dist', `${dir}/socket.io`, `/socket.io/socket.io.min.js`],
    ['./node_modules/pixi.js/dist', `${dir}/pixi.js`, `/pixi.js/pixi.min.js`],
    ['./node_modules/pathfinding/visual/lib', `${dir}/pathfinding`, `/pathfinding/pathfinding-browser.min.js`],
    ['./node_modules/sortablejs', `${dir}/sortablejs`, `/sortablejs/Sortable.min.js`],
    ['./node_modules/html2canvas/dist', `${dir}/html2canvas`, `/html2canvas/html2canvas.min.js`],
  ];

  const htmlJsTagModules = npmModules
    .map(
      (mod) => /*html*/ `
              <script src='${mod[2]}'></script>
`
    )
    .join('');

  npmModules.map((mod) => copyDir(mod[0], mod[1]));

  copyDir(`./src/${nameApp}/assets`, `${dir}`);

  fs.mkdirSync(`${dir}/.well-known`, { recursive: true });

  let coreJs = `

  const dev = ${process.env.NODE_ENV === 'dev'};
  const nameApp = '${nameApp}';
  const API_BASE = '${process.env.API_BASE}';
  const IO_HOST = '${internalApi.getIoHost()}';
  ${commonFunctions()}
  ${fs.readFileSync('./src/core/components/vanilla.js', 'utf8')}
  const renderInstanceTitle = ${renderInstanceTitle};
  if (localStorage.getItem('lang')) s('html').lang = localStorage.getItem('lang');
  const mimes = ${JSONweb(mimes)};
  ${ssrColor}
  ${ssrWS}
  if (!dev) {
    console.log = () => null;
    console.warn = () => null;
  }
  ${fs.readFileSync(`./src/${nameApp}/services/auth.js`, 'utf8')}     
  ${fs.readFileSync(`./src/${nameApp}/services/item.js`, 'utf8')}      
  ${fs.readFileSync(`./src/${nameApp}/services/map.js`, 'utf8')}          
  ${fs.readFileSync(`./src/${nameApp}/components/toggle-switch.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/dropdown.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/drag.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/create-account.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/login.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/koyn.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/bag.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/chat.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/quests.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/noti-circle.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/character-stats.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/css-controller.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/config.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/wiki.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/map.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/history-board.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/account.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/util.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/pixi-init.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/pixi-event.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/pixi-remove.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/gui.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/logout.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/ws-client.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/touch.js`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/components/screen-keys.js`, 'utf8')}
  `;

  let coreCss = `
  ${fs.readFileSync(`./src/core/css/base.css`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/css/global.css`, 'utf8')}
  ${fs.readFileSync(`./src/${nameApp}/css/place-bar-select.css`, 'utf8')}
  `;

  if (process.env.NODE_ENV !== 'dev') {
    coreJs = `(function(){${UglifyJS.minify(coreJs).code}})()`;
    coreCss = new CleanCSS().minify(coreCss).styles;
  }

  fs.writeFileSync(`${dir}/${nameSrcFileApp}.js`, coreJs, 'utf8');
  fs.writeFileSync(`${dir}/${nameSrcFileApp}.css`, coreCss, 'utf8');

  maps.map((pathObj) => {
    let path = pathObj.name_map;
    if (path !== '') path += '/';
    if (!fs.existsSync(`${dir}/${path}`)) fs.mkdirSync(`${dir}/${path}`, { recursive: true });
    console.log('render: ', path);
    const canonicalURL = `${internalApi.getHost()}/${path}`;

    fs.writeFileSync(
      `${dir}/${path}index.html`,
      /*html*/ `
            <!DOCTYPE html>
            <html dir='ltr'>
            <head>
                <meta charset='UTF-8'>
                <title>${renderInstanceTitle(pathObj)}</title>
                <link rel='icon' type='image/x-icon' href='/favicon.ico'>
                <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
                <meta name='author' content='${author}' />
                <meta name='keywords' content='${keywords}'>
                <meta name ='description' content='${description.en}' />
                <meta name ='theme-color' content = '${themeColor}' />
                <link rel='canonical' href='${canonicalURL}' />
        
               
                <link rel='icon' type='image/png' sizes='32x32' href='/pwa/favicon-32x32.png'>
                <link rel='icon' type='image/png' sizes='194x194' href='/pwa/favicon-194x194.png'>        
                <link rel='icon' type='image/png' sizes='36x36' href='/pwa/android-chrome-36x36.png'>
                <link rel='icon' type='image/png' sizes='48x48' href='/pwa/android-chrome-48x48.png'>
                <link rel='icon' type='image/png' sizes='72x72' href='/pwa/android-chrome-72x72.png'>
                <link rel='icon' type='image/png' sizes='96x96' href='/pwa/android-chrome-96x96.png'>
                <link rel='icon' type='image/png' sizes='144x144' href='/pwa/android-chrome-144x144.png'>
                <link rel='icon' type='image/png' sizes='192x192' href='/pwa/android-chrome-192x192.png'>
                <link rel='icon' type='image/png' sizes='256x256' href='/pwa/android-chrome-256x256.png'>
                <link rel='icon' type='image/png' sizes='384x384' href='/pwa/android-chrome-384x384.png'>
                <link rel='icon' type='image/png' sizes='512x512' href='/pwa/android-chrome-512x512.png'>        
                <link rel='icon' type='image/png' sizes='16x16' href='/pwa/favicon-16x16.png'>

                <link rel='manifest' href='/site.webmanifest'>

                <link rel='apple-touch-icon' sizes='180x180' href='/pwa/apple-touch-icon.png'>
                <link rel='mask-icon' href='/pwa/safari-pinned-tab.svg' color='${themeColor}'>
                <meta name='apple-mobile-web-app-title' content='${renderInstanceTitle(pathObj)}'>
                
                <meta name='application-name' content='${renderInstanceTitle(pathObj)}'>

                <meta name='msapplication-config' content='${internalApi.getHost()}/browserconfig.xml' />
                <meta name='msapplication-TileColor' content='${themeColor}'>
                <meta name='msapplication-TileImage' content='${internalApi.getHost()}/pwa/mstile-144x144.png'>
                <meta name='theme-color' content='${themeColor}'>
        
                <meta property='og:title' content='${renderInstanceTitle(pathObj)}' />
                <meta property='og:description' content='${description.en}' />
                <meta property='og:image' content='${internalApi.getHost()}${socialImgPath}' />
                <meta property='og:url' content='${canonicalURL}' />
                <meta name='twitter:card' content='summary_large_image' />
        
                ${htmlJsTagModules}

                <link rel='stylesheet' href='/${nameSrcFileApp}.css'>
            </head>
            <body>
                <script type='module' src='/${nameSrcFileApp}.js' async></script>
            </body>
            </html>  
        `,
      // .replaceAll(`\n`, ' ')
      // .replaceAll('\t', ' '),
      'utf8'
    );
  });

  // app.use('/', express.static('./builds/www'));
  app.use('/', express.static(dir));
  app.post(process.env.API_BASE + '/user-render', authValidator, userRender);
};

export { httpClient };
