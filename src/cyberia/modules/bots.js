const mapBots = [
  {
    map: 'zax-shop',
    maxBots: 2,
    bots: [
      { sprite: 'ayleen', username: 'Ayleen', hostile: false, velFactor: 3 },
      { sprite: 'dog', username: 'Floki', hostile: false, velFactor: 3 },
    ],
  },
  {
    map: 'orange-over-purple',
    maxBots: 2,
    bots: [
      { sprite: 'kishins', username: 'Subkishins', attackValue: 20 },
      { sprite: 'punk', username: 'Tim', velFactor: 3 },
    ],
  },
  {
    map: 'todarp',
    maxBots: 2,
    bots: [
      { sprite: 'scp-2040', username: 'SCP-2040', maxLife: 200, life: 200, attackValue: 30, velFactor: 2 },
      {
        sprite: 'agent',
        username: 'Kinoshita',
        hostile: false,
        velFactor: 4,
        static: true,
        render: { x: 8, y: 9, dim: 1 },
      },
    ],
  },
];

export { mapBots };
