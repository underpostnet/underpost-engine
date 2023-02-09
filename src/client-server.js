import fs from 'fs'
import { commonFunctions } from './common.js'
import { deleteFolderRecursive } from './files.js'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config();

const clientServer = options => {

    const { paths, dir } = options
    const server = express()

    deleteFolderRecursive(`${dir}`);
    paths.map(pathObj => {
        let { path } = pathObj;
        if (path !== '') path += '/'
        if (!fs.existsSync(`${dir}/${path}`)) fs.mkdirSync(`${dir}/${path}`, { recursive: true });
        console.log('render: ', path);

        fs.writeFileSync(`${dir}/${path}index.html`, /*html*/`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>CYBERIA</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            <script>
                    ${commonFunctions()}
                    ${fs.readFileSync('./src/vanilla.js', 'utf8')}
                    ${fs.readFileSync('./src/client.js', 'utf8')}
            </script>
        </body>
        </html>      
    `, 'utf8');
    });

    server.use('/', express.static(dir))

    server.listen(process.env.CLIENT_PORT, () => {
        console.log(`Client Server is running on port ${process.env.CLIENT_PORT}`)
    })
};

export { clientServer };