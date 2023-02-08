

'use strict'

import express from 'express'
import dotenv from 'dotenv'
import { clientBuild } from './client-build.js'

dotenv.config();
console.log(process.argv);
console.log(`version: `, process.env.npm_package_version);
console.log(`env: `, process.env.NODE_ENV);

const httpClient = express()

clientBuild('./public', [''].map(path => {
    return { path }
}))
httpClient.use('/', express.static('./public'))

httpClient.listen(process.env.CLIENT_PORT, () => {
    console.log(`httpClient Server is running on port ${process.env.CLIENT_PORT}`)
})