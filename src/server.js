'use strict';

import dotenv from 'dotenv';
import { httpClient } from './http-server.js';
import { wsServer } from './ws-server.js';
import express from 'express';
import { authApi } from './auth.js';
import { createServer } from 'http';

dotenv.config();
console.log(process.argv);
console.log(`version: `, process.env.npm_package_version);
console.log(`env: `, process.env.NODE_ENV);

const app = express();

// parse requests of content-type - application/json
app.use(express.json({ limit: '20MB' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '20MB' }));

httpClient(app);

authApi(app);

const server = createServer({}, app);

wsServer(server);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

if (process.env.NODE_ENV === 'prod') {
  console.log = () => null;
  console.warn = () => null;
}
