import { getBaseComponent } from '../../modules/ssr.js';

const clientID = 'underpost';
const viewMetaData = {
    clientID,
    mainTitle: 'underpost.net',
    description: { en: 'Vanilla JS web Components Gallery, Vanilla JS thin layer library', es: 'Galería de componentes web de Vanilla JS, biblioteca de capa fina de Vanilla JS' },
    favicon: {
        type: 'image/png',
        path: '/assets/underpost.png'
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

const baseHome = '/underpost';

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
        display: false
    },
    {
        ...getBaseComponent(baseHome, 'js_demo')
    },
    {
        path: baseHome + '/js-demo',
        homePaths: [baseHome],
        title: { en: 'js demo', es: 'js demo' },
        component: 'js_demo_home',
        options: { origin: 'js_demo', mode: 'home_example' },
        menu: false,
        home: true,
        nohome: false,
        render: true,
        display: true
    }
];

const underpost = {
    viewMetaData,
    viewPaths,
    baseHome
};

export { underpost };