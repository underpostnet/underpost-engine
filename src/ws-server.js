import dotenv from 'dotenv';
import { Server } from 'socket.io';
import fs from 'fs';
import pathfinding from 'pathfinding';
import { s4, range, random, JSONmatrix, getRandomPoint, newInstance } from './common.js';
import { JSONweb } from './util.js';

dotenv.config();

const nameFolderData = 'cyberia';
const maxRangeMapParam = 31;
const elements = {};

const typeModels = () => {
  return {
    floor: {
      color: () => 'green (html/css color)',
      render: () => {
        return {
          dim: () => maxRangeMap(),
        };
      },
    },
    building: {
      color: () => 'black',
      render: () => {
        return {
          dim: () => 2,
        };
      },
    },
    bot: {
      color: () => 'yellow',
      render: () => {
        return {
          dim: () => 1,
        };
      },
    },
    user: {
      color: () => 'cornell red',
      render: () => {
        return {
          dim: () => 2,
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
  while (getAllElements().find((x) => x.id === _id) || !_id) _id = 'x' + (s4() + s4() + s4() + s4() + s4()).slice(1);
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
    if (random(1, 100) <= 3) {
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
    // socket.emit('message', 'msg test server');
    const type = 'user';
    const { x, y } = getRandomPoint('', getAvailablePoints(type, ['building']));
    const { color, render } = getParamsType(type);
    const { dim } = render;
    elements[type].push({
      id: socket.id,
      type,
      color,
      render: {
        x,
        y,
        dim,
      },
    });

    socket.on('update', (...args) => {
      console.log(`socket.io | update ${socket.id} due to data: ${args}`);
      const eventElement = JSON.parse(args);
      elements[type][elements[type].findIndex((element) => element.id === socket.id)] = eventElement;
    });

    socket.on('disconnect', (reason) => {
      console.log(`socket.io | disconnect ${socket.id} due to reason: ${reason}`);
      clients.splice(clients.indexOf(socket), 1);
      elements[type].splice(
        elements[type].findIndex((element) => element.id === socket.id),
        1
      );
      console.log(`socket.io | currents clients: ${clients.length}`);
    });
  });

  console.log(`Io Server is running on port ${process.env.IO_PORT}`);

  const finder = new pathfinding.AStarFinder({
    allowDiagonal: true, // enable diagonal
    dontCrossCorners: false, // corner of a solid
    heuristic: pathfinding.Heuristic.chebyshev,
  });

  // bots controller
  const MatrixCollision_A = getMatrixCollision('bot', ['building']);
  fs.writeFileSync(`./data/${nameFolderData}/matrixCollisionBotBuilding.json`, JSONmatrix(MatrixCollision_A), 'utf8');
  const AvailablePoints_A = getAvailablePoints('bot', ['building']);
  setInterval(() => {
    getAllElements().map((element) => {
      switch (element.type) {
        case 'bot':
          if (!element.path) element.path = [];
          element.path.shift();

          while (element.path.length === 0) {
            // element.path = range(0, maxRangeMap).map(i => [i, i]);

            const { x2, y2 } = getRandomPoint(2, AvailablePoints_A);

            element.path = finder.findPath(
              element.render.x,
              element.render.y,
              x2,
              y2,
              new pathfinding.Grid(MatrixCollision_A)
            );
          }

          element.render.x = element.path[0][0];
          element.render.y = element.path[0][1];

          break;
        case 'user':
          break;
        default:
          break;
      }
    });
    const idsElmentsType = newInstance(elements);
    Object.keys(idsElmentsType).map((type) => {
      idsElmentsType[type] = idsElmentsType[type].map((x) => x.id);
      elements[type].map((element) => {
        clients.map((client) => {
          client.emit('update', JSON.stringify(element));
        });
      });
    });
    clients.map((client) => client.emit('ids', JSON.stringify(idsElmentsType)));
  }, 20);
};

export { wsServer, ssrWS };
