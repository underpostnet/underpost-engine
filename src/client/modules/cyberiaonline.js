
import { media } from './media.js';
import fs from 'fs';
import { baseStaticUri } from '../../api/util.js';

const clientID = 'cyberiaonline';
const viewMetaData = {
    clientID,
    mainTitle: 'Cyberia Online',
    host: 'cyberiaonline.com',
    // googleTag: 'G-B26K8P2KGL',
    subDomain: 'services',
    description: { es: '', en: '', hide: true },
    socialImg: '/assets/apps/cyberiaonline/CYBERIA.jpg',
    mainColor: 'blue',
    mainBackground: 'black',
    favicon: {
        type: 'image/png',
        path: '/assets/apps/cyberiaonline/favicon-32x32.png',
        ico: '/private-engine/express-ywork/cyberia/assets/app/favicon.ico'
    },
    apiURIS: [],
    lang: 'en',
    charset: 'utf-8',
    dir: 'ltr',
    // srcJS: ['https://cdn.jsdelivr.net/npm/phaser@3.15.1/dist/phaser-arcade-physics.min.js'],
    srcJS: ['https://pixijs.download/release/pixi.js', '/pathfinding-browser.min.js'],
    styles: [
        `./underpost_modules/underpost-library/engine/global.css`,
        `./underpost_modules/underpost-library/engine/spinner-ellipsis.css`
    ],
    statics: [
        ['/assets/apps/cyberiaonline', `./private-engine/express-ywork/cyberia/assets/app`]
    ]
};

const baseHome = '/' + clientID;

// module render group
const viewPaths = [
    {
        path: baseHome,
        homePaths: [baseHome],
        title: { en: '', es: '' },
        component: 'main_menu',
        options: false,
        menu: true,
        home: true,
        nohome: true,
        render: true,
        display: true
    },
    {
        path: baseHome + '/phaser',
        homePaths: [baseHome],
        title: { en: 'Phaser', es: 'Phaser' },
        component: 'phaser',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: false,
        display: true
    },
    {
        path: baseHome + '/bodys_gfx',
        homePaths: [baseHome],
        title: { en: 'bodys_gfx', es: 'bodys_gfx' },
        component: 'bodys_gfx',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true
    },
    {
        path: baseHome + '/test',
        homePaths: [baseHome],
        title: { en: 'test', es: 'test' },
        component: 'test',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true
    },
    {
        path: baseHome + '/cyberiaonline',
        homePaths: [baseHome],
        title: { en: 'cyberiaonline', es: 'cyberiaonline' },
        component: 'cyberiaonline',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true
    }
];

const statics = app => {

    const BSU = baseStaticUri(viewMetaData);

    media.statics(app, viewMetaData.clientID);

    const pathfinding = fs.readFileSync('./underpost_modules/underpost-library/lib/pathfinding-browser.min.js', 'utf8');
    app.get(BSU + '/pathfinding-browser.min.js', (req, res) => {
        res.writeHead(200, {
            'Content-Type': ('application/javascript; charset=utf-8')
        });
        return res.end(pathfinding);
    });

    if (process.argv[2] == 'build') {
        fs.writeFileSync(`./builds/${viewMetaData.clientID}/pathfinding-browser.min.js`, pathfinding, 'utf8');

    }
};

const cyberiaonline = {
    viewMetaData,
    viewPaths,
    baseHome,
    statics
};

export { cyberiaonline };