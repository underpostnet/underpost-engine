import dotenv from 'dotenv';
import { Server } from 'socket.io';
import pathfinding from 'pathfinding';
import {
  s4,
  range,
  random,
  getRandomPoint,
  getDistance,
  merge,
  ceil10,
  newInstance,
  getDirection,
  reOrderIntArray,
  JSONweb,
  JSONmatrix,
} from '../../core/modules/common.js';
import { maps } from './maps.js';
import { mapBots } from './bots.js';
import { quests } from './quests.js';
import { getDisplayBotData, items } from './items.js';
import { skills } from './skills.js';

dotenv.config();

const updateTimeInterval = 100;
const maxRangeMapParam = 16;
const elements = {};
const allowDiagonal = true;
const dontCrossCorners = true;
const minBotsMap = 3;

const directions = ['South East', 'East', 'North East', 'South', 'North', 'South West', 'West', 'North West'];
const spriteDirs = ['08', '06', '04', '02', '18', '16', '14', '12'];

const forceSaveAttrElement = {};

const changeMapsPoints = [];
const objectsMaps = [];
maps.map((dataMap) => {
  const objectsMap = {
    map: dataMap.name_map,
    objects: [],
  };
  const fromMap = dataMap.name_map;
  dataMap.matrix.map((rowFrom, y) =>
    rowFrom.map((cellFrom, x) => {
      if (typeof cellFrom === 'object' && cellFrom[0] === 'object') {
        objectsMap.objects.push({
          id: cellFrom[1],
          src: cellFrom[2],
          render: { dim: cellFrom[3], x, y },
          collision: cellFrom[4] !== undefined ? cellFrom[4] : undefined,
          frames: cellFrom[5] !== undefined ? cellFrom[5] : undefined,
          intervalFrames: cellFrom[6] !== undefined ? cellFrom[6] : undefined,
        });
      }

      if (typeof cellFrom === 'object' && cellFrom[0] === 'to-map') {
        let toMapData;

        maps.map((dataMap) => {
          const toMap = dataMap.name_map;
          if (toMap === cellFrom[1]) {
            dataMap.matrix.map((rowTo, y) => {
              rowTo.map((cellTo, x) => {
                if (typeof cellTo === 'object' && cellTo[0] === 'tmi' && cellTo[1] === cellFrom[3]) {
                  toMapData = { toMap, x, y };
                }
              });
            });
          }
        });
        const { toMap } = toMapData;

        changeMapsPoints.push({
          fromMap,
          toMap,
          fromX: x,
          fromY: y,
          toX: toMapData.x,
          toY: toMapData.y,
          arrow: cellFrom[2],
        });
      }
    })
  );

  objectsMaps.push(objectsMap);
});

const globalInstancesMapData = {
  cyberia: maps
    .filter((x) => x.position !== undefined && x.instance === 'cyberia')
    .map((mapData) => {
      return {
        name: mapData.name_map,
        position: mapData.position,
      };
    }),
};

const addNewUserItem = (clients, eventElement, item, element) => {
  const { type } = eventElement.element;
  const indexClientElement = elements[type].findIndex((e) => e.id === eventElement.element.id);
  const indexItemExist = elements[type][indexClientElement].items.findIndex((i) => i.id === item.id);
  if (indexItemExist > -1) {
    elements[type][indexClientElement].items[indexItemExist].count++;
  } else {
    elements[type][indexClientElement].items.push({ id: item.id, count: 1 });
  }

  const client = clients.find((c) => c.id === elements[type][indexClientElement].id);
  const emitDrop = {
    type: 'drop',
    item: {
      name: item.name,
      id: item.id,
      count: elements[type][indexClientElement].items[indexItemExist]
        ? elements[type][indexClientElement].items[indexItemExist].count
        : 0,
    },
    newItemsState: elements[type][indexClientElement].items,
    elementFromDrop: element,
  };

  // console.log('emitDrop', emitDrop);
  if (client) {
    client.emit('event', JSON.stringify(emitDrop));
    client.emit(
      'update',
      JSON.stringify({
        id: elements[type][indexClientElement].id,
        type: elements[type][indexClientElement].type,
        items: elements[type][indexClientElement].items,
      })
    );
  }
};

// console.log('changeMapsPoints', changeMapsPoints);

