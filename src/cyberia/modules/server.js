'use strict';

import dotenv from 'dotenv';
import { httpClient } from './http-server.js';
import { wsServer } from './ws-server.js';
import express from 'express';
import { authApi } from './auth.js';
import { createServer } from 'http';
import { mailerApi } from './mailer.js';
import { itemsApi } from './items.js';
import compression from 'compression';
import { mapsApi } from './maps.js';

dotenv.config();
console.log(process.argv);
console.log(`version: `, process.env.npm_package_version);
console.log(`env: `, process.env.NODE_ENV);

const app = express();

// parse requests of content-type - application/json
app.use(express.json({ limit: '20MB' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '20MB' }));

// json formatted response
app.set('json spaces', 2);

// js compression
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}
app.use(compression({ filter: shouldCompress }));

const internalApi = {
  getHost: (uri) =>
    (process.env.NODE_ENV === 'dev' ? `http://localhost:${process.env.PORT}` : process.env.HOST) + (uri ? uri : ''),
  getIoHost: () => (process.env.NODE_ENV === 'prod' ? process.env.HOST : 'ws://localhost:' + process.env.PORT),
};

httpClient(app, internalApi);

mailerApi(internalApi);

authApi(app, internalApi);

mapsApi(app);

itemsApi(app);

const server = createServer({}, app);

wsServer(server, app, internalApi);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  if (process.env.NODE_ENV === 'prod') {
    console.log = () => null;
    console.warn = () => null;
  }
});
