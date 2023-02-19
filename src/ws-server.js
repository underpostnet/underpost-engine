import dotenv from 'dotenv';
import { Server } from 'socket.io';
import fs from 'fs';
import pathfinding from 'pathfinding';
import { s4, range, random, JSONmatrix, getRandomPoint, getDistance, merge } from './common.js';

dotenv.config();

const nameFolderData = 'cyberia';
const maxRangeMapParam = 31;
const elements = {};
const allowDiagonal = true;
const dontCrossCorners = true;

const typeModels = () => {
  return {
    floor: {
      color: () => 'green (html/css color)',
      components: () => [],
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
          dim: () => 3,
        };
      },
    },
    bot: {
      color: () => 'yellow',
      components: () => [],
      render: () => {
        return {
          dim: () => 3,
        };
      },
    },
    user: {
      color: () => 'cornell red',
      components: () => ['head'],
      render: () => {
        return {
          dim: () => 3,
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

// common

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

const collision = (render, types) => {
  for (const type of types) {
    if (elements[type].find((element) => validateCollision(element.render, render))) return true;
  }
  return false;
};

const getMatrixCollision = (type, types) =>
  range(0, maxRangeMap(type)).map((y) => {
    return range(0, maxRangeMap(type)).map((x) => {
      const dim = typeModels()[type].render().dim();
      if (collision({ x, y, dim }, types)) return 1;
      return 0;
    });
  });

const getAvailablePoints = (type, types) => {
  const availablePoints = [];
  const dim = typeModels()[type].render().dim();
  matrixIterator((x, y) => {
    if (!collision({ x, y, dim }, types)) availablePoints.push([x, y]);
  }, type);
  return availablePoints;
};

// statics init elements

(() => {
  const type = 'floor';
  const { color, render } = getParamsType(type);
  const { dim } = render;
  elements[type].push({
    id: id(),
    type,
    color,
    render: {
      x: 0,
      y: 0,
      dim,
    },
  });
})();

(() => {
  const type = 'building';
  const { color, render } = getParamsType(type);
  const { dim } = render;
  matrixIterator((x, y) => {
    if (random(1, 100) <= 1) {
      elements[type].push({
        id: id(),
        type,
        color,
        render: {
          x,
          y,
          dim,
        },
      });
    }
  }, type);
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
`;

const wsServer = () => {
  (() => {
    const type = 'bot';
    const { color, render } = getParamsType(type);
    const { dim } = render;
    matrixIterator((x, y) => {
      if (random(1, 100) <= 1) {
        if (!collision({ dim, x, y }, ['building', 'bot'])) {
          elements[type].push({
            id: id(),
            type,
            color,
            render: {
              x,
              y,
              dim,
            },
          });
        }
      }
    }, type);
  })();

  if (!fs.existsSync('./data/cyberia')) fs.mkdirSync('./data/cyberia', { recursive: true });

  // view test matrix
  const matrix = range(0, maxRangeMap()).map((y) => {
    return range(0, maxRangeMap()).map((x) => {
      for (const type of ['bot', 'building']) {
        if (collision({ x, y, dim: 1 }, [type])) return Object.keys(typeModels()).indexOf(type);
      }

      return 0;
    });
  });
  fs.writeFileSync(`./data/${nameFolderData}/matrix.json`, JSONmatrix(matrix), 'utf8');

  const io = new Server(process.env.IO_PORT, { cors: { origins: [`http://localhost:${process.env.CLIENT_PORT}`] } });
  const clients = [];
  io.on('connection', (socket) => {
    console.log(`socket.io | connect ${socket.id}`);
    clients.push(socket);
    console.log(`socket.io | currents clients: ${clients.length}`);
    const type = 'user';
    const { x, y } = getRandomPoint('', getAvailablePoints(type, ['building']));
    const { color, render } = getParamsType(type);
    const { dim } = render;
    const element = {
      id: socket.id,
      type,
      color,
      render: {
        x,
        y,
        dim,
      },
    };
    getAllElements().map((element) => socket.emit('update', JSON.stringify(element)));
    elements[type].push(element);
    clients.map((client) => client.emit('update', JSON.stringify(element)));

    socket.on('update', (args) => {
      // console.log(`socket.io | update ${socket.id} due to data: ${args}`);
      const eventElement = JSON.parse(args);
      const indexElement = elements[type].findIndex((element) => element.id === socket.id);
      elements[type][indexElement] = merge(elements[type][indexElement], eventElement);
      clients.map((client) => {
        if (socket.id !== client.id) client.emit('update', JSON.stringify({ id: socket.id, type, ...eventElement }));
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`socket.io | disconnect ${socket.id} due to reason: ${reason}`);
      clients.splice(clients.indexOf(socket), 1);
      clients.map((client) => client.emit('close', JSON.stringify({ id: socket.id, type })));
      elements[type].splice(
        elements[type].findIndex((element) => element.id === socket.id),
        1
      );
      console.log(`socket.io | currents clients: ${clients.length}`);
    });
  });

  console.log(`Io Server is running on port ${process.env.IO_PORT}`);

  const finder = new pathfinding.AStarFinder({
    allowDiagonal, // enable diagonal
    dontCrossCorners, // corner of a solid
    heuristic: pathfinding.Heuristic.chebyshev,
  });

  // bots controller
  const botMatrixCollision = getMatrixCollision('bot', ['building']);
  fs.writeFileSync(`./data/${nameFolderData}/matrixCollisionBotBuilding.json`, JSONmatrix(botMatrixCollision), 'utf8');
  const botPositionAvailablePoints = getAvailablePoints('bot', ['building']);
  setInterval(() => {
    getAllElements().map((element) => {
      switch (element.type) {
        case 'bot':
          if (!element.path) element.path = [];
          element.path.shift();
          let targetUser;
          while (element.path.length === 0 && !targetUser) {
            // element.path = range(0, maxRangeMap).map(i => [i, i]);

            let x2, y2, point;
            const usersTarget = elements['user'].filter((userElement) => {
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
              range(0, 1).map(() => element.path.pop());
              targetUser = true;
            }
          }
          if (element.path[0]) {
            element.render.x = element.path[0][0];
            element.render.y = element.path[0][1];
          }
          clients.map((client) =>
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
            )
          );
          break;
        case 'user':
          break;
        default:
          break;
      }
    });
  }, 20);
};

export { wsServer, ssrWS };
