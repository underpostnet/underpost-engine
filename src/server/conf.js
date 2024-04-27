import fs from 'fs-extra';
import dotenv from 'dotenv';
import { newInstance } from '../client/components/core/CommonJs.js';
import * as dir from 'path';

// monitoring: https://app.pm2.io/

const Config = {
  default: {
    client: {
      default: {
        metadata: {
          title: 'App',
        },
        components: {
          core: [
            'CommonJs',
            'VanillaJs',
            'Responsive',
            'Keyboard',
            'Translate',
            'Modal',
            'BtnIcon',
            'Logger',
            'Css',
            'NotificationManager',
            'ToggleSwitch',
            'DropDown',
            'LoadingAnimation',
            'EventsUI',
            'AgGrid',
            'Input',
            'Validator',
            'SignUp',
            'LogIn',
            'LogOut',
            'Router',
            'Account',
            'Auth',
            'ToolBar',
            'HomeBackground',
            'Worker',
          ],
          default: [
            'Menu',
            'RoutesDefault',
            'Elements',
            'CommonDefault',
            'CssDefault',
            'LogInDefault',
            'LogOutDefault',
            'SignUpDefault',
            'TranslateDefault',
            'Settings',
          ],
        },
        views: [
          {
            path: '/',
            title: 'Home',
            client: 'Default',
            ssr: 'Default',
          },
          {
            path: '/settings',
            client: 'Default',
            ssr: 'Default',
          },
          {
            path: '/log-in',
            client: 'Default',
            ssr: 'Default',
          },
          {
            path: '/sign-up',
            client: 'Default',
            ssr: 'Default',
          },
          {
            path: '/log-out',
            client: 'Default',
            ssr: 'Default',
          },
          {
            path: '/account',
            client: 'Default',
            ssr: 'Default',
          },
        ],
        dists: [
          {
            folder: './node_modules/@neodrag/vanilla/dist/min',
            public_folder: '/dist/@neodrag-vanilla',
            import_name: '@neodrag/vanilla',
            import_name_build: '/dist/@neodrag-vanilla/index.js',
          },
          {
            folder: './node_modules/@fortawesome/fontawesome-free',
            public_folder: '/dist/fontawesome',
          },
          {
            folder: './node_modules/sortablejs/modular',
            public_folder: '/dist/sortablejs',
            import_name: 'sortablejs',
            import_name_build: '/dist/sortablejs/sortable.complete.esm.js',
          },
          {
            folder: './node_modules/validator',
            public_folder: '/dist/validator',
          },
          {
            folder: './node_modules/@loadingio/css-spinner/entries',
            public_folder: '/dist/loadingio',
          },
          {
            import_name: 'ag-grid-community',
            import_name_build: '/dist/ag-grid-community/ag-grid-community.auto.complete.esm.min.js',
            folder: './node_modules/ag-grid-community/dist',
            public_folder: '/dist/ag-grid-community',
            styles: './node_modules/ag-grid-community/styles',
            public_styles_folder: '/styles/ag-grid-community',
          },
        ],
        services: ['core', 'user', 'test'],
      },
    },
    ssr: {
      Default: {
        head: ['DefaultScripts'],
        body: [],
      },
    },
    server: {
      'default.net': {
        '/': {
          client: 'default',
          runtime: 'nodejs',
          apis: ['user', 'test'],
          origins: [],
          minifyBuild: false,
          lightBuild: false,
          proxy: [80, 443],
          db: {
            provider: 'mongoose',
            host: 'mongodb://127.0.0.1:27017',
            name: 'default',
          },
        },
      },
      'www.default.net': {
        '/': {
          client: null,
          runtime: 'nodejs',
          apis: [],
          origins: [],
          minifyBuild: false,
          lightBuild: true,
          proxy: [80, 443],
        },
      },
    },
    dns: {
      ipDaemon: {
        ip: null,
        minutesTimeInterval: 3,
        disabled: false,
      },
      records: {
        A: [
          {
            host: 'example.com',
            dns: 'dondominio',
            api_key: '???',
            user: '???',
          },
        ],
      },
    },
  },
  build: async function (options = { folder: '' }) {
    if (!fs.existsSync(`./tmp`)) fs.mkdirSync(`./tmp`, { recursive: true });
    if (fs.existsSync(`./engine-private/conf/${process.argv[2]}`)) return loadConf(process.argv[2]);
    if (process.argv[2] === 'deploy') return;
    if (process.argv[2] === 'proxy') {
      this.default.server = {};
      for (const deployId of process.argv[3].split(',')) {
        const serverConf = loadReplicas(
          JSON.parse(fs.readFileSync(`./engine-private/conf/${deployId}/conf.server.json`, 'utf8')),
        );
        // this.default.server = {
        //   ...this.default.server,
        //   ...serverConf,
        // };
        for (const host of Object.keys(serverConf)) {
          if (serverConf[host]['/'])
            this.default.server[host] = {
              ...this.default.server[host],
              ...serverConf[host],
            };
          else
            this.default.server[host] = {
              ...serverConf[host],
              ...this.default.server[host],
            };
        }
      }
    }
    if (!options || !options.folder)
      options = {
        ...options,
        folder: `./conf`,
      };
    if (!fs.existsSync(options.folder)) fs.mkdirSync(options.folder, { recursive: true });
    for (const confType of Object.keys(this.default)) {
      fs.writeFileSync(
        `${options.folder}/conf.${confType}.json`,
        JSON.stringify(this.default[confType], null, 4),
        'utf8',
      );
    }
  },
};

