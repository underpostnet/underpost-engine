
const clientID = 'cryptokoyn';
const viewMetaData = {
    clientID,
    mainTitle: 'Koyn UI',
    description: { en: 'CyberiaOnline Asymmetric Key Manager', es: 'Gestor de Llaves asymetricias de CyberiaOnline' },
    favicon: {
        type: 'image/png',
        path: '/assets/cryptokoyn.png'
    },
    apiURIS: [
        {
            name: 'uriApi',
            path: 'keys'
        }
    ],
    lang: 'en',
    charset: 'utf-8',
    dir: 'ltr',
    styles: [
        `./src/client/assets/styles/global.css`,
        `./src/client/assets/styles/spinner-ellipsis.css`
    ]
};

const baseHome = '/wallet';

// module render group
const viewPaths = [
    {
        path: baseHome,
        homePaths: [baseHome],
        title: { en: '', es: '' },
        component: 'main_menu',
        options: false,
        menu: false,
        home: false,
        nohome: true,
        render: true,
        display: true
    },
    {
        path: baseHome + '/keys/create',
        homePaths: [baseHome],
        title: { en: 'Create Key', es: 'Crear Llaves' },
        component: 'form_key',
        options: false,
        menu: true,
        home: true,
        nohome: false,
        render: true,
        display: true
    },
    {
        path: baseHome + '/keys/search',
        homePaths: [baseHome],
        title: { en: 'Search Key', es: 'Buscar Llave' },
        component: 'form_key_search',
        options: { origin: 'form_key', mode: 'search' },
        menu: true,
        home: true,
        nohome: false,
        render: true,
        display: true
    },
    {
        path: baseHome + '/keys/list',
        homePaths: [baseHome],
        title: { en: 'Keys List', es: 'Listar Llave' },
        component: 'table_keys',
        options: false,
        menu: false,
        home: false,
        nohome: false,
        render: true,
        display: false
    }
];

const cryptokoyn = {
    viewMetaData,
    viewPaths,
    baseHome
};

export { cryptokoyn };