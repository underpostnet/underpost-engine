append(
  'body',
  /*html*/ `
    <style>
      body {
        background: black;
        color: white;
        padding: 0px;
        margin: 0px;
        cursor: url('/assets/cursors/black-default.png') -30 -30, auto;
      }
      canvas {
        margin: auto;
        display: block;
        position: relative;
        cursor: url('/assets/cursors/black-pointer.png') -30 -30, auto !important;
      }
    </style>
    <style class='canvas-dim'></style>
    <pixi-container class='in'></pixi-container>

`
);

const amplitudeRender = 13;
const elements = {};
const pixi = {};

Object.keys(typeModels()).map((type) => ((elements[type] = []), (pixi[type] = {})));

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

  pixi[type][element.id].container = new PIXI.Container();
  const container = pixi[type][element.id].container;
  container.x = x;
  container.y = y;
  container.width = dim;
  container.height = dim;
  app.stage.addChild(container);

  pixi[type][element.id].background = new PIXI.Sprite(PIXI.Texture.WHITE);
  const background = pixi[type][element.id].background;
  background.x = 0;
  background.y = 0;
  background.width = dim;
  background.height = dim;
  background.tint = color;
  container.addChild(background);

  if (typeModels()[type].components().includes('head')) {
    pixi[type][element.id].head = new PIXI.Sprite(PIXI.Texture.WHITE);
    const head = pixi[type][element.id].head;
    const headDimFactor = 0.6;
    head.x = (dim - dim * headDimFactor) * 0.5;
    head.y = 0;
    head.width = dim * headDimFactor;
    head.height = dim * headDimFactor;
    head.tint = numberColors['cream'];
    container.addChild(head);

    // eyes
    const distanceEyeFactor = 0.15;
    const distanceEyeYFactor = 0.08;

    pixi[type][element.id].leftEye = new PIXI.Sprite(PIXI.Texture.WHITE);
    const leftEye = pixi[type][element.id].leftEye;
    const leftEyeDimFactor = 0.2;
    leftEye.x = (dim - dim * leftEyeDimFactor) * 0.5 - dim * distanceEyeFactor;
    leftEye.y = dim * distanceEyeYFactor;
    leftEye.width = dim * leftEyeDimFactor;
    leftEye.height = dim * leftEyeDimFactor;
    leftEye.tint = numberColors['blueberry'];
    container.addChild(leftEye);

    pixi[type][element.id].rightEye = new PIXI.Sprite(PIXI.Texture.WHITE);
    const rightEye = pixi[type][element.id].rightEye;
    const rightEyeDimFactor = 0.2;
    rightEye.x = (dim - dim * rightEyeDimFactor) * 0.5 + dim * distanceEyeFactor;
    rightEye.y = dim * distanceEyeYFactor;
    rightEye.width = dim * rightEyeDimFactor;
    rightEye.height = dim * rightEyeDimFactor;
    rightEye.tint = numberColors['blueberry'];
    container.addChild(rightEye);
  }

  return element;
};
const renderPixiEventElement = (element) => {
  const { type } = element;
  const { x, y } = setAmplitudeRender(element.render);
  const container = pixi[type][element.id].container;
  container.x = x;
  container.y = y;
};
const removePixiElement = (element) => {
  const { type } = element;
  Object.keys(pixi[type][element.id]).map((pixiKey) => pixi[type][element.id][pixiKey].destroy());
  delete pixi[type][element.id];
};

const socket = io('ws://localhost:5501');

socket.on('connect', () => {
  console.log(`socket.io event: connect | session id: ${socket.id}`);
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
    userPositionAvailablePoints = getAvailablePoints('user', ['building']);
    userMatrixCollision = getMatrixCollision('user', ['building']);
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
}, 20);

window.pathfinding = PF;
const finder = new pathfinding.AStarFinder({
  allowDiagonal, // enable diagonal
  dontCrossCorners, // corner of a solid
  heuristic: pathfinding.Heuristic.chebyshev,
});

s('canvas').onclick = (e, subSearch) => {
  let x2 = subSearch === undefined ? parseInt(maxRangeMap() * (e.offsetX / dimState().minValue)) : e.offsetX;
  let y2 = subSearch === undefined ? parseInt(maxRangeMap() * (e.offsetY / dimState().minValue)) : e.offsetY;
  const element = elements.user.find((element) => element.id === socket.id);
  if (element) {
    if (x2 > maxRangeMap(element.render.dim)) x2 = maxRangeMap(element.render.dim);
    if (y2 > maxRangeMap(element.render.dim)) y2 = maxRangeMap(element.render.dim);
    const x1 = element.render.x;
    const y1 = element.render.y;
    console.log(x1, y1, '->', x2, y2);
    element.path = finder.findPath(
      x1,
      y1,
      x2,
      y2,
      new pathfinding.Grid(userMatrixCollision.length, userMatrixCollision.length, userMatrixCollision)
    );
    console.log(element.path);
    if (element.path.length === 0 && subSearch === undefined) {
      const dirsArr = {};
      const directions = ['South East', 'East', 'North East', 'South', 'North', 'South West', 'West', 'North West'];
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
        dirsArr[dir].w = getDistance(x2, y2, dirsArr[dir].x, dirsArr[dir].y);
        dirsArr[dir].validate =
          userMatrixCollision[dirsArr[dir].y] && userMatrixCollision[dirsArr[dir].y][dirsArr[dir].x] === 0
            ? true
            : false;
        wArray.push(dirsArr[dir]);
      });
      console.log('wArray', wArray);
      wArray = wArray.filter((dirObj) => dirObj.validate === true);
      if (wArray[0]) {
        const wArrayOrder = orderArrayFromAttrInt(wArray, 'w', 'asc');
        wArray = wArrayOrder.filter((dirObj) => dirObj.w === wArrayOrder[0].w);
        const newPoint = wArray[random(0, wArray.length - 1)];
        console.log('newPoint', newPoint);
        const { x, y } = newPoint;
        s('canvas').onclick(
          {
            offsetX: x,
            offsetY: y,
          },
          true
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
}, 20);
