append(
  'body',
  /*html*/ `
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
  // socket.emit('message', 'msg test client');
});

socket.on('connect_error', (err) => {
  // console.log(`socket.io event: connect_error | reason: ${err.message}`);
});

socket.on('disconnect', (reason) => {
  // console.log(`socket.io event: disconnect | reason: ${reason}`);
});

socket.on('update', (...args) => {
  // console.log(`socket.io event: update | reason: ${args}`);
  const eventElement = JSON.parse(args);
  const { id, render, type } = eventElement;
  const element = elements[type].find((element) => element.id === id);
  if (element) {
    element.render = render;
    return renderPixiEventElement(element);
  }
  elements[type].push(eventElement);
  return renderPixiInitElement(eventElement);
});

socket.on('ids', (...args) => {
  const ids = JSON.parse(args);
  Object.keys(ids).map((type) => {
    newInstance(elements[type]).map((element) => {
      if (!ids[type].find((id) => id === element.id)) {
        const { id } = element;
        removePixiElement(element);
        elements[type].splice(
          elements[type].findIndex((element) => element.id === id),
          1
        );
      }
    });
  });
});

socket.onAny((event, ...args) => {
  // console.log(`socket.io onAny event: ${event} | arguments: ${args}`);
});

window.activeKey = {};
window.onkeydown = (e) => (window.activeKey[e.key] = true);
window.onkeyup = (e) => (window.activeKey[e.key] = undefined);

setInterval(() => {
  const element = elements.user.find((element) => element.id === socket.id);
  if (element) {
    let update = false;
    if (window.activeKey['ArrowLeft']) {
      element.render.x -= 1;
      update = true;
    }
    if (window.activeKey['ArrowRight']) {
      element.render.x += 1;
      update = true;
    }
    if (window.activeKey['ArrowDown']) {
      element.render.y += 1;
      update = true;
    }
    if (window.activeKey['ArrowUp']) {
      element.render.y -= 1;
      update = true;
    }
    if (update) {
      renderPixiEventElement(element);
      socket.emit('update', JSON.stringify(element));
    }
  }
}, 20);
