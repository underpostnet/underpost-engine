// import { getBaseComponent } from '../../modules/ssr.js';

const clientID = 'dogmadual';
const viewMetaData = {
    clientID,
    mainTitle: 'DOGMADUAL.com',
    description: { en: 'Virtual machine development', es: 'Virtual machine development' },
    favicon: {
        type: 'image/png',
        path: '/assets/dogmadual/app/android-chrome-192x192.png'
    },
    apiURIS: [],
    lang: 'en',
    charset: 'utf-8',
    dir: 'ltr',
    styles: [
        `./src/client/assets/styles/global.css`,
        `./src/client/assets/styles/spinner-ellipsis.css`
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
        path: baseHome + `/landing`,
        homePaths: [baseHome],
        title: { en: '', es: '' },
        component: 'dogmadual_landing',
        options: false,
        menu: false,
        home: true,
        nohome: false,
        render: true,
        display: true
    }
];

const dogmadual = {
    viewMetaData,
    viewPaths,
    baseHome
};

export { dogmadual };