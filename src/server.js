'use strict';

import dotenv from 'dotenv';
import { httpServer } from './client-server.js';
import { wsServer } from './ws-server.js';

dotenv.config();
console.log(process.argv);
console.log(`version: `, process.env.npm_package_version);
console.log(`env: `, process.env.NODE_ENV);

httpServer();

wsServer();
