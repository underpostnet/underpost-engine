import crypto from 'crypto';
import fs from 'fs';

const keyType = 'rsa';

const keyConfig = (passphrase) => {
  return {
    modulusLength: 4096,
    namedCurve: 'secp256k1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: passphrase ? passphrase : undefined,
    },
  };
};

const keyFolder = `./data/cryptokoyn/keys/${keyType}-${crypto
  .createHash('sha256')
  .update(JSON.stringify(keyConfig()))
  .digest('hex')}`;

if (!fs.existsSync(keyFolder)) fs.mkdirSync(keyFolder, { recursive: true });

const createKeys = (req, res) => {
  try {
    console.log('createKeys body', req.body);

    if (!req.body.passphrase) {
      return res.status(401).json({
        status: 'error',
        data: {
          message: 'empty passphrase',
        },
      });
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync(keyType, keyConfig(req.body.passphrase));

    const SHA256_HEX_PUBLIC_KEY = crypto.createHash('sha256').update(publicKey).digest('hex');

    fs.mkdirSync(`${keyFolder}/${SHA256_HEX_PUBLIC_KEY}`);
    fs.writeFileSync(`${keyFolder}/${SHA256_HEX_PUBLIC_KEY}/public.pem`, publicKey, 'utf8');
    fs.writeFileSync(`${keyFolder}/${SHA256_HEX_PUBLIC_KEY}/private.pem`, privateKey, 'utf8');

    // console.log('statSync', fs.statSync(`${keyFolder}/${SHA256_HEX_PUBLIC_KEY}/public.pem`));

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'ok',
        SHA256_HEX_PUBLIC_KEY,
        publicKey,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      data: {
        message: error.message,
      },
    });
  }
};

const keysApi = (app) => {
  app.post(process.env.API_BASE + '/keys/create', createKeys);
};

export { keysApi, keyType, keyConfig };
