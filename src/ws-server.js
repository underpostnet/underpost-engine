


import dotenv from 'dotenv'
import { Server } from 'socket.io'
import fs from 'fs'
import pathfinding from 'pathfinding'
import { s4, range, random, JSONmatrix, getRandomPoint } from './common.js'
import { JSONweb } from './util.js'
// import { createServer } from 'http'

dotenv.config()

const minRangeMap = 0;
const maxRangeMap = 31;

const typeModels = {
    'floor': {
        color: () => 'green (html/css color)',
        render: () => {
            return {
                dim: () => maxRangeMap
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

const getAllElements = typeModels => {
    let elements = [];
    Object.keys(typeModels).map(keyType => {
        elements = elements.concat(typeModels[keyType].elements);
    });
    return elements;
};

const id = (typeModels) => {
    let _id = 'x' + s4() + s4();
    while (getAllElements(typeModels).find(x => x.id === _id))
        _id = 'x' + s4() + s4();
    return _id;
};

const matrixIterator = (MAIN, fn) =>
    range(MAIN.minRangeMap, MAIN.maxRangeMap).map(y =>
        range(MAIN.minRangeMap, MAIN.maxRangeMap).map(x =>
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

const common = `
    const getAllElements = ${getAllElements};
    const id = ${id};
    const matrixIterator = ${matrixIterator};
    const validateCollision = ${validateCollision};
    const collision = ${collision};
`;

// end common

const MAIN = {
    minRangeMap,
    maxRangeMap,
    typeModels
};

// ssr init elements

(() => {
    const type = 'floor';
    const { color, render } = getParamsType(type);
    const { dim } = render;
    typeModels[type].elements.push({
        id: id(typeModels),
        type,
        color,
        render: {
            x: 0,
            y: 0,
            dim
        }
    });
})()

matrixIterator(MAIN, (x, y) => {
    // if (x > maxRangeMap - 1 || y > maxRangeMap - 1) return;
    if (random(1, 100) <= 2) {

        const type = 'building';
        const { color, render } = getParamsType(type);
        const { dim } = render;

        typeModels[type].elements.push({
            id: id(typeModels),
            type,
            color,
            render: {
                x,
                y,
                dim
            }
        });
    }
});

const ssrWS = `
    const ssrMAIN = ${JSONweb(MAIN)};
    ${common}
`;

const initInstance = () => {

    matrixIterator(MAIN, (x, y) => {
        // if (x > maxRangeMap - 1 || y > maxRangeMap - 1) return;
        if (random(1, 100) <= 1) {

            const type = 'bot';
            const { color, render } = getParamsType(type);
            const { dim } = render;


            if (!collision({ dim, x, y }, ['building', 'bot'])) {
                typeModels[type].elements.push({
                    id: id(typeModels),
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
    });


    if (!fs.existsSync('./data/cyberia'))
        fs.mkdirSync('./data/cyberia', { recursive: true });

    // view test matrix
    const matrix = range(minRangeMap, maxRangeMap).map(y => {
        return range(minRangeMap, maxRangeMap).map(x => {
            for (const type of ['bot', 'building']) {
                if (collision({ x, y, dim: 1 }, [type])) return Object.keys(typeModels).indexOf(type);
            }

            return 0;
        });
    });
    fs.writeFileSync('./data/cyberia/matrix.json', JSONmatrix(matrix), 'utf8');



    // bots
    const matrixCollisionBotBuilding = range(minRangeMap, maxRangeMap).map(y => {
        return range(minRangeMap, maxRangeMap).map(x => {
            const dim = typeModels['bot'].render().dim();
            if (collision({ x, y, dim }, ['building'])) return 1;
            return 0;
        });
    });
    fs.writeFileSync('./data/cyberia/matrixCollisionBotBuilding.json', JSONmatrix(matrixCollisionBotBuilding), 'utf8');
    const finderMatrixCollisionBotBuilding = new pathfinding.AStarFinder({
        allowDiagonal: true, // enable diagonal
        dontCrossCorners: false, // corner of a solid
        heuristic: pathfinding.Heuristic.chebyshev
    });
    const endPointMatrixCollisionBotBuilding = [];
    matrixIterator(MAIN, (x, y) => {
        if (!collision({ x, y, dim: 1 }, ['building'])) endPointMatrixCollisionBotBuilding.push([x, y]);
    });

    return {
        bots: {
            matrixCollisionBotBuilding,
            finderMatrixCollisionBotBuilding,
            endPointMatrixCollisionBotBuilding
        }
    }

};

const wsServer = () => {

    const {
        matrixCollisionBotBuilding,
        finderMatrixCollisionBotBuilding,
        endPointMatrixCollisionBotBuilding
    } = initInstance().bots;

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


    setInterval(() => {
        getAllElements(typeModels).map(element => {
            if (element.type === 'bot') {

                if (!element.path) element.path = [];
                element.path.shift();

                while (element.path.length === 0) {

                    // element.path = range(0, maxRangeMap).map(i => [i, i]);

                    const { x2, y2 } = getRandomPoint(2, endPointMatrixCollisionBotBuilding);

                    element.path = finderMatrixCollisionBotBuilding
                        .findPath(
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

    return { io, clients };
};

export { wsServer, ssrWS };


