const skins = [
  {
    id: 'anon',
    name: { es: 'Anon', en: 'Anon' },
    displayLogic: 'skins',
    probabilityDrop: [1, 1],
    display: [],
    drop: [],
    stats: {
      maxLife: 0,
      attackValue: 0,
      velAttack: 0,
      passiveHealValue: 0,
      velPassiveHealValue: 0,
      velFactor: 0,
    },
    itemType: 'equipment-skin',
  },
  {
    id: 'purple',
    name: { es: 'Purple', en: 'Purple' },
    displayLogic: 'skins',
    probabilityDrop: [1, 1],
    display: [],
    drop: [],
    stats: {
      maxLife: 20,
      attackValue: 10,
      velAttack: -30,
      passiveHealValue: 5,
      velPassiveHealValue: 0,
      velFactor: -0.01,
    },
    itemType: 'equipment-skin',
  },
];

export { skins };
