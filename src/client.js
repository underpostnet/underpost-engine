append(
  'body',
  /*html*/ `
    <style>
      body {
        background: black;
        color: white;
        padding: 0px;
        margin: 0px;
        cursor: url('/cursors/black-default.png') -30 -30, auto;
      }
      canvas {
        margin: auto;
        display: block;
        position: relative;
        cursor: url('/cursors/black-pointer.png') -30 -30, auto !important;
      }
    </style>
    <style class='canvas-dim'></style>
    <pixi-container class='in'></pixi-container>

`
);

const amplitudeRender = 50;
const elements = {};
const pixi = {};
const params = {};

Object.keys(typeModels()).map((type) => ((elements[type] = []), (pixi[type] = {}), (params[type] = {})));

const app = new PIXI.Application({
  width: maxRangeMap() * amplitudeRender,
  height: maxRangeMap() * amplitudeRender,
  background: 'gray',
});

const setAmplitudeRender = (render) => {
  const returnRender = {};
  Object.keys(render).map((keyRender) => {
    returnRender[keyRender] = render[keyRender] * amplitudeRender;
  });
  return returnRender;
};

s('pixi-container').appendChild(app.view);

console.log('typeModels', typeModels());
console.log('elements', elements);
console.log('pixi', pixi);

const renderPixiInitElement = (element) => {
  console.log('renderPixiInitElement', element);
  const { type } = element;
  const { x, y, dim } = setAmplitudeRender(element.render);
  const color = numberColors[element.color];

  pixi[type][element.id] = {};

  params[type][element.id] = {
    direction: 'South',
    directionCheckTimeInterval: 500,
    directionChangeActive: true,
    spriteFrameInterval: 250,
    spriteIdStop: null,
  };

  pixi[type][element.id].container = new PIXI.Container();
  const container = pixi[type][element.id].container;
  container.x = x;
  container.y = y;
  container.width = dim;
  container.height = dim;
  app.stage.addChild(container);

  if (typeModels()[type].components().includes('tiles')) {
    pixi[type][element.id].tile = PIXI.Sprite.from(`/tiles/${element.map}.PNG`);
    const tile = pixi[type][element.id].tile;
    tile.x = 0;
    tile.y = 0;
    tile.width = dim;
    tile.height = dim;
    container.addChild(tile);
  }

  if (typeModels()[type].components().includes('background')) {
    pixi[type][element.id].background = new PIXI.Sprite(PIXI.Texture.WHITE);
    const background = pixi[type][element.id].background;
    background.x = 0;
    background.y = 0;
    background.width = dim;
    background.height = dim;
    background.tint = color;
    container.addChild(background);
  }

  if (typeModels()[type].components().includes('sprites')) {
    spriteDirs.map((spriteDir) => {
      range(0, parseInt(spriteDir[0])).map((spriteFrame) => {
        const src = `/sprites/${element.sprite}/${spriteDir}/${spriteFrame}.png`;
        pixi[type][element.id][src] = PIXI.Sprite.from(src);
        pixi[type][element.id][src].x = 0;
        pixi[type][element.id][src].y = 0;
        pixi[type][element.id][src].width = dim;
        pixi[type][element.id][src].height = dim;
        pixi[type][element.id][src].visible = spriteDir === '08';
        container.addChild(pixi[type][element.id][src]);
      });
    });
  }

  return element;
};

const clearFramesSprites = (element) => {
  const { type } = element;
  spriteDirs.map((spriteDir) => {
    range(0, parseInt(spriteDir[0])).map((spriteFrame) => {
      const src = `/sprites/${element.sprite}/${spriteDir}/${spriteFrame}.png`;
      pixi[type][element.id][src].visible = false;
    });
  });
};

