import { loggerFactory } from '../../components/core/Logger.js';
import { getProxyPath } from '../../components/core/VanillaJs.js';

const logger = loggerFactory(import.meta);

// https://developer.mozilla.org/en-US/docs/Web/API/AbortController

const basePath = 'api/';
const ApiBase = (options = { id: '', endpoint: '' }) =>
  `${location.origin}${getProxyPath()}${basePath}${options?.endpoint ? options.endpoint : ''}${
    options?.id ? `/${options.id}` : ''
  }`;

logger.info('Load service');

const endpoint = 'core';

const CoreService = {
  getRaw: (options = { url: '' }) =>
    new Promise((resolve, reject) =>
      fetch(options.url, {
        method: 'GET',
        // headers: {
        //   // 'Content-Type': 'application/json',
        //   // 'Authorization': ''
        // },
        // body,
      })
        .then(async (res) => {
          return await res.text();
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
  put: (options = { id: '' }) =>
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
  get: (options = { id: '', body: {} }) =>
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

export { CoreService, ApiBase };
