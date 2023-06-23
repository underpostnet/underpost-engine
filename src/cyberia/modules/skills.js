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
      effectValue: 0,
      velEffect: 0,
      passiveHealValue: 0,
      velPassiveHealValue: 0,
      velFactor: 0,
    },
    itemType: 'skill_basic',
    description: {
      es: 'Inflige un daño equivalente a los puntos de efecto, con un tiempo de impacto de 50ms, hacia todos los personajes ubicados en el cuadrante adyacente en direccion actual del personaje.',
      en: "Inflicts damage equal to the effect points, with an impact time of 50ms, towards all characters located in the quadrant adjacent to the character's current direction.",
    },
    components: ['red-power'],
    impactTime: 50,
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
      effectValue: 0,
      velEffect: 0,
      passiveHealValue: 0,
      velPassiveHealValue: 0,
      velFactor: 0,
    },
    itemType: 'skill_basic',
    description: {
      es: 'Inflige un daño equivalente a 0.5% de los puntos de efecto, con un tiempo de impacto de 50ms, hacia todos los personajes ubicados en el cuadrante adyacente en direccion actual del personaje. Y restaura la vida del lanzador en un 0.25% de los puntos de efecto.',
      en: "Inflicts damage equal to 0.5% of effect points, with an impact time of 50ms, to all characters located in the quadrant adjacent to the character's current direction. And restores the caster's health by 0.25% of effect points.",
    },
    components: ['green-power'],
    impactTime: 50,
  },
];

export { skills };
