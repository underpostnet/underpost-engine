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

export { items };
