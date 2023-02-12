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
  Object.keys(render).map((keyRender) => {
    render[keyRender] = render[keyRender] * amplitudeRender;
  });
  return render;
};

s('pixi-container').appendChild(app.view);

console.log('typeModels', typeModels());
console.log('elements', elements);
console.log('pixi', pixi);

const renderPixiInitElement = (element) => {
  const { type } = element;
  const { x, y, dim } = setAmplitudeRender(element.render);
  element.color = numberColors[element.color];
  const { color } = element;

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
  const { id, type } = element;
  Object.keys(pixi[type][element.id]).map((pixiKey) => pixi[type][element.id][pixiKey].destroy());
  elements[type].splice(
    elements[type].findIndex((element) => element.id === id),
    1
  );
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
  const element = getAllElements().find((element) => element.id === id);
  if (element) {
    element.render = render;
    return renderPixiEventElement(element);
  }
  return elements[type].push(renderPixiInitElement(eventElement));
});

socket.on('ids', (...args) => {
  const ids = JSON.parse(args);
  Object.keys(ids).map((type) => {
    newInstance(elements[type]).map((element) => {
      if (!ids[type].find((id) => id === element.id)) removePixiElement(element);
    });
  });
});

socket.onAny((event, ...args) => {
  // console.log(`socket.io onAny event: ${event} | arguments: ${args}`);
});

window.activeKey = {};
window.onkeydown = (e) => (window.activeKey[e.key] = true);
window.onkeyup = (e) => (window.activeKey[e.key] = undefined);
