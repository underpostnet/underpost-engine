const renderPixiEventElement = (element) => {
  const { type, id } = element;
  if (!pixi[type][element.id]) return;
  let x, y, dim, container;
  if (element.render) {
    const renderObj = setAmplitudeRender(element.render);
    x = renderObj.x;
    y = renderObj.y;
    dim = renderObj.dim;
  }
  container = pixi[type][element.id].container;
  if (!container) return;
  // change sprite animation
  let direction = getDirection(container.x, container.y, x, y).direction;
  if (element.direction) {
    direction = newInstance(element.direction);
    element.direction = undefined;
  }
  let rebird = false;
  if (
    typeModels()[type].components().includes('sprites') &&
    element.life > 0 &&
    pixi[type][element.id][`/sprites/ghost/08/0.png`] &&
    pixi[type][element.id][`/sprites/ghost/08/0.png`].visible === true
  ) {
    pixi[type][element.id][`/sprites/ghost/08/0.png`].visible = false;
    direction = 'South';
    rebird = true;
    params[type][element.id].directionChangeActive = true;
  }

  if (
    typeModels()[type].components().includes('sprites') &&
    element.life <= 0 &&
    pixi[type][element.id][`/sprites/ghost/08/0.png`] &&
    pixi[type][element.id][`/sprites/ghost/08/0.png`].visible === false
  ) {
    clearFramesSprites(element);
    pixi[type][element.id][`/sprites/ghost/08/0.png`].visible = true;
  } else if (
    element.life > 0 &&
    typeModels()[type].components().includes('sprites') &&
    ((params[type][element.id].directionChangeActive === true && (container.x !== x || container.y !== y || rebird)) ||
      params[type][element.id].direction !== direction) &&
    direction !== undefined
  ) {
    params[type][element.id].directionChangeActive = false;
    const frames = params[type][element.id].directionCheckTimeInterval / params[type][element.id].spriteFrameInterval;
    const switchInitFrame = [0, 1][random(0, 1)];
    range(0 + switchInitFrame, frames + switchInitFrame).map((frame) => {
      setTimeout(() => {
        if (!pixi[type][element.id]) return;
        const typeFrame = frame % 2;
        if (frame !== frames) {
          clearFramesSprites(element);
          if (element.life <= 0) return;
          if (!validateSpritesFrames(element)) return;
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
            if (!pixi[type][element.id]) return;
            if (params[type][element.id].spriteIdStop === spriteIdStop) {
              clearFramesSprites(element);
              if (element.life <= 0) return;
              if (!validateSpritesFrames(element)) return;
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

  if (typeModels()[type].components().includes('bar-life')) {
    const newLife = dim * (element.life / element.maxLife);
    if (
      typeModels()[type].components().includes('blood') &&
      newLife < pixi[type][element.id].barLife.width &&
      element.life !== element.maxLife
    ) {
      (() => {
        if (!pixi[type][element.id]) return;
        const maxFrames = 6;
        let currentFrame = 0;
        pixi[type][element.id][`/sprites/blood/08/${currentFrame}.png`].visible = true;
        if (hashIntervals[element.id][`interval-blood`]) clearInterval(hashIntervals[element.id][`interval-blood`]);
        hashIntervals[element.id][`interval-blood`] = setInterval(() => {
          if (!params[type][element.id] || !pixi[type][element.id][`/sprites/blood/08/${currentFrame}.png`]) return;
          pixi[type][element.id][`/sprites/blood/08/${currentFrame}.png`].visible = false;
          currentFrame++;
          if (currentFrame > maxFrames) currentFrame = 0;
          if (!params[type][element.id] || !pixi[type][element.id][`/sprites/blood/08/${currentFrame}.png`]) return;
          pixi[type][element.id][`/sprites/blood/08/${currentFrame}.png`].visible = true;
        }, 100);
        setTimeout(() => {
          if (!pixi[type][element.id]) return;
          range(0, maxFrames).map((frame) => {
            const src = `/sprites/blood/08/${frame}.png`;
            if (!pixi[type][element.id][src]) return;
            pixi[type][element.id][src].visible = false;
          });
        }, 500);
      })();
    }
    const porLife = (element.life / element.maxLife) * 100;
    if (porLife <= 20) pixi[type][element.id].barLife.tint = numberColors['crimson red'];
    else if (porLife <= 50) pixi[type][element.id].barLife.tint = numberColors['citrine'];
    else pixi[type][element.id].barLife.tint = numberColors['green-yellow'];
    pixi[type][element.id].barLife.width = newLife;
  }

  if (direction !== undefined) params[type][element.id].direction = direction;
  if (typeModels()[type].components().includes('life-indicator')) renderIndicatorLife(container, element, dim, type); // .text = 'new text';
  // change position animation
  // 100 -> 6
  // 100*vel -> x
  const intervalFrameTimeAnimation = updateTimeInterval * (element.velFactor ? element.velFactor : 1);
  const frames = parseInt((intervalFrameTimeAnimation * 4) / 100);
  const intervalChangeX = Math.abs(x - container.x) / frames;
  const intervalChangeY = Math.abs(y - container.y) / frames;
  range(0, frames - 1).map((frameTime) => {
    setTimeout(() => {
      if (container._destroyed) return;
      if (container.x > x) container.x = container.x - intervalChangeX;
      if (container.x < x) container.x = container.x + intervalChangeX;
      if (container.y > y) container.y = container.y - intervalChangeY;
      if (container.y < y) container.y = container.y + intervalChangeY;
      if (frameTime === frames - 1) {
        // container.x = x;
        // container.y = y;
        const newMapObj = changeMapsPoints.find(
          (mapData) =>
            mapData.fromMap === element.map && mapData.fromX === element.render.x && mapData.fromY === element.render.y
        );
        if (
          newMapObj &&
          id === socket.id &&
          params[type][id].mapChangeActive === true &&
          element.life > 0 &&
          (!element.path || element.path.length === 0)
        ) {
          console.log('newMapObj', newMapObj);
          const eventElement = newInstance(element);
          eventElement.render.x = newMapObj.toX;
          eventElement.render.y = newMapObj.toY;
          eventElement.map = newMapObj.toMap;
          newMainUserInstance(eventElement);
        }
      }
    }, frameTime * (intervalFrameTimeAnimation / (frames - 1))); // 4 frames 100 interval -> 33*0 33*1 33*2 33*3
  });
};
