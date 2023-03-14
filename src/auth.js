import fs from 'fs';
import { emailValidator, passwordValidator } from './common.js';
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

    return res.status(200).json({
      status: 'success',
      data: { body: req.body },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      data: error.message,
    });
  }

  // return res.status(400).json({
  //     status: 'error',
  //     data: 'invalid passphrase'
  // });
  // return res.status(200).json({
  //     status: 'success',
  //     data: { privateKey, publicKey }
  // });
  // return res.status(500).json({
  //     status: 'error',
  //     data: error.message,
  // });
};

const authApi = (app) => {
  app.post('/api/v1/auth/register', register);
};

export { authApi };
