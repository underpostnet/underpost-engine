const removePixiElement = (element) => {
  if (!element.type || !element.id || !pixi[element.type][element.id]) return;
  const { type } = element;
  Object.keys(pixi[type][element.id]).map((pixiKey) => pixi[type][element.id][pixiKey].destroy());
  delete params[type][element.id];
  delete pixi[type][element.id];
};
