import express from 'express';
import { httpClient } from './http-server.js';
import dotenv from 'dotenv';
import { keysApi } from './keys.js';

dotenv.config();
console.log(process.argv);
console.log(`version: `, process.env.npm_package_version);
console.log(`env: `, process.env.NODE_ENV);

const app = express();

// parse requests of content-type - application/json
app.use(express.json({ limit: '20MB' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '20MB' }));

keysApi(app);
httpClient(app);

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
