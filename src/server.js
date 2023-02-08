

'use strict'

import express from 'express'
import dotenv from 'dotenv'
import { clientBuild } from './client-build.js'

dotenv.config();
console.log(process.argv);
console.log(`version: `, process.env.npm_package_version);
console.log(`env: `, process.env.NODE_ENV);

const httpClient = express()
const dirClient = './public'
const pathsClient = [
    {
        path: ''
    },
    {
        path: 'test/test'
    }
];

clientBuild(dirClient, pathsClient)
httpClient.use('/', express.static(dirClient))

httpClient.listen(process.env.CLIENT_PORT, () => {
    console.log(`httpClient Server is running on port ${process.env.CLIENT_PORT}`)
})