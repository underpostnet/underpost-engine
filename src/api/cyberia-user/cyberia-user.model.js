import { Schema, model } from 'mongoose';

// https://mongoosejs.com/docs/2.7.x/docs/schematypes.html

const CyberiaUserSchema = new Schema({
  x: { type: Number },
  y: { type: Number },
  dim: { type: Number },
  vel: { type: Number },
  maxLife: { type: Number },
  life: { type: Number },
  deadTime: { type: Number },
  coin: { type: Number },
  skill: {
    basic: { type: String },
    keys: {
      q: { type: String },
      w: { type: String },
      e: { type: String },
      r: { type: String },
    },
    tree: { type: [String], default: ['red-power'] },
  },
  components: {
    skin: {
      type: [
        {
          displayId: { type: String },
          current: { type: Boolean },
          enabled: { type: Boolean },
          position: { type: String },
          positions: { type: [{ positionId: { type: String }, frames: { type: Number } }] },
          assetFolder: { type: String },
        },
      ],
      default: [
        {
          displayId: 'anon',
          position: '08',
          positions: [
            { positionId: '02', frames: 1 },
            { positionId: '04', frames: 1 },
            { positionId: '06', frames: 1 },
            { positionId: '08', frames: 1 },
            { positionId: '12', frames: 2 },
            { positionId: '14', frames: 2 },
            { positionId: '16', frames: 2 },
            { positionId: '18', frames: 2 },
          ],
          enabled: true,
          current: true,
          assetFolder: 'skin',
        },
        {
          displayId: 'eiri',
          position: '08',
          positions: [
            { positionId: '02', frames: 1 },
            { positionId: '04', frames: 1 },
            { positionId: '06', frames: 1 },
            { positionId: '08', frames: 1 },
            { positionId: '12', frames: 2 },
            { positionId: '14', frames: 2 },
            { positionId: '16', frames: 2 },
            { positionId: '18', frames: 2 },
          ],
          enabled: false,
          assetFolder: 'skin',
        },
        {
          displayId: 'ghost',
          position: '08',
          positions: [
            { positionId: '02', frames: 8 },
            { positionId: '04', frames: 8 },
            { positionId: '06', frames: 8 },
            { positionId: '08', frames: 8 },
            { positionId: '12', frames: 8 },
            { positionId: '14', frames: 8 },
            { positionId: '16', frames: 8 },
            { positionId: '18', frames: 8 },
          ],
          enabled: false,
          assetFolder: 'skin',
        },
      ],
    },
    background: {
      type: [{ pixi: { tint: { type: String }, visible: { type: Boolean } }, enabled: { type: Boolean } }],
      default: [{ pixi: { tint: 'blue', visible: true }, enabled: false }],
    },
    lifeBar: { type: Object, default: {} },
    lifeIndicator: { type: Object, default: {} },
    coinIndicator: { type: Object, default: {} },
    username: { type: Object, default: {} },
  },
  model: {
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    world: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'CyberiaWorld',
      },
      face: { type: Number },
    },
  },
});

const CyberiaUserModel = model('CyberiaUser', CyberiaUserSchema);

export { CyberiaUserSchema, CyberiaUserModel };
