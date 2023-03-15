import fs from 'fs';
import { emailValidator, passwordValidator, usernameValidator, passwordMatchValidator, renderLang } from './common.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

const collection = 'users.json';
const collectionFolder = './data/cyberia/';
const collectionPath = collectionFolder + collection;
const getUsers = () => JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
const writeUsers = (users) => fs.writeFileSync(collectionPath, JSON.stringify(users, null, 4), 'utf8');
if (!fs.existsSync(collectionFolder)) fs.mkdirSync(collectionFolder, { recursive: true });
if (!fs.existsSync(collectionPath)) writeUsers([]);
const saltRounds = 10;

const dbValidateUsername = (username, req) => {
  const validate = getUsers().find((user) => user.username.toLowerCase() === username.toLowerCase());
  return {
    msg: validate ? ` > ${renderLang({ es: 'usuario existente', en: 'username already exist' }, req)}` : '',
    validate: validate ? false : true,
  };
};

const dbValidateEmail = (email, req) => {
  const validate = getUsers().find((user) => user.email === email);
  return {
    msg: validate ? ` > ${renderLang({ es: 'email existente', en: 'email already exist' }, req)}` : '',
    validate: validate ? false : true,
  };
};

const register = async (req, res, internalApi) => {
  try {
    // throw {
    //   message: 'test',
    // };
    console.log('register body', req.body);
    let { username, email, password, repeat_password } = req.body;
    email = email.toLowerCase().trim();
    username = username.trim();

    const validators = [
      { type: 'email', result: emailValidator(email, req) },
      { type: 'password', result: passwordValidator(password, req) },
      { type: 'username', result: usernameValidator(username, req) },
      { type: 'repeat-password', result: passwordMatchValidator(password, repeat_password, req) },
    ];

    const errors = validators.filter((validator) => !validator.result.validate);

    // console.log('errors', errors);

    if (errors.length > 0)
      return res.status(400).json({
        status: 'error',
        data: {
          errors,
        },
      });

    const validatorsDB = [
      { type: 'username', result: dbValidateUsername(username, req) },
      { type: 'email', result: dbValidateEmail(email, req) },
    ];

    const errorsDB = validatorsDB.filter((validator) => !validator.result.validate);

    // console.log('errorsDB', errorsDB);

    if (errorsDB.length > 0)
      return res.status(400).json({
        status: 'error',
        data: {
          errors: errorsDB,
        },
      });

    password = await new Promise((resolve, reject) => {
      try {
        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            // Store hash in your password DB.
            resolve(hash);
          });
        });
      } catch (error) {
        return res.status(500).json({
          status: 'error',
          data: {
            message: error.message,
          },
        });
      }
    });

    const time = new Date();
    const createdAt = time.toISOString();
    const timestamp = time.getTime();
    const idConfig = `crypto.createHash('sha256').update(''+timestamp).digest('hex')`;
    // const id = crypto.createHash('sha256').update(timestamp).digest('base64');
    const id = crypto
      .createHash('sha256')
      .update('' + timestamp)
      .digest('hex');
    const elementData = await new Promise((resolve) => {
      internalApi.findUserElementById(req, {
        status: () => {
          return { json: (response) => resolve(response) };
        },
      });
    });
    console.log('elementData', elementData);
    const { element } = elementData.data;

    const user = { username, email, password, createdAt, timestamp, id, idConfig, element };
    const users = getUsers();
    users.push(user);
    writeUsers(users);

    return res.status(200).json({
      status: 'success',
      data: {
        message: renderLang({ es: 'usuario creado', en: 'username created' }, req),
        user,
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

const validateEmail = (req, res, internalApi) => {
  try {
    const { email } = req.params;
    const validators = [
      { type: 'email', result: emailValidator(email, req) },
      { type: 'email', result: dbValidateEmail(email, req) },
    ];
    const errors = validators.filter((validator) => !validator.result.validate);
    // console.log('errors', errors);
    if (errors.length > 0)
      return res.status(400).json({
        status: 'error',
        data: {
          errors,
        },
      });
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'ok',
        email,
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

const validateUsername = (req, res, internalApi) => {
  try {
    const { username } = req.params;
    const validators = [
      { type: 'username', result: usernameValidator(username, req) },
      { type: 'username', result: dbValidateUsername(username, req) },
    ];
    const errors = validators.filter((validator) => !validator.result.validate);
    // console.log('errors', errors);
    if (errors.length > 0)
      return res.status(400).json({
        status: 'error',
        data: {
          errors,
        },
      });
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'ok',
        username,
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

const authApi = (app, internalApi) => {
  app.post(process.env.API_BASE + '/auth/register', (req, res) => register(req, res, internalApi));
  app.get(process.env.API_BASE + '/auth/validate/email/:email', (req, res) => validateEmail(req, res, internalApi));
  app.get(process.env.API_BASE + '/auth/validate/username/:username', (req, res) =>
    validateUsername(req, res, internalApi)
  );
};

export { authApi };
