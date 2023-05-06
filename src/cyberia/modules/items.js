import dotenv from 'dotenv';
import { renderLang } from '../../core/modules/common.js';

dotenv.config();

const items = [
  {
    id: 'tim-knife',
    name: { es: 'Navaja de tim', en: 'Tim knife' },
    frames: 2,
    frameTimeInterval: 200,
    renderFactor: {
      x: 0.25,
      y: 0.35,
      width: 0.75,
      height: 0.75,
    },
    probabilityDrop: [1, 1],
    display: ['punk'],
    drop: [{ map: 'orange-over-purple', sprite: 'punk' }],
    categoryFactor: 1,
    stats: {
      maxLife: 10,
      attackValue: 2,
      velAttack: -10,
      passiveHealValue: 1,
      velPassiveHealValue: -20,
      velFactor: -0.1,
    },
  },
];

const getItem = (req, res) => {
  try {
    const item = items.find((i) => i.id == req.params.itemId);
    if (item) {
      const { id, name, stats } = item;
      return res.status(200).json({
        status: 'success',
        data: { id, name, stats },
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
  app.get(process.env.API_BASE + '/items/:itemId', (req, res) => getItem(req, res));
};

export { items, itemsApi };
