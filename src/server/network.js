import detect from 'detect-port';
import fs from 'fs-extra';

import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';
import { killPortProcess } from 'kill-port-process';
import { loggerFactory } from './logger.js';
import { orderArrayFromAttrInt } from '../client/components/core/CommonJs.js';

// Network Address Translation Management

// import dotenv from 'dotenv';
// dotenv.config();

const logger = loggerFactory(import.meta);

const network = {
  port: {
    status: async (ports) => {
      const status = [];
      for (const port of ports) {
        status.push({
          port,
          open: await new Promise((resolve) =>
            detect(port)
              .then((_port) => {
                if (port == _port)
                  // `port: ${port} was not occupied`
                  return resolve(false);

                // `port: ${port} was occupied, try port: ${_port}`
                return resolve(true);
              })
              .catch((error) => resolve(`${error.message}`)),
          ),
        });
      }
      return status;
    },
    kill: async (ports) => await killPortProcess(ports),
    portClean: async function (port) {
      const [portStatus] = await this.status([port]);
      // logger.info('port status', portStatus);
      if (portStatus.open) await this.kill([port]);
    },
  },
};

const ip = {
  public: {
    get: async () => await publicIp(), // => 'fe80::200:f8ff:fe21:67cf'
    ipv4: async () => await publicIpv4(), // => '46.5.21.123'
    ipv6: async () => await publicIpv6(), // => 'fe80::200:f8ff:fe21:67cf'
  },
};

let ipInstance = '';
const networkRouter = {};

const logRuntimeRouter = () => {
  const displayLog = {};

  for (const host of Object.keys(networkRouter))
    for (const path of Object.keys(networkRouter[host]))
      displayLog[networkRouter[host][path].publicHost] = networkRouter[host][path].local;

  logger.info('Runtime network:', displayLog);
};

const saveRuntimeRouter = () =>
  fs.writeFileSync(
    `./tmp/runtime-router.${process.argv[3] ? process.argv[3] : 'default'}.json`,
    JSON.stringify(networkRouter, null, 4),
    'utf-8',
  );

const listenPortController = async (server, port, metadata) =>
  new Promise((resolve) => {
    try {
      const { host, path, client, runtime, meta } = metadata;
      const error = [];
      if (port === undefined) error.push(`port`);
      if (host === undefined) error.push(`host`);
      if (path === undefined) error.push(`path`);
      if (client === undefined) error.push(`client`);
      if (runtime === undefined) error.push(`runtime`);
      if (meta === undefined) error.push(`meta`);
      if (error.length > 0) throw new Error('Lister port controller metadata undefined values: ' + error.join(', '));

      server.listen(port, () => {
        if (!networkRouter[host]) networkRouter[host] = {};
        networkRouter[host][path] = {
          meta,
          client,
          runtime,
          port,
          public: `http://${ipInstance}:${port}${path}`,
          publicHost:
            port === 80
              ? `http://${host}${path}`
              : port === 443
              ? `https://${host}${path}`
              : `http://${host}:${port}${path}`,
          local: `http://localhost:${port}${path}`,
        };

        return resolve(true);
      });
    } catch (error) {
      logger.error(error, error.stack);
      resolve(false);
    }
  });

export { ip, network, listenPortController, networkRouter, saveRuntimeRouter, logRuntimeRouter };
