import fs from 'fs';
import { emailValidator, passwordValidator, usernameValidator, passwordMatchValidator, renderLang } from './common.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const collection = 'users.json';
const collectionFolder = './data/cyberia/';
const collectionPath = collectionFolder + collection;
const getUsers = () => JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
const writeUsers = (users) => fs.writeFileSync(collectionPath, JSON.stringify(users, null, 4), 'utf8');
if (!fs.existsSync(collectionFolder)) fs.mkdirSync(collectionFolder, { recursive: true });
if (!fs.existsSync(collectionPath)) writeUsers([]);
const saltRounds = 10;

const register = async (req, res) => {
  try {
    console.log('register', req.body);

    let { username, email, password, repeat_password } = req.body;

    email = email.toLowerCase().trim();
    username = username.trim();

    if (
      !emailValidator(email, req).validate ||
      !passwordValidator(password, req).validate ||
      !usernameValidator(username, req).validate ||
      !passwordMatchValidator(password, repeat_password, req).validate
    )
      return res.status(400).json({
        status: 'error',
        data: {
          message: 'common validate error',
        },
      });

    if (getUsers().find((user) => user.email === email))
      return res.status(400).json({
        status: 'error',
        data: {
          message: renderLang({ es: 'email existente', en: 'email already exist' }, req),
        },
      });

    if (getUsers().find((user) => user.username.toLowerCase() === username.toLowerCase()))
      return res.status(400).json({
        status: 'error',
        data: {
          message: renderLang({ es: 'username existente', en: 'username already exist' }, req),
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

    const user = { username, email, password };
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

const authApi = (app) => {
  app.post('/api/v1/auth/register', register);
};

export { authApi };
