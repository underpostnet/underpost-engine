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
    bots: [{ sprite: 'kishins', attackValue: 20 }, { sprite: 'punk' }],
  },
  {
    map: 'todarp',
    maxBots: 2,
    bots: [
      { sprite: 'scp-2040', username: 'SCP-2040', maxLife: 200, life: 200, attackValue: 30, velFactor: 2 },
      { sprite: 'agent', username: 'Kinoshita', hostile: false, velFactor: 4 },
    ],
  },
];

export { mapBots };
