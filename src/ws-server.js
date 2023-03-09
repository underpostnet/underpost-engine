import dotenv from 'dotenv';
import { Server } from 'socket.io';
import fs from 'fs';
import pathfinding from 'pathfinding';
import {
  s4,
  range,
  random,
  JSONmatrix,
  getRandomPoint,
  getDistance,
  merge,
  ceil10,
  newInstance,
  getDirection,
} from './common.js';
import { maps } from './maps.js';
import { JSONweb } from './util.js';

dotenv.config();

const updateTimeInterval = 100;
const maxRangeMapParam = 16;
const elements = {};
const allowDiagonal = true;
const dontCrossCorners = true;

const directions = ['South East', 'East', 'North East', 'South', 'North', 'South West', 'West', 'North West'];
const spriteDirs = ['08', '06', '04', '02', '18', '16', '14', '12'];

const changeMapsPoints = [];
maps.map((dataMap) => {
  const fromMap = dataMap.name_map;
  dataMap.matrix.map((rowFrom, y) =>
    rowFrom.map((cellFrom, x) => {
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
});

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
      components: () => ['sprites', 'bar-life', 'id', 'blood'],
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
    user: {
      color: () => 'cornell red',
      components: () => ['sprites', 'bar-life', 'id', 'blood'],
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
    bullet: {
      color: () => 'venetian red',
      components: () => ['red-power'],
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
    if (elements[type].find((element) => element.map === map && validateCollision(element.render, render))) return true;
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
`;

const attack = (clients, eventElement, map, targets) => {
  (() => {
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
    };
    elements[type].push(bullet);
    clients.map((client) => {
      const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
      if (clientIndex > -1 && elements['user'][clientIndex].map === map) client.emit('update', JSON.stringify(bullet));
    });
    setTimeout(() => {
      const render = {
        x: eventElement.element.render.x + getMissileDirection('x', eventElement.direction),
        y: eventElement.element.render.y + getMissileDirection('y', eventElement.direction),
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
            })
          ) {
            element.life = element.life - 20;
            if (element.life <= 0) {
              element.life = 0;
              setTimeout(() => {
                element.life = newInstance(element.maxLife);
                clients.map((client) => {
                  const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
                  if (clientIndex > -1 && elements['user'][clientIndex].map === map)
                    client.emit('update', JSON.stringify({ id: element.id, type: element.type, life: element.life }));
                });
              }, 3000);
            }
            clients.map((client) => {
              const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
              if (clientIndex > -1 && elements['user'][clientIndex].map === map)
                client.emit('update', JSON.stringify({ id: element.id, type: element.type, life: element.life }));
            });
          }
        })
      );
      setTimeout(() => {
        elements[type] = elements[type].filter((element) => element.id !== bullet.id);
      }, lifeTime);
    }, botAttackInterval * 0.1);
  })();
};

const params = { bot: [] };
const botAttackInterval = 500;

const wsServer = () => {
  const io = new Server(process.env.IO_PORT, { cors: { origins: [`http://localhost:${process.env.CLIENT_PORT}`] } });
  const clients = [];
  io.on('connection', (socket) => {
    console.log(`socket.io | user connect ${socket.id}`);
    const type = 'user';

    socket.on('init', (args) => {
      console.log(`socket.io | init ${socket.id} due to data: ${args}`);
      clients.push(socket);
      console.log(`socket.io | currents clients: ${clients.length}`);
      let element;
      if (args[0] === '{' || args[0] === '[') {
        element = JSON.parse(args);
      } else {
        let map;
        map = args.replaceAll('/', '');
        if (map === '') map = maps[random(0, maps.length - 1)].name_map;
        const { x, y } = getRandomPoint('', getAvailablePoints(type, ['building'], map));
        const { color, render } = getParamsType(type);
        const { dim } = render;
        element = {
          id: socket.id,
          type,
          color,
          map,
          life: 300,
          maxLife: 300,
          sprite: 'anon',
          render: {
            x,
            y,
            dim,
          },
        };
      }
      const map = element.map;
      getAllElements().map((element) => {
        if (element.map === map) socket.emit('update', JSON.stringify(element));
      });
      elements[type].push(element);
      clients.map((client) => {
        const clientIndex = elements[type].findIndex((element) => element.id === client.id);
        if (clientIndex > -1 && elements[type][clientIndex].map === map) client.emit('update', JSON.stringify(element));
      });
      socket.emit(
        'init-data',
        JSON.stringify({
          changeMapsPoints: changeMapsPoints.filter((mapData) => mapData.fromMap === map),
        })
      );
    });

    socket.on('update', (args) => {
      // console.log(`socket.io | update ${socket.id} due to data: ${args}`);
      const elementEvent = JSON.parse(args);
      let elementIndex = elements[type].findIndex((element) => element.id === socket.id);
      if (elementIndex === -1) {
        elementIndex = elements[type].length;
        elements[type].push(elementEvent);
      } else elements[type][elementIndex] = merge(elements[type][elementIndex], elementEvent);
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
      if (clientElement) {
        const { map } = clientElement;
        switch (eventElement.event) {
          case 'attack':
            attack(clients, eventElement, map, ['bot', 'user']);
            break;

          default:
            break;
        }
      }
    });

    const removeEvent = () => {
      clients.splice(clients.indexOf(socket), 1);
      const elementIndex = elements[type].findIndex((element) => element.id === socket.id);
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

  console.log(`Io Server is running on port ${process.env.IO_PORT}`);

  const finder = new pathfinding.AStarFinder({
    allowDiagonal, // enable diagonal
    dontCrossCorners, // corner of a solid
    heuristic: pathfinding.Heuristic.chebyshev,
  });

  // bots controller
  maps.map((dataMap) => {
    const map = dataMap.name_map;
    const type = 'bot';
    const botMatrixCollision = getMatrixCollision(type, ['building'], map);
    const botPositionAvailablePoints = getAvailablePoints(type, ['building'], map);

    (() => {
      const maxBots = random(1, 3);
      const { color, render } = getParamsType(type);
      const { dim } = render;
      while (
        botPositionAvailablePoints.length > 0 &&
        elements[type].filter((element) => element.map === map).length < maxBots
      ) {
        const point = botPositionAvailablePoints[random(0, botPositionAvailablePoints.length - 1)];
        const bot = {
          id: id(),
          type,
          color,
          map,
          sprite: 'purple',
          life: 100,
          maxLife: 100,
          render: {
            x: point[0],
            y: point[1],
            dim,
          },
        };
        elements[type].push(bot);
        params[type][bot.id] = {
          activeAttack: true,
        };
      }
    })();

    setInterval(() => {
      elements[type]
        .filter((element) => element.map === map)
        .map((element) => {
          if (!element.path) element.path = [];
          element.path.shift();
          let targetUser, x2, y2, point;
          while (element.path.length === 0 && !targetUser) {
            // element.path = range(0, maxRangeMap).map(i => [i, i]);

            const usersTarget = elements['user'].filter((userElement) => {
              if (userElement.map !== map || userElement.life === 0 || element.life === 0) return false;
              const userDistance = getDistance(
                element.render.x + parseInt(element.render.dim / 2),
                element.render.y + parseInt(element.render.dim / 2),
                userElement.render.x + parseInt(userElement.render.dim / 2),
                userElement.render.y + parseInt(userElement.render.dim / 2)
              );
              return userDistance < maxRangeMap() * 0.3;
            });
            if (usersTarget.length > 0) {
              point = usersTarget[random(0, usersTarget.length - 1)].render;
              x2 = point.x;
              y2 = point.y;
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
          if (element.path[0]) {
            element.render.x = element.path[0][0];
            element.render.y = element.path[0][1];
          }
          if (targetUser && params[type][element.id].activeAttack === true) {
            params[type][element.id].activeAttack = false;
            const direction = getDirection(element.render.x, element.render.y, x2, y2).direction;
            attack(
              clients,
              {
                element: {
                  render: {
                    x: element.render.x,
                    y: element.render.y,
                  },
                },
                direction,
              },
              map,
              ['user']
            );

            setTimeout(() => {
              params[type][element.id].activeAttack = true;
            }, botAttackInterval);
          }
          clients.map((client) => {
            const clientIndex = elements['user'].findIndex((element) => element.id === client.id);
            if (elements['user'][clientIndex].map !== map) return;
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
        });
    }, updateTimeInterval);
  });
};

export { wsServer, ssrWS };
