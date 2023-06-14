const skills = [
  {
    id: 'basic-red',
    name: { es: 'Red stone', en: 'Piedra Roja' },
    displayLogic: 'skills',
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
    itemType: 'skill_basic',
    description: {
      es: 'Inflige un daño equivalente a los puntos de ataque amplificado en un 0.01%, con un tiempo de impacto de 50ms, hacia todos los personajes ubicados en el cuadrante adyacente en direccion actual del personaje.',
      en: "Inflicts damage equal to the attack points amplified by 0.01%, with an impact time of 50ms, towards all characters located in the quadrant adjacent to the character's current direction.",
    },
  },
  {
    id: 'basic-green',
    name: { es: 'Green stone', en: 'Piedra Verde' },
    displayLogic: 'skills',
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
    itemType: 'skill_basic',
    description: {
      es: 'test',
      en: 'test',
    },
  },
];

export { skills };
