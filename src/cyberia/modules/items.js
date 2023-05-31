import dotenv from 'dotenv';
import { renderLang } from '../../core/modules/common.js';

dotenv.config();

const items = [
  {
    id: 'tim-knife',
    name: { es: 'Navaja de tim', en: 'Tim knife' },
    frames: 2,
    frameFormat: 'gif',
    frameTimeInterval: 200,
    renderFactor: {
      x: 0.25,
      y: 0.35,
      width: 0.75,
      height: 0.75,
    },
    probabilityDrop: [1, 1],
    display: [{ map: 'orange-over-purple', sprite: 'punk' }],
    drop: [{ map: 'orange-over-purple', sprite: 'punk' }],
    stats: {
      maxLife: 10,
      attackValue: 2,
      velAttack: -10,
      passiveHealValue: 1,
      velPassiveHealValue: -20,
      velFactor: -0.1,
    },
    itemType: 'equipment-weapon',
  },
  {
    id: 'ice-cream',
    name: { es: 'Helado de Vainilla', en: 'Vanilla ice cream' },
    frames: 3,
    frameFormat: 'gif',
    frameTimeInterval: 200,
    renderFactor: {
      x: 0.75,
      y: 0.4,
      width: 0.35,
      height: 0.35,
    },
    probabilityDrop: [1, 1],
    display: [{ map: 'zax-shop', sprite: 'ayleen' }],
    drop: [],
    stats: {
      maxLife: 50,
      attackValue: 5,
      velAttack: -5,
      passiveHealValue: 5,
      velPassiveHealValue: -5,
      velFactor: 0,
    },
    itemType: 'equipment-weapon',
  },
  {
    id: 'brown-wing',
    name: { es: 'Brown wings', en: 'Brown wings' },
    frames: 1,
    frameFormat: 'png',
    displayLogic: 'wings',
    frameTimeInterval: 200,
    renderFactor: {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    },
    probabilityDrop: [1, 1],
    display: [],
    drop: [],
    stats: {
      maxLife: 30,
      attackValue: 2,
      velAttack: -10,
      passiveHealValue: 2,
      velPassiveHealValue: -10,
      velFactor: -0.6,
    },
    itemType: 'equipment-breastplate',
  },
  {
    id: 'subkishin-piece',
    name: { es: 'Pieza de Subkishin', en: 'Subkishin Piece' },
    frames: 2,
    frameFormat: 'gif',
    frameTimeInterval: 200,
    renderFactor: {
      x: -0.3,
      y: -0.5,
      width: 1.25,
      height: 1.25,
    },
    probabilityDrop: [1, 1],
    display: [{ map: 'orange-over-purple', sprite: 'kishins' }],
    drop: [{ map: 'orange-over-purple', sprite: 'kishins' }],
    stats: {
      maxLife: 0,
      attackValue: 30,
      velAttack: -15,
      passiveHealValue: 0,
      velPassiveHealValue: 0,
      velFactor: -0.2,
    },
    itemType: 'equipment-talisman',
  },
];

const getDataRenderItem = (item) => {
  const { id, frames, frameTimeInterval, renderFactor, frameFormat, displayLogic } = item;
  return {
    id,
    frames,
    frameTimeInterval,
    renderFactor,
    frameFormat,
    displayLogic,
  };
};

const getDisplayBotData = (sprite, map) =>
  items.filter((i) => i.display.find((d) => d.map === map && d.sprite === sprite) !== undefined).map((i) => i.id);

const getItemService = (req, res) => {
  try {
    const item = items.find((i) => i.id == req.params.itemId);
    if (item) {
      const { id, name, stats, itemType } = item;
      return res.status(200).json({
        status: 'success',
        data: { id, name, stats, itemType },
      });
    }
    return res.status(400).json({
      status: 'error',
      data: {
        message: renderLang({ en: 'Item not found', es: 'Item no encontrado' }, req),
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

const getDataRenderItemService = (req, res) => {
  try {
    const item = items.find((i) => i.id == req.params.itemId);
    if (item) {
      return res.status(200).json({
        status: 'success',
        data: getDataRenderItem(item),
      });
    }
    return res.status(400).json({
      status: 'error',
      data: {
        message: renderLang({ en: 'Item not found', es: 'Item no encontrado' }, req),
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

const itemsApi = (app) => {
  app.get(process.env.API_BASE + '/items/:itemId', (req, res) => getItemService(req, res));
  app.get(process.env.API_BASE + '/items/render/:itemId', (req, res) => getDataRenderItemService(req, res));
};

export { items, itemsApi, getDisplayBotData, getDataRenderItem };