const renderPixiEventElement = (element) => {
  const { type } = element;
  const { x, y } = setAmplitudeRender(element.render);
  const container = pixi[type][element.id].container;
  // change sprite animation
  const direction = getDirection(container.x, container.y, x, y).direction;

  if (
    (params[type][element.id].directionChangeActive === true && (container.x !== x || container.y !== y)) ||
    params[type][element.id].direction !== direction
  ) {
    params[type][element.id].directionChangeActive = false;
    const frames = params[type][element.id].directionCheckTimeInterval / params[type][element.id].spriteFrameInterval;
    range(0, frames).map((frame) => {
      setTimeout(() => {
        if (params[type][element.id].direction !== direction) return;
        const typeFrame = frame % 2;
        if (frame !== frames) {
          clearFramesSprites(element);
          switch (direction) {
            case 'South East':
              // ↘
              pixi[type][element.id][`/sprites/${element.sprite}/16/${typeFrame}.png`].visible = true;
              break;
            case 'East':
              // →
              pixi[type][element.id][`/sprites/${element.sprite}/16/${typeFrame}.png`].visible = true;
              break;
            case 'North East':
              // ↗
              pixi[type][element.id][`/sprites/${element.sprite}/16/${typeFrame}.png`].visible = true;
              break;
            case 'South':
              // ↓
              pixi[type][element.id][`/sprites/${element.sprite}/18/${typeFrame}.png`].visible = true;
              break;
            case 'North':
              // ↑
              pixi[type][element.id][`/sprites/${element.sprite}/12/${typeFrame}.png`].visible = true;
              break;
            case 'South West':
              // ↙
              pixi[type][element.id][`/sprites/${element.sprite}/14/${typeFrame}.png`].visible = true;
              break;
            case 'West':
              // ←
              pixi[type][element.id][`/sprites/${element.sprite}/14/${typeFrame}.png`].visible = true;
              break;
            case 'North West':
              // ↖
              pixi[type][element.id][`/sprites/${element.sprite}/14/${typeFrame}.png`].visible = true;
              break;
            default:
              pixi[type][element.id][`/sprites/${element.sprite}/18/${typeFrame}.png`].visible = true;
              break;
          }
        } else {
          const spriteIdStop = s4();
          params[type][element.id].spriteIdStop = newInstance(spriteIdStop);
          setTimeout(() => {
            if (params[type][element.id].spriteIdStop === spriteIdStop) {
              clearFramesSprites(element);
              switch (params[type][element.id].direction) {
                case 'South East':
                  // ↘
                  pixi[type][element.id][`/sprites/${element.sprite}/06/0.png`].visible = true;
                  break;
                case 'East':
                  // →
                  pixi[type][element.id][`/sprites/${element.sprite}/06/0.png`].visible = true;
                  break;
                case 'North East':
                  // ↗
                  pixi[type][element.id][`/sprites/${element.sprite}/06/0.png`].visible = true;
                  break;
                case 'South':
                  // ↓
                  pixi[type][element.id][`/sprites/${element.sprite}/08/0.png`].visible = true;
                  break;
                case 'North':
                  // ↑
                  pixi[type][element.id][`/sprites/${element.sprite}/02/0.png`].visible = true;
                  break;
                case 'South West':
                  // ↙
                  pixi[type][element.id][`/sprites/${element.sprite}/04/0.png`].visible = true;
                  break;
                case 'West':
                  // ←
                  pixi[type][element.id][`/sprites/${element.sprite}/04/0.png`].visible = true;
                  break;
                case 'North West':
                  // ↖
                  pixi[type][element.id][`/sprites/${element.sprite}/04/0.png`].visible = true;
                  break;
                default:
                  pixi[type][element.id][`/sprites/${element.sprite}/08/0.png`].visible = true;
                  break;
              }
            }
          }, params[type][element.id].spriteFrameInterval);
          params[type][element.id].directionChangeActive = true;
        }
      }, frame * params[type][element.id].spriteFrameInterval);
    });
  }
  if (direction !== undefined) params[type][element.id].direction = direction;

  // change position animation
  const frames = 6;
  const intervalChangeX = Math.abs(x - container.x) / frames;
  const intervalChangeY = Math.abs(y - container.y) / frames;
  range(0, frames - 1).map((frameTime) => {
    setTimeout(() => {
      if (container.x > x) container.x = container.x - intervalChangeX;
      if (container.x < x) container.x = container.x + intervalChangeX;
      if (container.y > y) container.y = container.y - intervalChangeY;
      if (container.y < y) container.y = container.y + intervalChangeY;
      if (frameTime === frames - 1) {
        container.x = x;
        container.y = y;
      }
    }, frameTime * (updateTimeInterval / (frames - 1))); // 4 frames 100 interval -> 33*0 33*1 33*2 33*3
  });
};
const removePixiElement = (element) => {
  const { type } = element;
  Object.keys(pixi[type][element.id]).map((pixiKey) => pixi[type][element.id][pixiKey].destroy());
  delete params[type][element.id];
  delete pixi[type][element.id];
};

