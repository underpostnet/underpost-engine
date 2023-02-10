


import dotenv from 'dotenv'
import { Server } from 'socket.io'
import fs from 'fs'
import pathfinding from 'pathfinding'
import { s4, range, random, JSONmatrix, getRandomPoint } from './common.js'
import { JSONweb } from './util.js'

dotenv.config()

const nameFolderData = 'cyberia';
const maxRangeMapParam = 31;

const maxRangeMap = arg => maxRangeMapParam - (arg !== undefined ?
    typeof arg === 'string' ?
        typeModels[arg].render().dim() : arg
    : 0);

const typeModels = {
    'floor': {
        color: () => 'green (html/css color)',
        render: () => {
            return {
                dim: () => maxRangeMap()
            }
        }
    },
    'building': {
        color: () => 'black',
        render: () => {
            return {
                dim: () => 2
            }
        }
    },
    'bot': {
        color: () => 'yellow',
        render: () => {
            return {
                dim: () => 2
            }
        }
    }
};


Object.keys(typeModels).map(keyType => {
    typeModels[keyType].elements = [];
});

const getParamsType = type => {
    return {
        color: typeModels[type].color(),
        render: {
            dim: typeModels[type].render().dim()
        }
    }
};



// common

const getAllElements = () => {
    let elements = [];
    Object.keys(typeModels).map(keyType => {
        elements = elements.concat(typeModels[keyType].elements);
    });
    return elements;
};

const id = () => {
    let _id = 'x' + s4() + s4();
    while (getAllElements().find(x => x.id === _id))
        _id = 'x' + s4() + s4();
    return _id;
};

const matrixIterator = (fn, maxMapArg) =>
    range(0, maxRangeMap(maxMapArg)).map(y =>
        range(0, maxRangeMap(maxMapArg)).map(x =>
            fn(x, y)
        )
    );

const validateCollision = (A, B) => {
    for (const yA of range(0, A.dim - 1)) {
        for (const xA of range(0, A.dim - 1)) {
            for (const yB of range(0, B.dim - 1)) {
                for (const xB of range(0, B.dim - 1)) {
                    if (
                        (A.x + xA) === (B.x + xB)
                        &&
                        (A.y + yA) === (B.y + yB)
                    ) {
                        return true;
                    }
                };
            };
        };
    };
    return false;
};

const collision = (render, types) => {
    for (const type of types) {
        if (typeModels[type].elements.find(element => validateCollision(
            element.render,
            render
        ))) return true;
    }
    return false;
};

const getMatrixCollision = (type, types) => range(0, maxRangeMap(type)).map(y => {
    return range(0, maxRangeMap(type)).map(x => {
        const dim = typeModels[type].render().dim();
        if (collision({ x, y, dim }, types)) return 1;
        return 0;
    });
});

const getAvailablePoints = (type, types) => {
    const availablePoints = [];
    const dim = typeModels[type].render().dim();
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
    typeModels[type].elements.push({
        id: id(),
        type,
        color,
        render: {
            x: 0,
            y: 0,
            dim
        }
    });
})();

(() => {
    const type = 'building';
    matrixIterator((x, y) => {

        if (random(1, 100) <= 3) {


            const { color, render } = getParamsType(type);
            const { dim } = render;

            typeModels[type].elements.push({
                id: id(),
                type,
                color,
                render: {
                    x,
                    y,
                    dim
                }
            });
        }
    }, type);
})();

const ssrWS = `
    const typeModels = ${JSONweb(typeModels)};
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
        matrixIterator((x, y) => {

            if (random(1, 100) <= 1) {


                const { color, render } = getParamsType(type);
                const { dim } = render;


                if (!collision({ dim, x, y }, ['building', 'bot'])) {
                    typeModels[type].elements.push({
                        id: id(),
                        type,
                        color,
                        render: {
                            x,
                            y,
                            dim
                        }
                    });
                }
            }
        }, type);
    })();


    if (!fs.existsSync('./data/cyberia'))
        fs.mkdirSync('./data/cyberia', { recursive: true });

    // view test matrix
    const matrix = range(0, maxRangeMap()).map(y => {
        return range(0, maxRangeMap()).map(x => {
            for (const type of ['bot', 'building']) {
                if (collision({ x, y, dim: 1 }, [type])) return Object.keys(typeModels).indexOf(type);
            }

            return 0;
        });
    });
    fs.writeFileSync(`./data/${nameFolderData}/matrix.json`, JSONmatrix(matrix), 'utf8');

    const io = new Server(process.env.IO_PORT, { cors: { origins: [`http://localhost:${process.env.CLIENT_PORT}`] } })
    const clients = [];
    io.on("connection", (socket) => {

        console.log(`socket.io | connect ${socket.id}`);
        clients.push(socket);
        console.log(`socket.io | currents clients: ${clients.length}`);
        // socket.emit('message', 'msg test server');

        socket.on("message", (...args) => {
            console.log(`socket.io | message ${socket.id} due to data: ${args}`);
        });

        socket.on("disconnect", (reason) => {
            console.log(`socket.io | disconnect ${socket.id} due to reason: ${reason}`);
            clients.splice(clients.indexOf(socket), 1);
            console.log(`socket.io | currents clients: ${clients.length}`);
        });
    });

    console.log(`Io Server is running on port ${process.env.IO_PORT}`);

    const finder = new pathfinding.AStarFinder({
        allowDiagonal: true, // enable diagonal
        dontCrossCorners: false, // corner of a solid
        heuristic: pathfinding.Heuristic.chebyshev
    });

    // bots controller
    const matrixCollisionBotBuilding = getMatrixCollision('bot', ['building']);
    fs.writeFileSync(`./data/${nameFolderData}/matrixCollisionBotBuilding.json`, JSONmatrix(matrixCollisionBotBuilding), 'utf8');
    const endPointMatrixCollisionBotBuilding = getAvailablePoints('bot', ['building']);
    setInterval(() => {
        getAllElements().map(element => {
            if (element.type === 'bot') {

                if (!element.path) element.path = [];
                element.path.shift();

                while (element.path.length === 0) {

                    // element.path = range(0, maxRangeMap).map(i => [i, i]);

                    const { x2, y2 } = getRandomPoint(2, endPointMatrixCollisionBotBuilding);

                    element.path = finder.findPath(
                        element.render.x,
                        element.render.y,
                        x2,
                        y2,
                        new pathfinding.Grid(matrixCollisionBotBuilding)
                    );


                }

                element.render.x = element.path[0][0];
                element.render.y = element.path[0][1];

                clients.map(client => {

                    client.emit('message', JSON.stringify(element));
                });

            }
        });
    }, 10);

};

export { wsServer, ssrWS };


