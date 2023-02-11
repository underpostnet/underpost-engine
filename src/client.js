append(
  'body',
  /*html*/ `
    <pixi-container class='in'></pixi-container>

`
);

const amplitudeRender = 13;

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

const renderPixiInitElement = (element) => {
  const { x, y, dim } = setAmplitudeRender(element.render);
  element.color = numberColors[element.color];
  const { color } = element;

  element.pixi = {};

  element.pixi.container = new PIXI.Container();
  const container = element.pixi.container;
  container.x = x;
  container.y = y;
  container.width = dim;
  container.height = dim;
  app.stage.addChild(container);

  element.pixi.background = new PIXI.Sprite(PIXI.Texture.WHITE);
  const background = element.pixi.background;
  background.x = 0;
  background.y = 0;
  background.width = dim;
  background.height = dim;
  background.tint = color;
  container.addChild(background);

  return element;
};
const renderPixiEventElement = (element) => {
  const { x, y } = setAmplitudeRender(element.render);
  const container = element.pixi.container;
  container.x = x;
  container.y = y;
};
const removePixiElement = (element) => {
  const { id, type, pixi } = element;
  Object.keys(pixi).map((pixiKey) => pixi[pixiKey].destroy());
  elements[type].splice(
    elements[type].findIndex((element) => element.id === id),
    1
  );
};

getAllElements().map((element) => renderPixiInitElement(element));

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

socket.on('close', (...args) => {
  // console.log(`socket.io event: close | reason: ${args}`);
  const eventElement = JSON.parse(args);
  const { id, type } = eventElement;
  removePixiElement(elements[type].find((element) => element.id === id));
});

socket.onAny((event, ...args) => {
  // console.log(`socket.io onAny event: ${event} | arguments: ${args}`);
});

window.activeKey = {};
window.onkeydown = (e) => (window.activeKey[e.key] = true);
window.onkeyup = (e) => (window.activeKey[e.key] = undefined);