const socket = io('ws://localhost:5501');

socket.on('connect', () => {
  console.log(`socket.io event: connect | session id: ${socket.id}`);
  socket.emit('init', getURI());
});

socket.on('connect_error', (err) => {
  // console.log(`socket.io event: connect_error | reason: ${err.message}`);
});

socket.on('disconnect', (reason) => {
  // console.log(`socket.io event: disconnect | reason: ${reason}`);
  // setTimeout(() => location.reload(), 2000);
  Object.keys(elements).map((type) => {
    elements[type].map((element) => removePixiElement(element));
    elements[type] = [];
  });
});

let userPositionAvailablePoints = [];
let userMatrixCollision = [];

socket.on('update', (...args) => {
  // console.log(`socket.io event: update | reason: ${args}`);
  const eventElement = JSON.parse(args);
  const { id, type } = eventElement;
  const elementIndex = elements[type].findIndex((element) => element.id === id);
  if (elementIndex > -1) {
    elements[type][elementIndex] = merge(elements[type][elementIndex], eventElement);
    return renderPixiEventElement(elements[type][elementIndex]);
  }
  elements[type].push(eventElement);
  if (eventElement.id === socket.id) {
    userPositionAvailablePoints = getAvailablePoints('user', ['building'], eventElement.map);
    userMatrixCollision = getMatrixCollision('user', ['building'], eventElement.map);
    console.log('userMatrixCollision', JSONmatrix(userMatrixCollision));
  }
  return renderPixiInitElement(eventElement);
});

socket.on('close', (...args) => {
  const eventElement = JSON.parse(args);
  const { id, type } = eventElement;
  removePixiElement(eventElement);
  elements[type].splice(
    elements[type].findIndex((element) => element.id === id),
    1
  );
  console.log('close', type, elements[type]);
});

socket.onAny((event, ...args) => {
  // console.log(`socket.io onAny event: ${event} | arguments: ${args}`);
});

// canvas dim controller
let lastScreenDim;
setInterval(() => {
  const screnDim = dimState();
  if (lastScreenDim !== screnDim.minValue) {
    lastScreenDim = newInstance(screnDim.minValue);
    htmls(
      '.canvas-dim',
      /*css*/ `
      canvas {
        width: ${screnDim.minValue}px;
        height: ${screnDim.minValue}px;
        top: ${screnDim.maxType === 'height' ? (screnDim.maxValue - screnDim.minValue) / 2 : 0}px;
      }
    `
    );
  }
}, updateTimeInterval);

window.pathfinding = PF;
const finder = new pathfinding.AStarFinder({
  allowDiagonal, // enable diagonal
  dontCrossCorners, // corner of a solid
  heuristic: pathfinding.Heuristic.chebyshev,
});

