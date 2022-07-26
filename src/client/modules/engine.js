import { newInstance } from "../../api/util.js";

const clientID = 'engine';
const viewMetaData = {
    clientID,
    mainTitle: 'Engine',
    favicon: {
        type: 'image/png',
        path: '/assets-underpost/underpost.png'
    },
    apiURIS: [
        {
            name: 'apiUploader',
            path: 'uploader'
        }
    ],
    lang: 'en',
    charset: 'utf-8',
    dir: 'ltr',
    styles: [
        `./underpost_modules/underpost-library/engine/global.css`,
        `./underpost_modules/underpost-library/engine/spinner-ellipsis.css`
    ],
    srcCSS: [
        '/simplemde/simplemde.min.css',
        '/assets/prism/prism.css',
        '/spectre-markdown.css/dist/markdown.min.css'
    ],
    srcJS: [
        '/tinymce/tinymce.min.js',
        '/simplemde/simplemde.min.js',
        '/assets/prism/prism.js',
        '/marked/marked.min.js'
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
        path: baseHome + '/editor',
        homePaths: [baseHome],
        title: { en: 'editor', es: 'editor' },
        component: 'editor',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true,
        session: true
    },
    {
        path: baseHome + '/markdown',
        homePaths: [baseHome],
        title: { en: 'markdown', es: 'markdown' },
        component: 'markdown',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true,
        session: true
    },
    {
        path: baseHome + '/js-demo',
        homePaths: [baseHome],
        title: { en: 'js-demo', es: 'js-demo' },
        component: 'js_demo',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true,
        session: true
    },
    {
        path: baseHome + '/my-content',
        homePaths: [baseHome],
        title: { en: 'My Content', es: 'Mi contenido' },
        component: 'my_content',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true,
        session: true
    },
    {
        path: baseHome + '/view-content',
        homePaths: [baseHome],
        title: { en: 'View Content', es: 'Ver contenido' },
        component: 'view_content',
        options: false,
        menu: false,
        home: false,
        nohome: false,
        render: true,
        display: true,
        session: true
    },
    {
        path: baseHome + '/cloud',
        homePaths: [baseHome],
        title: { en: 'Cloud', es: 'Cloud' },
        component: 'cloud',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true,
        session: true
    },
    {
        path: baseHome + '/:username',
        paths: [baseHome + '/boards'], // , baseHome + '/:username/content/:filename'
        homePaths: [baseHome],
        title: { en: 'Boards', es: 'Boards' },
        component: 'boards',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true,
        display: true,
        session: false
    }
];

// clone views
let fileNamePath = newInstance(viewPaths.find(dataPath => dataPath.path == baseHome + '/:username'));
fileNamePath.clone = true;
fileNamePath.menu = false;
fileNamePath.path = baseHome + '/:username/content/:filename';
fileNamePath.paths = [];
viewPaths.push(fileNamePath);

const engine = {
    viewMetaData,
    viewPaths,
    baseHome
};

export { engine };