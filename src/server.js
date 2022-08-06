'use strict';

// nodejs
import express from 'express';

// server modules
import { morganMiddleware } from './modules/morgan.js';
import { logger } from './modules/logger.js';
import fileUpload from 'express-fileupload';

// buil dev env
import { buildDev } from './build-dev.js';

// api
import { apiUtil } from './api/util.js';
import { apiKeys } from './api/keys.js';
import { apiUploader } from './api/uploader.js';
import { apiAuth } from './api/auth.js';

// server side client render
import { ssr } from './client/core/ssr.js';

// views modules
import { engine } from './client/modules/engine.js';
import { underpost } from './client/modules/underpost.js';
import { cryptokoyn } from './client/modules/cryptokoyn.js';
import { authClient } from './client/modules/auth.js';

import dotenv from 'dotenv';

const app = express();
buildDev(app);
dotenv.config();

// parse requests of content-type - application/json
// app.use(bodyParser.json({ limit: '25mb' }));
app.use(express.json({ limit: '20MB' }));

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));
app.use(express.urlencoded({ extended: true, limit: '20MB' }));
app.use(fileUpload());

// log events
app.use(morganMiddleware);

// apiUtil(app);
apiKeys(app);
apiAuth(app);

apiUploader(app);
ssr(app, [engine]);
ssr(app, [underpost]);
ssr(app, [authClient]);
ssr(app, [cryptokoyn, authClient]);

app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});
