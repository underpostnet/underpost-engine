import { DataBaseProvider } from '../../db/DataBaseProvider.js';
import { loggerFactory } from '../../server/logger.js';
const logger = loggerFactory(import.meta);

const FileService = {
  post: async (req, res, options) => {
    /** @type {import('./file.model.js').FileModel} */
    const File = DataBaseProvider.instance[`${options.host}${options.path}`].mongoose.File;

    const results = [];
    if (!req.files) throw { message: 'not file found' };
    if (Array.isArray(req.files.file)) for (const file of req.files.file) results.push(await new File(file).save());
    else if (Object.keys(req.files).length > 0)
      for (const keyFile of Object.keys(req.files)) results.push(await new File(req.files[keyFile]).save());
    let index = -1;
    for (const file of results) {
      index++;
      const [result] = await File.find({
        _id: file._id,
      }).select({ _id: 1, name: 1, mimetype: 1 });
      results[index] = result;
    }
    return results;
  },
  get: async (req, res, options) => {
    /** @type {import('./file.model.js').FileModel} */
    const File = DataBaseProvider.instance[`${options.host}${options.path}`].mongoose.File;

    let result = {};
    switch (req.params.id) {
      case 'all':
        result = await File.find();
        break;

      default:
        result = await File.find({
          _id: req.params.id,
        });
        break;
    }
    return result;
  },
  delete: async (req, res, options) => {
    /** @type {import('./file.model.js').FileModel} */
    const File = DataBaseProvider.instance[`${options.host}${options.path}`].mongoose.File;

    let result = {};
    switch (req.params.id) {
      case 'all':
        break;

      default:
        result = await File.findByIdAndDelete(req.params.id);
        break;
    }
    return result;
  },
};

export { FileService };
