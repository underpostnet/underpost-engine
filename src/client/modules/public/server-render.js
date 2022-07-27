
const clientID = 'public';
const viewMetaData = {
    clientID,
    mainTitle: 'underpost.net',
    favicon: {
        type: 'image/png',
        path: '/assets/underpost.png'
    },
    lang: 'en',
    charset: 'utf-8',
    dir: 'ltr',
    router: `./src/client/modules/${clientID}/client-core.js`,
    styles: [
        `./src/client/assets/style/global.css`,
        `./src/client/assets/style/spinner-ellipsis.css`
    ]
};

const baseHome = '/en/';

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
        path: baseHome + 'vanilla-js',
        homePaths: [baseHome],
        title: { en: 'vanilla-js', es: 'vanilla-js' },
        component: 'vanilla_js',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true
    }
];

const _public = {
    viewMetaData,
    viewPaths
};

export { _public };