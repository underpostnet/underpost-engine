'use strict';

import { IoServer } from '../IoServer.js';
import { DefaultWsConnection } from './default.ws.connection.js';
import { DefaultWsDefaultManagement } from './management/default.ws.default.js';

// https://socket.io/docs/v3/

const createIoServer = async (httpServer, options) => {
  const { host, path } = options;
  const wsManagementId = `${host}${path}`;

  DefaultWsDefaultManagement.instance(wsManagementId);

  return IoServer(httpServer, options, (socket) => DefaultWsConnection(socket, wsManagementId));
};

const DefaultWsServer = createIoServer;

export { createIoServer, DefaultWsServer };
