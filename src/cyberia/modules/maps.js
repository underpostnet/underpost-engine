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

const getMapEngineData = (req, res) => {
  try {
    const mapData = maps.find((i) => i.name_map == req.params.mapId);
    if (mapData) {
      const { name_map } = mapData;
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'map load successfully',
          map: JSON.parse(fs.readFileSync(`./src/cyberia/assets/tiles/${name_map}.metadata.json`, 'utf8')),
          color: JSON.parse(fs.readFileSync(`./src/cyberia/assets/tiles/${name_map}.json`, 'utf8')),
        },
      });
    }
    return res.status(400).json({
      status: 'error',
      data: {
        message: renderLang({ en: 'Map not found', es: 'Mapa no encontrado' }, req),
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

    // if (maps.find((m) => m.name_map === name_map))
    //   return res.status(400).json({
    //     status: 'error',
    //     data: {
    //       message: `map with name <span style='color: yellow'>${name_map}</span> already exists`,
    //     },
    //   });

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

const getAdjMaps = (req, res) => {
  try {
    const mapData = maps.find((i) => i.name_map == req.params.mapId);
    if (mapData) {
      const { name_map } = mapData;
      const dataMapConcat = [];

      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ].map((dataCord) => {
        const adjMapData = maps.find(
          (i) =>
            i.position != undefined &&
            !isNaN(i.position[0]) &&
            !isNaN(i.position[1]) &&
            i.position[0] === mapData.position[0] + dataCord[0] &&
            i.position[1] === mapData.position[1] + dataCord[1]
        );
        if (adjMapData)
          dataMapConcat.push(
            JSON.parse(fs.readFileSync(`./src/cyberia/assets/tiles/${adjMapData.name_map}.metadata.json`, 'utf8'))
          );
      });

      return res.status(200).json({
        status: 'success',
        data: {
          message: 'map load successfully',
          maps: [JSON.parse(fs.readFileSync(`./src/cyberia/assets/tiles/${name_map}.metadata.json`, 'utf8'))].concat(
            dataMapConcat
          ),
        },
      });
    }
    return res.status(400).json({
      status: 'error',
      data: {
        message: renderLang({ en: 'Map not found', es: 'Mapa no encontrado' }, req),
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
const setOriginGate = (req, res) => {
  try {
    const fromGateMapData = maps.find((m) => m.name_map === req.body.gate.from.name_map);
    const fromTerminalMapData = maps.find((m) => m.name_map === req.body.terminal.from.name_map);
    if (!fromGateMapData || !fromTerminalMapData)
      return res.status(400).json({
        status: 'error',
        data: {
          message: renderLang({ en: 'Map not found', es: 'Mapa no encontrado' }, req),
        },
      });

    // console.log('fromGateMapData', fromGateMapData);
    // console.log('fromTerminalMapData', fromTerminalMapData);

    fromGateMapData.matrix[req.body.gate.from.y][req.body.gate.from.x] = req.body.gate.to;
    fromTerminalMapData.matrix[req.body.terminal.from.y][req.body.terminal.from.x] = req.body.terminal.to;

    fs.writeFileSync(
      `./src/cyberia/assets/tiles/${fromGateMapData.name_map}.metadata.json`,
      JSON.stringify(fromGateMapData, null, 1),
      'utf8'
    );

    fs.writeFileSync(
      `./src/cyberia/assets/tiles/${fromTerminalMapData.name_map}.metadata.json`,
      JSON.stringify(fromTerminalMapData, null, 1),
      'utf8'
    );

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

const mapsApi = (app) => {
  app.get(process.env.API_BASE + '/maps/:mapId', authValidator, (req, res) => getMapGfxEngineData(req, res));
  app.post(process.env.API_BASE + '/maps/upload', authValidator, (req, res) => uploadMap(req, res));
  app.get(process.env.API_BASE + '/maps/engine/:mapId', authValidator, (req, res) => getMapEngineData(req, res));
  app.get(process.env.API_BASE + '/maps/adjacents/:mapId', authValidator, (req, res) => getAdjMaps(req, res));
  app.put(process.env.API_BASE + '/maps/origin-gate', authValidator, (req, res) => setOriginGate(req, res));
};

export { maps, mapsApi };
