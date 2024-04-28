import { loggerFactory } from '../../server/logger.js';
import { DefaultService } from './default.service.js';

const logger = loggerFactory(import.meta);

const DefaultController = {
  post: async (req, res, options) => {
    try {
      const result = await DefaultService.post(req, res, options);
      if (!result)
        return res.status(400).json({
          status: 'error',
          message: 'item not found',
        });
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  },
  get: async (req, res, options) => {
    try {
      // throw { message: 'error default' };
      const result = await DefaultService.put(req, res, options);
      if (!result)
        return res.status(400).json({
          status: 'error',
          message: 'item not found',
        });
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  },
  put: async (req, res, options) => {
    try {
      // throw { message: 'error default' };
      const result = await DefaultService.get(req, res, options);
      if (!result)
        return res.status(400).json({
          status: 'error',
          message: 'item not found',
        });
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  },
  delete: async (req, res, options) => {
    try {
      const result = await DefaultService.delete(req, res, options);
      if (!result)
        return res.status(400).json({
          status: 'error',
          message: 'item not found',
        });
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  },
};

export { DefaultController };