s('canvas').onclick = (e, subPath) => {
  let x2 = subPath === undefined ? parseInt(maxRangeMap() * (e.offsetX / dimState().minValue)) : e.offsetX;
  let y2 = subPath === undefined ? parseInt(maxRangeMap() * (e.offsetY / dimState().minValue)) : e.offsetY;
  const element = elements.user.find((element) => element.id === socket.id);
  if (element) {
    if (x2 > maxRangeMap(element.render.dim)) x2 = maxRangeMap(element.render.dim);
    if (y2 > maxRangeMap(element.render.dim)) y2 = maxRangeMap(element.render.dim);
    const x1 = element.render.x;
    const y1 = element.render.y;
    console.log(x1, y1, '->', x2, y2);
    element.path =
      subPath === undefined
        ? finder.findPath(
            x1,
            y1,
            x2,
            y2,
            new pathfinding.Grid(userMatrixCollision.length, userMatrixCollision.length, userMatrixCollision)
          )
        : subPath;
    console.log(element.path);
    if (element.path.length === 0 && subPath === undefined) {
      const dirsArr = {};
      let wArray = [];

      directions.map((dir) => {
        dirsArr[dir] = { x: x2, y: y2 };

        const whileCondition = () =>
          userMatrixCollision[dirsArr[dir].y] &&
          userMatrixCollision[dirsArr[dir].y][dirsArr[dir].x] === 1 &&
          dirsArr[dir].x >= 0 &&
          dirsArr[dir].y >= 0 &&
          dirsArr[dir].x < maxRangeMap() &&
          dirsArr[dir].y < maxRangeMap();

        switch (dir) {
          case 'South East':
            // ↘
            while (whileCondition()) {
              dirsArr[dir].x++;
              dirsArr[dir].y++;
            }
            break;
          case 'East':
            // →
            while (whileCondition()) {
              dirsArr[dir].x++;
            }
            break;
          case 'North East':
            // ↗
            while (whileCondition()) {
              dirsArr[dir].x++;
              dirsArr[dir].y--;
            }
            break;
          case 'South':
            // ↓
            while (whileCondition()) {
              dirsArr[dir].y++;
            }
            break;
          case 'North':
            // ↑
            while (whileCondition()) {
              dirsArr[dir].y--;
            }
            break;
          case 'South West':
            // ↙
            while (whileCondition()) {
              dirsArr[dir].x--;
              dirsArr[dir].y++;
            }
            break;
          case 'West':
            // ←
            while (whileCondition()) {
              dirsArr[dir].x--;
            }
            break;
          case 'North West':
            // ↖
            while (whileCondition()) {
              dirsArr[dir].x--;
              dirsArr[dir].y--;
            }
            break;
        }
        if (userMatrixCollision[dirsArr[dir].y] && userMatrixCollision[dirsArr[dir].y][dirsArr[dir].x] === 0) {
          dirsArr[dir].w = getDistance(x2, y2, dirsArr[dir].x, dirsArr[dir].y);
          dirsArr[dir].path = finder.findPath(
            x1,
            y1,
            dirsArr[dir].x,
            dirsArr[dir].y,
            new pathfinding.Grid(userMatrixCollision.length, userMatrixCollision.length, userMatrixCollision)
          );
          if (dirsArr[dir].path.length > 0) wArray.push(dirsArr[dir]);
        }
      });
      console.log('wArray', wArray);
      if (wArray[0]) {
        const wArrayOrder = orderArrayFromAttrInt(wArray, 'w', 'asc');
        wArray = wArrayOrder.filter((dirObj) => dirObj.w === wArrayOrder[0].w);
        const newPoint = wArray[random(0, wArray.length - 1)];
        console.log('newPoint', newPoint);
        const { x, y, path } = newPoint;
        s('canvas').onclick(
          {
            offsetX: x,
            offsetY: y,
          },
          path
        );
      }
    }
  }
};

window.activeKey = {};
window.onkeydown = (e) => (window.activeKey[e.key] = true);
window.onkeyup = (e) => (window.activeKey[e.key] = undefined);

setInterval(() => {
  const element = elements.user.find((element) => element.id === socket.id);
  if (element) {
    const emitElement = {
      render: {},
    };
    let update = false;
    if (
      window.activeKey['ArrowLeft'] &&
      userPositionAvailablePoints.find((point) => point[0] === element.render.x - 1 && point[1] === element.render.y)
    ) {
      element.render.x -= 1;
      emitElement.render.x = element.render.x;
      update = true;
    }
    if (
      window.activeKey['ArrowRight'] &&
      userPositionAvailablePoints.find((point) => point[0] === element.render.x + 1 && point[1] === element.render.y)
    ) {
      element.render.x += 1;
      emitElement.render.x = element.render.x;
      update = true;
    }
    if (
      window.activeKey['ArrowDown'] &&
      userPositionAvailablePoints.find((point) => point[0] === element.render.x && point[1] === element.render.y + 1)
    ) {
      element.render.y += 1;
      emitElement.render.y = element.render.y;
      update = true;
    }
    if (
      window.activeKey['ArrowUp'] &&
      userPositionAvailablePoints.find((point) => point[0] === element.render.x && point[1] === element.render.y - 1)
    ) {
      element.render.y -= 1;
      emitElement.render.y = element.render.y;
      update = true;
    }
    if (element.path && element.path.length > 0) {
      element.render.x = element.path[0][0];
      element.render.y = element.path[0][1];
      emitElement.render.y = element.render.y;
      emitElement.render.x = element.render.x;
      update = true;
      element.path.shift();
    }
    if (update) {
      renderPixiEventElement(element);
      socket.emit('update', JSON.stringify(emitElement));
    }
  }
}, updateTimeInterval);
