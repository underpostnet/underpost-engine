import { Auth } from '../../components/core/Auth.js';
import { endpointFactory } from '../../components/core/CommonJs.js';
import { loggerFactory } from '../../components/core/Logger.js';
import { ApiBase } from '../core/core.service.js';

const logger = loggerFactory({ url: `${endpointFactory(import.meta)}-service` });

const endpoint = endpointFactory(import.meta);

logger.info('Load service');

const UserService = {
  post: (options = { id: '', body: {} }) =>
    new Promise((resolve, reject) =>
      fetch(ApiBase({ id: options.id, endpoint }), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: Auth.getJWT(),
        },
        body: JSON.stringify(options.body),
      })
        .then(async (res) => {
          return await res.json();
        })
        .then((res) => {
          logger.info(res);
          return resolve(res);
        })
        .catch((error) => {
          logger.error(error);
          return reject(error);
        }),
    ),
  get: (options = { id: '' }) =>
    new Promise((resolve, reject) =>
      fetch(ApiBase({ id: options.id, endpoint }), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: Auth.getJWT(),
        },
      })
        .then(async (res) => {
          return await res.json();
        })
        .then((res) => {
          logger.info(res);
          return resolve(res);
        })
        .catch((error) => {
          logger.error(error);
          return reject(error);
        }),
    ),
  delete: (options = { id: '', body: {} }) =>
    new Promise((resolve, reject) =>
      fetch(ApiBase({ id: options.id, endpoint }), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: Auth.getJWT(),
        },
        body: JSON.stringify(options.body),
      })
        .then(async (res) => {
          return await res.json();
        })
        .then((res) => {
          logger.info(res);
          return resolve(res);
        })
        .catch((error) => {
          logger.error(error);
          return reject(error);
        }),
    ),
};

export { UserService };