const loadConf = (deployId) => {
  const folder = `./engine-private/conf/${deployId}`;
  if (!fs.existsSync(`./conf`)) fs.mkdirSync(`./conf`);
  for (const typeConf of Object.keys(Config.default)) {
    let srcConf = fs.readFileSync(`${folder}/conf.${typeConf}.json`, 'utf8');
    if (typeConf === 'server') srcConf = JSON.stringify(loadReplicas(JSON.parse(srcConf)), null, 4);
    fs.writeFileSync(`./conf/conf.${typeConf}.json`, srcConf, 'utf8');
  }
  fs.writeFileSync(`./.env.production`, fs.readFileSync(`${folder}/.env.production`, 'utf8'), 'utf8');
  fs.writeFileSync(`./.env.development`, fs.readFileSync(`${folder}/.env.development`, 'utf8'), 'utf8');
  fs.writeFileSync(`./.env.test`, fs.readFileSync(`${folder}/.env.test`, 'utf8'), 'utf8');
  if (process.env.NODE_ENV) {
    fs.writeFileSync(`./.env`, fs.readFileSync(`${folder}/.env.${process.env.NODE_ENV}`, 'utf8'), 'utf8');
    const env = dotenv.parse(fs.readFileSync(`${folder}/.env.${process.env.NODE_ENV}`, 'utf8'));
    process.env = {
      ...process.env,
      ...env,
    };
  }
  fs.writeFileSync(`./package.json`, fs.readFileSync(`${folder}/package.json`, 'utf8'), 'utf8');
  return { folder, deployId };
};

const loadReplicas = (confServer) => {
  for (const host of Object.keys(confServer)) {
    for (const path of Object.keys(confServer[host])) {
      const { replicas } = confServer[host][path];
      if (replicas)
        for (const replicaPath of replicas) {
          confServer[host][replicaPath] = newInstance(confServer[host][path]);
          delete confServer[host][replicaPath].replicas;
        }
    }
  }
  return confServer;
};

const cloneConf = async (
  { toOptions, fromOptions },
  fromDefaultOptions = { deployId: 'default-3001', clientId: 'default' },
) => {
  if (!fromOptions.deployId) fromOptions.deployId = fromDefaultOptions.deployId;
  if (!fromOptions.clientId) fromOptions.clientId = fromDefaultOptions.clientId;

  const confFromFolder = `./engine-private/conf/${fromOptions.deployId}`;
  const files = await fs.readdir(confFromFolder, { recursive: true });

  for (const relativePath of files) {
    const filePath = dir.resolve(`${confFromFolder}/${relativePath}`);
    console.log(filePath);
  }
};

export { Config, loadConf, loadReplicas, cloneConf };
