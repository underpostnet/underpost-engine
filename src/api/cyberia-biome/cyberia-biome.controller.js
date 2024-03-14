import { loggerFactory } from '../../server/logger.js';
import { CyberiaBiomeService } from './cyberia-biome.service.js';
const logger = loggerFactory(import.meta);

const CyberiaBiomeController = {
  post: async (req, res, options) => {
    try {
      return res.status(200).json({
        status: 'success',
        data: await CyberiaBiomeService.post(req, res, options),
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
      // throw { message: 'error test' };
      return res.status(200).json({
        status: 'success',
        message: 'success-biome',
        data: await CyberiaBiomeService.get(req, res, options),
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
      const result = await CyberiaBiomeService.delete(req, res, options);
      if (!result)
        return res.status(400).json({
          status: 'error',
          message: 'item not found',
        });

      return res.status(200).json({
        status: 'success',
        data: result,
        message: 'success-delete',
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

export { CyberiaBiomeController };
