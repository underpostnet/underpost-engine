import fs from 'fs';
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
  passwordMatchValidator,
  renderLang,
  merge,
} from '../../core/modules/common.js';
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

    return await login(req, res, internalApi);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      data: {
        message: error.message,
      },
    });
  }
};

const login = async (req, res, internalApi) => {
  try {
    const user = getUsers().find((user) => user.email == req.body.email.toLowerCase());
    if (!user)
      return res.status(400).json({
        status: 'error',
        data: {
          message: renderLang({ en: 'user not found', es: 'usuario no encontrado' }, req),
        },
      });
    // To check a password:
    // Load hash from your password DB.
    const validate = await new Promise((resolve) => {
      bcrypt.compare(`${req.body.password}`, user.password, function (err, result) {
        resolve(result);
      });
    });
    if (validate === true) {
      const token = jwt.sign(
        {
          user,
        },
        process.env.SECRET,
        { expiresIn: `${process.env.EXPIRE}h` }
      );
      return res.status(200).json({
        status: 'success',
        data: {
          token,
          element: instanceInitElementByUser(user),
          message: renderLang({ es: 'Ingreso exitoso', en: 'Success Login' }, req),
        },
      });
    }
    return res.status(400).json({
      status: 'error',
      data: {
        message: renderLang({ en: 'User not found', es: 'Usuario no encontrado' }, req),
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

const verifyToken = (req, res, token, next) => {
  try {
    const response = jwt.verify(token, process.env.SECRET);
    // console.log('verifyToken response', response);
    if (typeof response == 'object') {
      if (response.exp * 1000 <= +new Date())
        return res.status(401).json({
          status: 'error',
          data: {
            message: 'expire unauthorized',
          },
        });
      const user = getUsers().find((user) => user.email == response.user.email && user.pass == response.user.pass);
      if (user) {
        req.user = user;
        return next();
      }
    }
    return res.status(401).json({
      status: 'error',
      data: {
        message: 'unauthorized',
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      data: {
        message: 'verify token | ' + error.message,
      },
    });
  }
};

const verifySession = (req, res) => {
  try {
    if (req.user) {
      delete req.user.password;
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'ok',
          user: req.user,
        },
      });
    }
    return res.status(401).json({
      status: 'error',
      data: {
        message: 'user not found',
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

const authValidator = (req, res, next) => {
  try {
    const authHeader = String(req.headers['authorization'] || req.headers['Authorization'] || '');
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7, authHeader.length);
      return verifyToken(req, res, token, next);
    }
    return res.status(401).json({
      status: 'error',
      data: {
        message: 'invalid token',
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

const instanceInitElementByUser = (user) => {
  const { username, email, element } = user;
  return { ...element, _id: user.id, email, username };
};

const updateUser = (user) => {
  const users = getUsers();
  const indexUser = users.findIndex((_user) => _user.id === user.id);
  if (indexUser > -1) {
    users[indexUser] = merge(users[indexUser], user);
    writeUsers(users);
    return {
      status: 'success',
      data: {
        message: 'user updated',
        user: users[indexUser],
      },
    };
  }
  return {
    status: 'error',
    data: {
      message: 'user not found',
      user,
    },
  };
};

const getUserByToken = async (token) => {
  const req = {};
  await new Promise((resolve) =>
    verifyToken(
      req,
      {
        status: () => {
          return { json: () => resolve() };
        },
      },
      token,
      () => resolve()
    )
  );
  if (req.user) return req.user;
  return false;
};

const getUserById = (id) => getUsers().find((user) => user.id === id);

const updateElementUser = async (element) => {
  const user = await getUserById(element._id);
  if (user) {
    user.element = element;
    updateUser(user);
    return true;
  }
  return false;
};

const authApi = (app, internalApi) => {
  internalApi.verifyToken = verifyToken;
  internalApi.updateUser = updateUser;
  internalApi.getUserByToken = getUserByToken;
  internalApi.getUserById = getUserById;
  internalApi.updateElementUser = updateElementUser;
  internalApi.instanceInitElementByUser = instanceInitElementByUser;
  app.post(process.env.API_BASE + '/auth/register', (req, res) => register(req, res, internalApi));
  app.post(process.env.API_BASE + '/auth/login', (req, res) => login(req, res, internalApi));
  app.get(process.env.API_BASE + '/auth/validate/email/:email', (req, res) => validateEmail(req, res, internalApi));
  app.get(process.env.API_BASE + '/auth/validate/username/:username', (req, res) =>
    validateUsername(req, res, internalApi)
  );
  app.post(process.env.API_BASE + '/auth/validate/session', authValidator, verifySession);
};

export { authApi };
