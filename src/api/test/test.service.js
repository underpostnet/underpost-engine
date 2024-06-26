import validator from 'validator';
import { loggerFactory } from '../../server/logger.js';
import { TestModel } from './test.model.js';
import { getYouTubeID } from '../../client/components/core/CommonJs.js';

const logger = loggerFactory(import.meta);

const TestService = {
  post: async (req, res, options) => {
    let result = {};
    switch (req.params.id) {
      default:
        break;
    }
    return result;
  },
  get: async (req, res, options) => {
    let result = {};
    switch (req.params.id) {
      case 'verify-email':
        result = validator.isEmail(req.query.email);
        break;
      case 'youtube-id':
        result = getYouTubeID(req.query.url);
        break;
      default:
        result = false;
        break;
    }
    return result;
  },
  delete: async (req, res, options) => {
    let result = {};
    switch (req.params.id) {
      default:
        break;
    }
    return result;
  },
};

export { TestService };
