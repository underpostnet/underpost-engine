import { io } from 'socket.io/client-dist/socket.io.esm.min.js';
import { loggerFactory } from './Logger.js';
import { getProxyPath } from './VanillaJs.js';

const logger = loggerFactory(import.meta);

const SocketIo = {
  Event: {
    connect: {},
    connect_error: {},
    disconnect: {},
  },
  Init: async function (options) {
    const { protocol, host } = window.location;
    this.host = `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}`;
    logger.info(`ws host:`, this.host);
    const path = getProxyPath() !== '/' ? { path: `${getProxyPath()}socket.io/` } : undefined;
    if (path) logger.info(`ws path:`, path);
    this.socket = io(this.host, path);

    this.socket.on('connect', () => {
      logger.info(`event: connect | session id: ${this.socket.id}`);
      Object.keys(this.Event.connect).map((keyEvent) => this.Event.connect[keyEvent]());
    });

    this.socket.on('connect_error', (err) => {
      logger.info(`event: connect_error | reason: ${err.message}`);
      Object.keys(this.Event.connect_error).map((keyEvent) => this.Event.connect_error[keyEvent](err));
    });

    this.socket.on('disconnect', (reason) => {
      logger.info(`event: disconnect | reason: ${reason}`);
      Object.keys(this.Event.disconnect).map((keyEvent) => this.Event.disconnect[keyEvent](reason));
    });

    if (options && 'channels' in options) this.setChannels(options.channels);
  },
  setChannels: function (channels) {
    Object.keys(channels).map((type) => {
      logger.info(`load chanel`, type);
      this.Event[type] = {};
      this.socket.on(type, (...args) => {
        logger.info(`event: ${type} | ${JSON.stringify(args, null, 4)}`);
        Object.keys(this.Event[type]).map((keyEvent) => this.Event[type][keyEvent](args));
      });
    });
  },
};

export { SocketIo };
