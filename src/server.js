

'use strict'

import express from 'express'
import fs from 'fs'
import { commonFunctions } from './common.js'

if (!fs.existsSync('./public')) fs.mkdirSync('./public')

fs.writeFileSync('./public/index.html', /*html*/`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>CYBERIA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <script>
            (function(){
                ${commonFunctions()}
                ${fs.readFileSync('./src/vanilla.js', 'utf8')}
                ${fs.readFileSync('./src/client.js', 'utf8')}
            })()
        </script>
    </body>
    </html>      
`, 'utf8');

const app = express()

app.use('/', express.static('./public'))

app.listen(5000, () => {
    console.log('server runing on port 5000')
})