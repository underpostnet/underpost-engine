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
      passphrase,
    },
  };
};

const createKeys = (req, res) => {
  try {
    // const { publicKey, privateKey } = crypto.generateKeyPairSync(keyType, keyConfig(req.body.passphrase));

    console.log('createKeys body', req.body);

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'ok',
      },
    });
    // return res.status(401).json({
    //   status: 'error',
    //   data: {
    //     message: 'user not found',
    //   },
    // });
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
