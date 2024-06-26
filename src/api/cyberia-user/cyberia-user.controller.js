import { loggerFactory } from '../../server/logger.js';
import { getCyberiaPortByWorldPath } from '../cyberia-world/cyberia-world.service.js';
import { CyberiaUserService } from './cyberia-user.service.js';
const logger = loggerFactory(import.meta);

const CyberiaUserController = {
  post: async (req, res, options) => {
    try {
      const result = await CyberiaUserService.post(req, res, options);
      if (!result) {
        return res.status(401).json({
          status: 'error',
          data: result,
        });
      }
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
      // throw { message: 'error test' };
      return res.status(200).json({
        status: 'success',
        message: 'success-user',
        data: await CyberiaUserService.get(req, res, options),
      });
    } catch (error) {
      logger.error(error, error.stack);
      return res.status(400).json({
        status: 'error',
        message: error.message,
        data: {
          redirect: `${getCyberiaPortByWorldPath(options, `/${options.cyberia.world.default._doc.name}`)}/${
            options.cyberia.world.default._doc.name
          }`,
        },
      });
    }
  },
  delete: async (req, res, options) => {
    try {
      const result = await CyberiaUserService.delete(req, res, options);
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
  put: async (req, res, options) => {
    try {
      const result = await CyberiaUserService.put(req, res, options);
      if (!result)
        return res.status(400).json({
          status: 'error',
          message: 'item not found',
        });

      return res.status(200).json({
        status: 'success',
        data: result,
        message: 'success-update',
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

export { CyberiaUserController };
