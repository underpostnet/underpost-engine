import express from 'express';
import { httpClient } from './http-server.js';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.argv);
console.log(`version: `, process.env.npm_package_version);
console.log(`env: `, process.env.NODE_ENV);

const app = express();

httpClient(app);

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
