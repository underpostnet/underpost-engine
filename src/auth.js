import fs from 'fs';
import { emailValidator, passwordValidator, usernameValidator, passwordMatchValidator } from './common.js';
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

const register = (req, res) => {
  try {
    console.log('register', req.body);

    const { username, email, password, repeat_password } = req.body;
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

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'ok',
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
