import express from 'express';
import fs from 'fs';
import { commonFunctions } from '../core/modules/common.js'; //JSONweb

const app = express();

app.get('/', (req, res) =>
  res.status(200).send(/*html*/ `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
                    <style>
                         ${fs.readFileSync(`./src/core/css/base.css`, 'utf8')}
                    </style>
                </head>
                <body>
                    <script type='module' async>
                          ${commonFunctions()}
                          ${fs.readFileSync('./src/core/components/vanilla.js', 'utf8')}
                          ${fs.readFileSync('./src/test/client.js', 'utf8')}
                    </script>
                </body>
            </html>  


`)
);

const PORT = 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
