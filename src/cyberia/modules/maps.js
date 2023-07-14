import { renderLang } from '../../core/modules/common.js';
import { getAllFiles } from '../../core/modules/files.js';
import { authValidator } from './auth.js';
import fs from 'fs';
import sharp from 'sharp';

const maps = [{ name_map: '', matrix: [], safe_cords: [] }];

// maps.map((mapData) => {
//   if (mapData.name_map === '') return;
//   fs.writeFileSync(
//     `./src/cyberia/assets/tiles/${mapData.name_map}.metadata.json`,
//     JSON.stringify(mapData, null, 1),
//     'utf8'
//   );
// });

getAllFiles(`./src/cyberia/assets/tiles`).map((filePath) => {
  if (filePath.slice(-14) === '.metadata.json') maps.push(JSON.parse(fs.readFileSync(`./${filePath}`, 'utf8')));
});

const getMapGfxEngineData = (req, res) => {
  try {
    const map = maps.find((i) => i.name_map == req.params.mapId);
    if (map) {
      return res.status(200).json({
        status: 'success',
        data: map,
      });
    }
    return res.status(400).json({
      status: 'error',
      data: {
        message: renderLang({ en: 'Map not found', es: 'Map no encontrado' }, req),
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

const uploadMap = async (req, res) => {
  try {
    const { name_map } = req.body.mapData;

    if (maps.find((m) => m.name_map === name_map))
      return res.status(400).json({
        status: 'error',
        data: {
          message: `map with name <span style='color: yellow'>${name_map}</span> already exists`,
        },
      });

    fs.writeFileSync(
      `./src/cyberia/assets/tiles/${name_map}.json`,
      JSON.stringify(req.body.colorData.json, null, 1),
      'utf8'
    );
    fs.writeFileSync(`./src/cyberia/assets/tiles/${name_map}.svg`, req.body.colorData.svg, 'utf8');
    fs.writeFileSync(
      `./src/cyberia/assets/tiles/${name_map}.metadata.json`,
      JSON.stringify(req.body.mapData, null, 1),
      'utf8'
    );

    const svgToPng = await new Promise((resolve, reject) => {
      sharp(`./src/cyberia/assets/tiles/${name_map}.svg`)
        .png()
        .toFile(`./src/cyberia/assets/tiles/${name_map}.png`)
        .then((info) => resolve(info))
        .catch((err) => reject(err));
    });

    return res.status(200).json({
      status: 'success',
      data: {
        message: `map <span style='color: yellow'>${name_map}</span> uploaded successfully`,
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

const mapsApi = (app) => {
  app.get(process.env.API_BASE + '/maps/:mapId', authValidator, (req, res) => getMapGfxEngineData(req, res));
  app.post(process.env.API_BASE + '/maps/upload', authValidator, (req, res) => uploadMap(req, res));
};

export { maps, mapsApi };