const typeModels = () => {
  return {
    floor: {
      color: () => 'green (html/css color)',
      components: () => ['tiles'],
      render: () => {
        return {
          dim: () => maxRangeMap(),
        };
      },
    },
    building: {
      color: () => 'black',
      components: () => [],
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
    bot: {
      color: () => 'yellow',
      components: () => ['sprites', 'bar-life', 'id', 'blood', 'life-indicator'],
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
    user: {
      color: () => 'cornell red',
      components: () => ['sprites', 'bar-life', 'id', 'blood', 'life-indicator', 'koyn-indicator'],
      render: () => {
        return {
          dim: () => 1,
        };
      },
      life: () => 100,
      maxLife: () => 100,
      attackValue: () => 20,
      passiveHealValue: () => 10,
      sprite: () => 'anon',
      koyn: () => 0,
      velFactor: () => 2,
      deadTime: () => 3,
      velAttack: () => 500,
      velPassiveHealValue: () => 1000,
      items: () => [
        { id: 'anon', count: 1, active: true },
        { id: 'purple', count: 1 },
        { id: 'basic-red', count: 1, active: true },
        { id: 'basic-green', count: 1 },
      ],
      displayItems: () => ['anon', 'basic-red'],
      successQuests: () => [],
    },
    bullet: {
      color: () => 'venetian red',
      components: () => [],
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
    'to-map': {
      color: () => 'peridot',
      components: () => ['arrow-map'],
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
    pointer: {
      color: () => 'lust',
      components: () => ['event-pointer-cross'],
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
    object: {
      color: () => 'old mauve',
      components: () => ['object'],
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
    'object-frames': {
      color: () => 'old mauve',
      components: () => ['object-frames'],
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
  };
};

const maxRangeMap = (arg) =>
  maxRangeMapParam - (arg !== undefined ? (typeof arg === 'string' ? typeModels()[arg].render().dim() : arg) : 0);

Object.keys(typeModels()).map((type) => {
  elements[type] = [];
});

const getParamsType = (type) => {
  return {
    color: typeModels()[type].color(),
    render: {
      dim: typeModels()[type].render().dim(),
    },
  };
};

const getAllElements = () => {
  let elementsReturn = [];
  Object.keys(typeModels()).map((type) => {
    elementsReturn = elementsReturn.concat(elements[type]);
  });
  return elementsReturn;
};

const id = () => {
  let _id;
  while (getAllElements().find((element) => element.id === _id) || !_id)
    _id = 'x' + (s4() + s4() + s4() + s4() + s4()).slice(1);
  return _id;
};

const matrixIterator = (fn, maxMapArg) =>
  range(0, maxRangeMap(maxMapArg)).map((y) => range(0, maxRangeMap(maxMapArg)).map((x) => fn(x, y)));

const validateCollision = (A, B) => {
  for (const yA of range(0, A.dim - 1)) {
    for (const xA of range(0, A.dim - 1)) {
      for (const yB of range(0, B.dim - 1)) {
        for (const xB of range(0, B.dim - 1)) {
          if (A.x + xA === B.x + xB && A.y + yA === B.y + yB) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const collision = (render, types, map) => {
  for (const type of types) {
    const element = elements[type].find((element) => element.map === map && validateCollision(element.render, render));
    if (element) {
      if (type === 'object' || type === 'object-frames') return element.collision;
      else return true;
    }
  }
  return false;
};

const getMatrixCollision = (type, types, map) =>
  range(0, maxRangeMap(type)).map((y) => {
    return range(0, maxRangeMap(type)).map((x) => {
      const dim = typeModels()[type].render().dim();
      if (collision({ x, y, dim }, types, map)) return 1;
      return 0;
    });
  });

const getAvailablePoints = (type, types, map) => {
  const availablePoints = [];
  const dim = typeModels()[type].render().dim();
  matrixIterator((x, y) => {
    if (!collision({ x, y, dim }, types, map)) availablePoints.push([x, y]);
  }, type);
  return availablePoints;
};

const getMissileDirection = (positionType, direction) => {
  switch (direction) {
    case 'South East':
      // ↘
      if (positionType === 'x') return 1;
      if (positionType === 'y') return 1;
      break;
    case 'East':
      // →
      if (positionType === 'x') return 1;
      if (positionType === 'y') return 0;
      break;
    case 'North East':
      // ↗
      if (positionType === 'x') return 1;
      if (positionType === 'y') return -1;
      break;
    case 'South':
      // ↓
      if (positionType === 'x') return 0;
      if (positionType === 'y') return 1;
      break;
    case 'North':
      // ↑
      if (positionType === 'x') return 0;
      if (positionType === 'y') return -1;
      break;
    case 'South West':
      // ↙
      if (positionType === 'x') return -1;
      if (positionType === 'y') return 1;
      break;
    case 'West':
      // ←
      if (positionType === 'x') return -1;
      if (positionType === 'y') return 0;
      break;
    case 'North West':
      // ↖
      if (positionType === 'x') return -1;
      if (positionType === 'y') return -1;
      break;
    default:
      if (positionType === 'x') return 0;
      if (positionType === 'y') return 0;
      break;
  }
};

const upGradeStatsElements = (clients, clientElementIndex, item, factor) => {
  const statsEmit = {};
  Object.keys(item.stats).map((skillKey) => {
    elements['user'][clientElementIndex][skillKey] =
      elements['user'][clientElementIndex][skillKey] + item.stats[skillKey] * factor;
    statsEmit[skillKey] = newInstance(elements['user'][clientElementIndex][skillKey]);
  });
  setIntervalPassiveHeal(clients, elements['user'][clientElementIndex]);
  return statsEmit;
};

(() => {
  const type = 'building';
  const { color, render } = getParamsType(type);
  const { dim } = render;
  maps.map((dataMap) => {
    const map = dataMap.name_map;
    (() => {
      const type = 'floor';
      const { color, render } = getParamsType(type);
      const { dim } = render;
      elements[type].push({
        id: id(),
        type,
        color,
        map,
        render: {
          x: 0,
          y: 0,
          dim,
        },
      });
    })();
    dataMap.matrix
      .map((row) => row.map((cell) => (cell === 1 ? 1 : 0)))
      .map((row, y) =>
        row.map((cell, x) => {
          if (cell === 1) {
            elements[type].push({
              id: id(),
              type,
              color,
              map,
              render: {
                x,
                y,
                dim,
              },
            });
          }
        })
      );
  });
})();

const validateSchemeElement = (element) => {
  const arrAttr = ['components', 'items', 'displayItems', 'successQuests'];
  // const forcesAttr = ['components', 'velFactor', 'velAttack', 'velPassiveHealValue'];
  const forcesAttr = ['components'];
  Object.keys(typeModels()[element.type]).map((key) => {
    if (element[key] === undefined || forcesAttr.includes(key)) element[key] = typeModels()[element.type][key]();
    if (arrAttr.includes(key)) element[key] = Object.values(element[key]);
  });
  return element;
};

const ssrWS = `
    const typeModels = ${typeModels};
    const maxRangeMapParam = ${maxRangeMapParam};
    const maxRangeMap = ${maxRangeMap};
    const getAllElements = ${getAllElements};
    const id = ${id};
    const matrixIterator = ${matrixIterator};
    const validateCollision = ${validateCollision};
    const collision = ${collision};
    const getMatrixCollision = ${getMatrixCollision};
    const getAvailablePoints = ${getAvailablePoints};
    const allowDiagonal = ${allowDiagonal};
    const dontCrossCorners = ${dontCrossCorners};
    const updateTimeInterval = ${updateTimeInterval};
    const spriteDirs = ${JSONweb(spriteDirs)};
    const directions = ${JSONweb(directions)};
    const getParamsType = ${getParamsType};
    const getMissileDirection = ${getMissileDirection};
    const globalInstancesMapData = ${JSONweb(globalInstancesMapData['cyberia'])}
    const validateSchemeElement = ${validateSchemeElement};
    const statsItems = ${JSONweb(Object.keys(items[0].stats))}
`;

const rebirdElement = (clients, element, internalApi) => {
  const deadTime = element.deadTime !== undefined ? element.deadTime : 3;
  const client = clients.find((x) => x.id === element.id);
  if (client)
    range(0, deadTime).map((at) => {
      setTimeout(() => {
        const emitEvent = JSON.stringify({
          type: 'dead-count',
          deadTime: deadTime - at,
        });
        if (client.emit) client.emit('event', emitEvent);
      }, at * 1000);
    });
  setTimeout(() => {
    if (!elements[element.type].find((_element) => _element.id === element.id)) return;
    element.life = newInstance(element.maxLife);
    clients.map((client) => {
      const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
      if (clientIndex > -1 && elements['user'][clientIndex].map === element.map)
        client.emit('update', JSON.stringify({ id: element.id, type: element.type, life: element.life }));
    });
  }, deadTime * 1000);
};

const attack = (clients, eventElement, map, targets, internalApi) => {
  (() => {
    let basicSkillData;

    for (const item of eventElement.element.items) {
      let fountItemSkill = false;
      for (const skill of skills) {
        if (skill.id === item.id && item.active === true && skill.itemType === 'skill_basic') {
          basicSkillData = newInstance(skill);
          fountItemSkill = true;
          break;
        }
      }
      if (fountItemSkill) break;
    }

    if (!basicSkillData) return;

    const { components, impactTime } = basicSkillData;

    const type = 'bullet';
    const { color, render } = getParamsType(type);
    const { dim } = render;
    const lifeTime = 500;
    const bullet = {
      id: id(),
      type,
      color,
      map,
      lifeTime,
      render: {
        dim,
        x: eventElement.element.render.x, //+ dim / 2,
        y: eventElement.element.render.y, //+ dim / 2,
      },
      components,
    };
    elements[type].push(bullet);
    clients.map((client) => {
      const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
      if (clientIndex > -1 && elements['user'][clientIndex].map === map) {
        client.emit('update', JSON.stringify(bullet));
        if (client.id !== eventElement.element.id)
          client.emit('update', JSON.stringify({ ...eventElement.element, direction: eventElement.direction }));
      }
    });
    setTimeout(() => {
      const missileY = getMissileDirection('x', eventElement.direction);
      const missileX = getMissileDirection('y', eventElement.direction);
      const render = {
        x: eventElement.element.render.x + missileY,
        y: eventElement.element.render.y + missileX,
      };
      clients.map((client) => {
        const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
        if (clientIndex > -1 && elements['user'][clientIndex].map === map)
          client.emit('update', JSON.stringify({ id: bullet.id, type: bullet.type, render }));
      });
      targets.map((type) =>
        elements[type].map((element) => {
          if (
            validateCollision(element.render, {
              dim: ceil10(bullet.render.dim),
              x: parseInt(render.x),
              y: parseInt(render.y),
            }) &&
            element.life > 0
          ) {
            element.life = element.life - eventElement.element.attackValue;
            if (element.life <= 0) {
              element.life = 0;
              if (element.dropKoyn !== undefined && eventElement.element.koyn !== undefined) {
                const elementFromIndex = elements[eventElement.element.type].findIndex(
                  (element) => eventElement.element.id === element.id
                );
                if (elementFromIndex > -1) {
                  elements[eventElement.element.type][elementFromIndex].koyn += element.dropKoyn;

                  const emitKoyn = {
                    id: eventElement.element.id,
                    type: eventElement.element.type,
                    koyn: elements[eventElement.element.type][elementFromIndex].koyn,
                  };

                  clients.map((client) => {
                    const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
                    if (clientIndex > -1 && elements['user'][clientIndex].map === map) {
                      client.emit('update', JSON.stringify(emitKoyn));
                    }
                  });
                }
              }
              const drops = items.filter((i) =>
                i.drop.find((d) => d.map === element.map && d.sprite === element.sprite)
              );
              drops.map((item) => {
                if (random(1, item.probabilityDrop[1]) <= item.probabilityDrop[0]) {
                  addNewUserItem(clients, eventElement, item, element);
                }
              });
              rebirdElement(clients, element, internalApi);

              clients.map((client) => {
                const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
                if (clientIndex > -1) {
                  client.emit(
                    'event',
                    JSON.stringify({
                      type: 'kill-element',
                      fromElmement: {
                        id: eventElement.element.id,
                        sprite: eventElement.element.sprite,
                        username: eventElement.element.username,
                        map: eventElement.element.map,
                      },
                      toElement: {
                        id: element.id,
                        sprite: element.sprite,
                        username: element.username,
                        map: element.map,
                      },
                    })
                  );
                }
              });
            }
            clients.map((client) => {
              const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
              if (clientIndex > -1 && elements['user'][clientIndex].map === map)
                client.emit('update', JSON.stringify({ id: element.id, type: element.type, life: element.life }));
            });
          }
        })
      );
      if (missileX === 0 && missileY === 0 && eventElement.matrixCollision) {
        const cordDistances = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [-1, -1],
        ];
        const newRender = {};
        const onDistance = (() => {
          for (const arrTestDistance of reOrderIntArray(range(0, cordDistances.length - 1))) {
            if (
              eventElement.matrixCollision[render.y + cordDistances[arrTestDistance][1]] &&
              eventElement.matrixCollision[render.y + cordDistances[arrTestDistance][1]][
                render.x + cordDistances[arrTestDistance][0]
              ] === 0
            ) {
              newRender.x = render.x + cordDistances[arrTestDistance][0];
              newRender.y = render.y + cordDistances[arrTestDistance][1];
              return true;
            }
          }
          return false;
        })();

        if (onDistance === true) {
          const elementFromIndex = elements[eventElement.element.type].findIndex(
            (element) => eventElement.element.id === element.id
          );
          if (elementFromIndex > -1) {
            elements[eventElement.element.type][elementFromIndex].render = merge(
              elements[eventElement.element.type][elementFromIndex].render,
              newRender
            );
            clients.map((client) => {
              const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
              if (clientIndex > -1 && elements['user'][clientIndex].map === map)
                client.emit(
                  'update',
                  JSON.stringify({
                    direction: getDirection(newRender.x, newRender.y, render.x, render.y).direction,
                    id: eventElement.element.id,
                    type: eventElement.element.type,
                    render: newRender,
                  })
                );
            });
          }
        }
      }
      setTimeout(() => {
        elements[type] = elements[type].filter((element) => element.id !== bullet.id);
      }, lifeTime);
    }, impactTime);
  })();
};

const params = { bot: [], user: [] };

const setIntervalPassiveHeal = (clients, element) => {
  if (!params[element.type][element.id]) return;
  if (params[element.type][element.id]['heal-passive-interval'])
    clearInterval(params[element.type][element.id]['heal-passive-interval']);
  params[element.type][element.id]['heal-passive-interval'] = setInterval(
    () => {
      if (element.life > 0 && element.life < element.maxLife) {
        element.life = element.life + element.passiveHealValue;
        if (element.life > element.maxLife) element.life = newInstance(element.maxLife);
        clients.map((client) => {
          client.emit('update', JSON.stringify({ id: element.id, type: element.type, life: element.life }));
        });
      }
    },
    element.velPassiveHealValue !== undefined ? element.velPassiveHealValue : 1000
  );
};

const findUserElementById = (req, res) => {
  try {
    const element = elements['user'].find((element) => element.id === req.body.id);
    if (element)
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'ok',
          element,
        },
      });
    return res.status(400).json({
      status: 'error',
      data: {
        message: 'user element not found',
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

objectsMaps.map((objectMap) => {
  objectMap.objects.map((objectData) => {
    (() => {
      const type = objectData.frames !== undefined ? 'object-frames' : 'object';
      const { id, src, collision, frames, intervalFrames } = objectData;
      const { color } = getParamsType(type);
      const objectElement = {
        id,
        type,
        color,
        map: objectMap.map,
        render: objectData.render,
        collision,
        frames,
        intervalFrames,
        src,
      };
      // console.log('map object push', objectElement);
      elements[type].push(objectElement);
    })();
  });
});

const unEquipItem = (clients, clientElement, clientElementIndex, eventElement) => {
  const { type } = clientElement;
  const item = items.find((i) => i.id === eventElement.item.id);
  if (item && elements['user'][clientElementIndex].items.find((i) => i.id === item.id)) {
    const indexItem = elements['user'][clientElementIndex].items.findIndex((i) => i.id === item.id);
    if (indexItem > -1) elements['user'][clientElementIndex].items[indexItem].active = false;

    const indexDisplayItem = elements['user'][clientElementIndex].displayItems.findIndex((i) => i === item.id);
    if (indexDisplayItem > -1) elements['user'][clientElementIndex].displayItems.splice(indexDisplayItem, 1);

    forceSaveAttrElement[clientElement.id].displayItems = newInstance(
      elements['user'][clientElementIndex].displayItems
    );

    const statsEmit = upGradeStatsElements(clients, clientElementIndex, item, -1);

    if (statsEmit.maxLife !== undefined && statsEmit.maxLife < elements['user'][clientElementIndex].life) {
      elements['user'][clientElementIndex].life = newInstance(statsEmit.maxLife);
      statsEmit.life = newInstance(statsEmit.maxLife);
    }

    const updateEmit = JSON.stringify({
      id: elements['user'][clientElementIndex].id,
      type,
      // no sirve eliminar desde cliente
      // displayItems: elements['user'][clientElementIndex].displayItems,
      items: elements['user'][clientElementIndex].items,
      ...statsEmit,
    });
    const eventEmit = JSON.stringify({
      id: elements['user'][clientElementIndex].id,
      type: 'unequip-item',
      item: {
        id: item.id,
        itemType: item.itemType,
      },
    });

    clients.map((client) => {
      const clientIndex = elements[type].findIndex((element) => element.id === client.id);
      if (elements[type][clientIndex].map === elements['user'][clientElementIndex].map) {
        client.emit('update', updateEmit);
        client.emit('event', eventEmit);
      }
    });
  }
};

const wsApi = (app, internalApi) => {
  app.post(process.env.API_BASE + '/ws/element/user', findUserElementById);
  internalApi.findUserElementById = findUserElementById;
};

const wsServer = (httpServer, app, internalApi) => {
  const origins = [internalApi.getHost('/')];
  console.log('host', internalApi.getHost());
  console.log('ws origins', origins);

  wsApi(app, internalApi);

  /**/
  const io = new Server(httpServer, {
    cors: {
      // origin: `http://localhost:${process.env.PORT}`,
      origins,
      methods: ['GET', 'POST', 'DELETE', 'PUT'],
      allowedHeaders: [
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'X-Requested-With',
        'X-Access-Token',
        'Content-Type',
        'Host',
        'Accept',
        'Connection',
        'Cache-Control',
      ],
      credentials: true,
    },
  });

  const clients = [];
  io.on('connection', (socket) => {
    console.log(`socket.io | user connect ${socket.id}`);
    const type = 'user';

    socket.on('init', async (args) => {
      console.log(`socket.io | init ${socket.id} due to data: ${args}`);
      clients.push(socket);
      console.log(`socket.io | currents clients: ${clients.length}`);
      let eventObj = {};
      try {
        eventObj = JSON.parse(args);
      } catch (error) {
        console.error(error);
      }
      let element = undefined;
      if (eventObj.element) {
        element = validateSchemeElement(eventObj.element);
      } else if (eventObj.token) {
        const user = await internalApi.getUserByToken(eventObj.token);
        // console.log('set user token', user);
        if (user) element = validateSchemeElement(internalApi.instanceInitElementByUser(user));
      }

      if (element) {
        forceSaveAttrElement[element.id] = {};
        element.id = socket.id;
        if (element.life === 0) rebirdElement(clients, element, internalApi);
        delete eventObj.path;
        const duplicateUser = elements['user'].find(
          (_element) => _element._id === element._id && _element._id !== undefined
        );
        if (duplicateUser) {
          const duplicateUserClient = clients.find((client) => client.id === duplicateUser.id);
          if (duplicateUserClient) {
            const emitEvent = JSON.stringify({
              type: 'duplicate-user-delete',
            });
            duplicateUserClient.emit('event', emitEvent);
          }
        }
      } else if (!eventObj.path) eventObj.path = '';

      if (eventObj.path || eventObj.path === '') {
        let map;
        map = eventObj.path.replaceAll('/', '');
        if (map === '') map = maps[random(0, maps.length - 1)].name_map;
        const { x, y } = getRandomPoint('', getAvailablePoints(type, ['building', 'object', 'object-frames'], map));
        const { color, render } = getParamsType(type);
        const { dim } = render;
        element = validateSchemeElement({
          id: socket.id,
          type,
          color,
          map,
          render: {
            x,
            y,
            dim,
          },
        });
      }
      const map = element.map;
      getAllElements().map((element) => {
        if (element.map === map) socket.emit('update', JSON.stringify(element));
      });
      elements[type].push(element);
      if (!params[type][element.id]) params[type][element.id] = {};
      setIntervalPassiveHeal(
        clients,
        elements[type].find((e) => e.id === element.id)
      );
      clients.map((client) => {
        const clientIndex = elements[type].findIndex((element) => element.id === client.id);
        if (clientIndex > -1 && elements[type][clientIndex].map === map) client.emit('update', JSON.stringify(element));
      });
      socket.emit(
        'init-data',
        JSON.stringify({
          changeMapsPoints: changeMapsPoints.filter((mapData) => mapData.fromMap === map),
          mapMetaData: {
            quests: quests
              .filter((q) => q.maps === 'all' || q.maps.includes(map))
              .map((q) => {
                if (!q.logic) {
                  q.eval = `
                  questRenderCard = () => '';
                  `;
                } else {
                  q.eval = `
              questRenderCard = ${q.logic};
              `;
                }
                if (q.setSuccessQuest) {
                  q.eval += `
                  setSuccessQuest = ${q.setSuccessQuest};
                  `;
                } else {
                  q.eval += `
                  setSuccessQuest = () => '';
                  `;
                }
                return q;
              }),
            types: maps.find((m) => m.name_map === map).type,
            map,
          },
        })
      );
    });

    socket.on('update', (args) => {
      // console.log(`socket.io | update ${socket.id} due to data: ${args}`);
      const elementEvent = JSON.parse(args);
      const time = new Date();
      elementEvent.updateTimestamp = time.getTime();
      elementEvent.updateAt = time.toISOString();
      let elementIndex = elements[type].findIndex((element) => element.id === socket.id);
      if (elementIndex === -1) {
        elementIndex = elements[type].length;
        elements[type].push(elementEvent);
      } else {
        elements[type][elementIndex] = merge(elements[type][elementIndex], elementEvent);
      }
      clients.map((client) => {
        const clientIndex = elements[type].findIndex((element) => element.id === client.id);
        if (
          clientIndex > -1 &&
          elements[type][clientIndex].map === elements[type][elementIndex].map &&
          socket.id !== client.id
        )
          client.emit('update', JSON.stringify({ id: socket.id, type, ...elementEvent }));
      });
    });

    socket.on('event', (args) => {
      console.log(`socket.io | event ${socket.id} due to data: ${args}`);
      const eventElement = JSON.parse(args);
      const clientElement = elements[type].find((element) => element.id === socket.id);
      const clientElementIndex = elements[type].findIndex((element) => element.id === socket.id);
      if (clientElement) {
        const { map } = clientElement;
        if (eventElement.element) eventElement.element = merge(clientElement, eventElement.element);
        switch (eventElement.event) {
          case 'attack':
            attack(clients, eventElement, map, ['bot', 'user'], internalApi);
            break;
          case 'chat':
            clients.map((client) => {
              const clientIndex = elements[type].findIndex((element) => element.id === client.id);
              if (clientIndex > -1 && socket.id !== client.id) {
                const chatEmit = JSON.stringify({
                  type: 'chat',
                  msg: eventElement.msg,
                  element: {
                    id: socket.id,
                    type,
                    username: clientElement.username,
                    sprite: clientElement.sprite,
                  },
                });
                // console.log('send chat msg', chatEmit);
                client.emit('event', chatEmit);
              }
            });
            break;
          case 'item-equip':
            (() => {
              const item = items.find((i) => i.id === eventElement.item.id);

              const preTypeItemExist = elements['user'][clientElementIndex].items.filter(
                (i) => items.find((ii) => ii.id === i.id).itemType === item.itemType && i.active === true
              );
              if (preTypeItemExist[0])
                unEquipItem(clients, clientElement, clientElementIndex, { item: preTypeItemExist[0] });

              if (
                item &&
                elements['user'][clientElementIndex].items.find((i) => i.id === item.id) &&
                !elements['user'][clientElementIndex].items.find((i) => i.id === item.id).active &&
                !elements['user'][clientElementIndex].displayItems.find((i) => i === eventElement.item.id)
              ) {
                const indexItem = elements['user'][clientElementIndex].items.findIndex((i) => i.id === item.id);
                elements['user'][clientElementIndex].items[indexItem].active = true;
                elements['user'][clientElementIndex].displayItems.push(item.id);

                const statsEmit = upGradeStatsElements(clients, clientElementIndex, item, 1);

                let sprite = undefined;
                if (item.displayLogic === 'skins') {
                  elements['user'][clientElementIndex].sprite = `${item.id}`;
                  sprite = `${item.id}`;
                }

                const updateEmit = JSON.stringify({
                  id: elements['user'][clientElementIndex].id,
                  type,
                  displayItems: elements['user'][clientElementIndex].displayItems,
                  items: elements['user'][clientElementIndex].items,
                  sprite,
                  ...statsEmit,
                });
                const eventEmit = JSON.stringify({
                  id: elements['user'][clientElementIndex].id,
                  type: 'equip-item',
                  displayItems: elements['user'][clientElementIndex].displayItems,
                  item,
                });

                clients.map((client) => {
                  const clientIndex = elements[type].findIndex((element) => element.id === client.id);
                  if (elements[type][clientIndex].map === elements['user'][clientElementIndex].map) {
                    client.emit('update', updateEmit);
                    client.emit('event', eventEmit);
                  }
                });
              }
            })();
            break;
          case 'item-unequip':
            unEquipItem(clients, clientElement, clientElementIndex, eventElement);
            break;
          case 'success-quest':
            const dataQuest = quests.find((q) => q.id === eventElement.id);
            if (dataQuest && !elements['user'][clientElementIndex].successQuests.includes(eventElement.id)) {
              elements['user'][clientElementIndex].successQuests.push(eventElement.id);
              if (dataQuest.reward && dataQuest.reward.stats) {
                const stats = {};

                const koynData = dataQuest.reward.items.find((i) => i.id === 'koyn');
                const cryptoKoynData = dataQuest.reward.items.find((i) => i.id === 'cryptokoyn');
                if (koynData) dataQuest.reward.stats.koyn = koynData.count;
                if (cryptoKoynData) dataQuest.reward.stats.cryptokoyn = cryptoKoynData.count;

                dataQuest.reward.items.map((item) => {
                  if (item.id !== 'koyn' && item.id !== 'cryptokoyn') {
                    addNewUserItem(
                      clients,
                      { element: elements['user'][clientElementIndex] },
                      items.find((i) => i.id === item.id),
                      eventElement.elementFromQuest
                    );
                  }
                });

                Object.keys(dataQuest.reward.stats).map((keyStat) => {
                  elements['user'][clientElementIndex][keyStat] =
                    elements['user'][clientElementIndex][keyStat] + dataQuest.reward.stats[keyStat];
                  stats[keyStat] = elements['user'][clientElementIndex][keyStat];
                });

                const emitData = {
                  id: socket.id,
                  type: 'user',
                  successQuests: elements['user'][clientElementIndex].successQuests,
                  ...stats,
                };

                clients.map((client) => {
                  const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
                  if (
                    clientIndex > -1 &&
                    elements['user'][clientIndex].map === elements['user'][clientElementIndex].map
                  ) {
                    client.emit('update', JSON.stringify(emitData));
                  }
                });
              }
            }
            break;
          default:
            break;
        }
      }
    });

    const removeEvent = () => {
      clients.splice(clients.indexOf(socket), 1);
      const elementIndex = elements[type].findIndex((element) => element.id === socket.id);
      if (params[type][socket.id]) {
        if (params[type][socket.id][`heal-passive-interval`])
          clearInterval(params[type][socket.id][`heal-passive-interval`]);

        delete params[type][socket.id];
      }
      clients.map((client) => {
        const clientIndex = elements[type].findIndex((element) => element.id === client.id);
        if (elements[type][clientIndex].map === elements[type][elementIndex].map)
          client.emit('close', JSON.stringify({ id: socket.id, type }));
      });
      elements[type].splice(
        elements[type].findIndex((element) => element.id === socket.id),
        1
      );
      console.log(`socket.io | currents clients: ${clients.length}`);
    };

    socket.on('disconnect', (reason) => {
      console.log(`socket.io | disconnect ${socket.id} due to reason: ${reason}`);
      removeEvent();
    });

    socket.on('close', () => {
      console.log(`socket.io | close ${socket.id}`);
      removeEvent();
    });
  });

  const finder = new pathfinding.AStarFinder({
    allowDiagonal, // enable diagonal
    dontCrossCorners, // corner of a solid
    heuristic: pathfinding.Heuristic.chebyshev,
  });

  // bots controller

  maps.map((dataMap) => {
    const map = dataMap.name_map;
    const type = 'bot';
    const botMatrixCollision = getMatrixCollision(type, ['building', 'object', 'object-frames'], map);
    const botPositionAvailablePoints = getAvailablePoints(type, ['building', 'object', 'object-frames'], map);
    // if (map === 'zax-shop') console.log('botMatrixCollision', JSONmatrix(botMatrixCollision));
    const configBot = mapBots.find((x) => x.map === map);
    (() => {
      const maxBots = configBot && configBot.maxBots !== undefined ? configBot.maxBots : minBotsMap;
      const { color, render } = getParamsType(type);
      const { dim } = render;
      while (
        botPositionAvailablePoints.length > 0 &&
        elements[type].filter((element) => element.map === map).length < maxBots
      ) {
        let customBot = {};
        if (configBot) customBot = configBot.bots[elements[type].filter((element) => element.map === map).length];

        const point = botPositionAvailablePoints[random(0, botPositionAvailablePoints.length - 1)];
        const bot = {
          id: id(),
          type,
          color,
          map,
          sprite: 'purple',
          life: 100,
          maxLife: 100,
          attackValue: 5,
          velAttack: 500,
          passiveHealValue: 10,
          dropKoyn: random(1, 10),
          render: {
            x: point[0],
            y: point[1],
            dim,
          },
          hostile: true,
          velPassiveHealValue: 1000,
          velFactor: 3,
          items: [{ id: 'basic-red', count: 1, active: true }],
          ...customBot,
        };
        bot.displayItems = getDisplayBotData(bot.sprite, map);
        elements[type].push(bot);
        params[type][bot.id] = {};
        setIntervalPassiveHeal(
          clients,
          elements[type].find((e) => e.id === bot.id)
        );
      }
    })();

    elements[type]
      .filter((element) => element.map === map)
      .map((element) => {
        let usersTarget;
        setInterval(() => {
          usersTarget = element.hostile
            ? elements['user'].filter((userElement) => {
                if (userElement.map !== map || userElement.life === 0 || element.life === 0) return false;
                const userDistance = getDistance(
                  element.render.x + parseInt(element.render.dim / 2),
                  element.render.y + parseInt(element.render.dim / 2),
                  userElement.render.x + parseInt(userElement.render.dim / 2),
                  userElement.render.y + parseInt(userElement.render.dim / 2)
                );
                return userDistance < maxRangeMap() * 0.3;
              })
            : [];
        }, 50);

        setInterval(() => {
          if (!element.path) element.path = [];
          element.path.shift();
          let targetUser, x2, y2, point, idTarget;
          while (element.path.length === 0 && !targetUser) {
            // element.path = range(0, maxRangeMap).map(i => [i, i]);
            if (usersTarget.length > 0) {
              const targetElement = usersTarget[random(0, usersTarget.length - 1)];
              point = targetElement.render;
              x2 = point.x;
              y2 = point.y;
              idTarget = targetElement.id;
            } else {
              point = getRandomPoint('', botPositionAvailablePoints);
              x2 = point.x;
              y2 = point.y;
            }

            element.path = finder.findPath(
              element.render.x,
              element.render.y,
              x2,
              y2,
              new pathfinding.Grid(botMatrixCollision)
            );
            if (usersTarget.length > 0) {
              range(0, 0).map(() => element.path.pop());
              targetUser = true;
            }
          }
          const newPosValidator =
            element.path[0] && (element.render.x !== element.path[0][0] || element.render.y !== element.path[0][1]);
          if (newPosValidator) {
            element.render.x = element.path[0][0];
            element.render.y = element.path[0][1];
          }
          if (targetUser) {
            if (!params[type][element.id].intervalAttack) {
              const instanceAttack = () => {
                const elementInstance = elements[type].find((e) => e.id === element.id);
                const targetInstance = elements['user'].find((e) => e.id === idTarget);
                if (elementInstance && targetInstance) {
                  const direction = getDirection(
                    elementInstance.render.x,
                    elementInstance.render.y,
                    targetInstance.render.x,
                    targetInstance.render.y
                  ).direction;
                  attack(
                    clients,
                    {
                      element: elementInstance,
                      direction,
                      matrixCollision: botMatrixCollision,
                    },
                    map,
                    ['user'],
                    internalApi
                  );
                }
              };
              instanceAttack();
              params[type][element.id].intervalAttack = setInterval(() => instanceAttack(), element.velAttack);
            }
          } else {
            if (params[type][element.id].intervalAttack) clearInterval(params[type][element.id].intervalAttack);
            params[type][element.id].intervalAttack = undefined;
          }
          clients.map((client) => {
            const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
            if (elements['user'][clientIndex].map !== map) return;
            if (newPosValidator)
              client.emit(
                'update',
                JSON.stringify({
                  id: element.id,
                  type: element.type,
                  render: {
                    x: element.render.x,
                    y: element.render.y,
                  },
                })
              );
          });
        }, updateTimeInterval * (element.velFactor ? element.velFactor : 1));
      });
  });

  setInterval(() => {
    ['user'].map((type) => {
      elements[type].map((element) => {
        const forceAttr = forceSaveAttrElement[element.id] ? newInstance(forceSaveAttrElement[element.id]) : {};
        if (element._id) internalApi.updateElementUser(element, forceAttr);
        forceSaveAttrElement[element.id] = {};
      });
    });
  }, 500);
};

export { wsServer, ssrWS };
