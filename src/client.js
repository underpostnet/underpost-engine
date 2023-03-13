append(
  'body',
  /*html*/ `
    <style>
      @font-face {      
        font-family: 'retro-font';      
        src: URL('/fonts/PressStart2P.ttf') 
        format('truetype');     
      }
      body {
        background: black;
        color: white;
        padding: 0px;
        margin: 0px;
        cursor: url('/cursors/black-default.png') -30 -30, auto;
        font-family: 'retro-font';
      }
      canvas {
        margin: auto;
        display: block;
        position: relative;
      }
      .custom-cursor {
        cursor: url('/cursors/black-pointer.png') -30 -30, auto !important;
      }
      touch-layer {
        overflow: hidden;
      }
      gui-layer {
        background: rgba(0,0,0,0.5);
      }

      main-menu {
        background: black; 
        border: 4px solid yellow;
        width: 300px;
        height: 80px;
        padding: 5px;
        text-align: right;
      }
      menu-button {
        width: 60px;
        height: 40px;
        background: black; 
        font-size: 8px;  
        border: 4px solid yellow;
        color: yellow;
      }
      menu-button:hover {
        border: 4px solid white;
        color: white;
      }

      loader {
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        background: black;
      }

      .close-menu, .open-menu, .close-gui {
        border: 4px solid yellow; 
        width: 40px;
        height: 40px;
        background: black;
      }

      .close-gui {
        top: 10px;
        right: 10px;
        left: auto;
      }

      .hover-button:hover {
        border: 4px solid white; 
      }

      .icons-menu {
        width: 20px;
        height: 20px;
      }


    </style>
    <style class='canvas-dim'></style>

    <pixi-container class='in'></pixi-container>

    <touch-layer class='abs custom-cursor'>
      <loader class='abs'>
        <div class='abs center'>
            ${renderLang({ es: 'cargando...', en: 'loading...' })}
        </div>
      </loader>
    </touch-layer>

    <gui-layer class='abs' style='display: none'>

      <div class='abs close-gui custom-cursor hover-button'>
          <div class='abs center'>
              <img class='inl icons-menu' src='/icons/200x200/cross.gif'>
          </div>
      </div>

    </gui-layer>
    
    <div class='abs open-menu custom-cursor hover-button' style='display: none'>
        <div class='abs center'>
            <img class='inl icons-menu' src='/icons/200x200/menu-boxs.png'>
        </div>
    </div>

    <main-menu class='abs'>

      <div class='abs close-menu custom-cursor hover-button'>
          <div class='abs center'>
              <img class='inl icons-menu' src='/icons/200x200/cross.gif'>
          </div>
      </div>

      <menu-button class='inl custom-cursor'>
        <div class='abs center'>
          ${renderLang({ es: 'Ingresar', en: 'Login' })}
        </div>
      </menu-button>
      <menu-button class='inl custom-cursor btn-create-account'>
        <div class='abs center'>
          ${renderLang({ es: 'Crear cuenta', en: 'Create Account' })}
        </div>
      </menu-button>

    </main-menu>
 

`
);

s('.close-menu').onclick = () => {
  s('main-menu').style.display = 'none';
  s('.open-menu').style.display = 'block';
};
s('.open-menu').onclick = () => {
  s('.open-menu').style.display = 'none';
  s('.close-gui').click();
  s('main-menu').style.display = 'block';
};

s('.btn-create-account').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
};

s('.close-gui').onclick = () => {
  s('gui-layer').style.display = 'none';
};

const amplitudeRender = 50;
const elements = {};
const pixi = {};
const params = {};
const hashIntervals = {};
let changeMapsPoints = [];

Object.keys(typeModels()).map((type) => ((elements[type] = []), (pixi[type] = {}), (params[type] = {})));

const app = new PIXI.Application({
  width: maxRangeMap() * amplitudeRender,
  height: maxRangeMap() * amplitudeRender,
  background: 'gray',
});

const setAmplitudeRender = (render) => {
  if (!render) return;
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

const renderIndicatorLife = (container, element, dim, type) => {
  pixi[type][element.id].lifeIndicator = new PIXI.Text(
    `${element.life}/${element.maxLife}`,
    new PIXI.TextStyle({
      dropShadow: true,
      dropShadowAngle: 6.8,
      dropShadowBlur: 3,
      dropShadowDistance: 2,
      dropShadowColor: '#000000',
      fill: 'white',
      fontFamily: 'retro-font', // Impact
      fontSize: 8,
      align: 'center',
    })
  );
  // if (timeAttemp > 0) return;
  const lifeIndicator = pixi[type][element.id].lifeIndicator;
  if (pixi[type][element.id].containerLifeIndicator) pixi[type][element.id].containerLifeIndicator.destroy();
  pixi[type][element.id].containerLifeIndicator = new PIXI.Container();
  const containerLifeIndicator = pixi[type][element.id].containerLifeIndicator;
  containerLifeIndicator.x = 0;
  containerLifeIndicator.y = (-1 * dim) / 5;
  containerLifeIndicator.width = dim;
  containerLifeIndicator.height = dim / 5;
  containerLifeIndicator.addChild(lifeIndicator);

  container.addChild(containerLifeIndicator);
};

const renderIndicatorDiffLife = (container, element, dim, type) => {
  if (!params[type][element.id]) return;
  const diffLife = element.life - params[type][element.id].lastLife;
  if (diffLife === 0) return;
  pixi[type][element.id].diffLifeIndicator = new PIXI.Text(
    `${diffLife}`,
    new PIXI.TextStyle({
      // dropShadow: true,
      // dropShadowAngle: 6.8,
      // dropShadowBlur: 3,
      // dropShadowDistance: 2,
      // dropShadowColor: 'black',
      fill: diffLife < 0 ? '#FE2712' : '#7FFF00',
      fontFamily: 'retro-font', // Impact
      fontSize: 12,
      align: 'center',
    })
  );

  const diffLifeIndicator = pixi[type][element.id].diffLifeIndicator;

  pixi[type][element.id].diffTextBackground = new PIXI.Sprite(PIXI.Texture.WHITE);
  const diffTextBackground = pixi[type][element.id].diffTextBackground;
  const padding = 8;
  diffTextBackground.x = (-1 * dim) / padding;
  diffTextBackground.y = (-1 * dim) / padding;
  diffTextBackground.width = (dim / 3) * `${diffLife}`.length + dim / padding;
  diffTextBackground.height = dim / 3 + dim / padding;
  diffTextBackground.tint = numberColors['black'];

  pixi[type][element.id].containerDiffLifeIndicator = new PIXI.Container();
  const containerDiffLifeIndicator = pixi[type][element.id].containerDiffLifeIndicator;
  containerDiffLifeIndicator.x = random(-1 * parseInt(dim * 0.2), 1 * parseInt(dim * 1.2));
  containerDiffLifeIndicator.y = random(-1 * parseInt(dim * 0.2), 1 * parseInt(dim * 1.2));
  containerDiffLifeIndicator.width = dim;
  containerDiffLifeIndicator.height = dim / 5;
  containerDiffLifeIndicator.addChild(diffTextBackground);
  containerDiffLifeIndicator.addChild(diffLifeIndicator);

  container.addChild(containerDiffLifeIndicator);
  setTimeout(() => {
    if (containerDiffLifeIndicator) containerDiffLifeIndicator.visible = false;
  }, params[type][element.id].intervalDiffLifeDisplay * 0.8);
};

const renderPixiInitElement = (element) => {
  // https://pixijs.io/examples
  // https://pixijs.download/release/docs/index.html
  // https://pixijs.io/pixi-text-style/

  // console.log('renderPixiInitElement', element);
  const { type, id } = element;
  if (!element.render) return;
  const { x, y, dim } = setAmplitudeRender(element.render);
  const color = numberColors[element.color];

  pixi[type][element.id] = {};

  params[type][element.id] = {
    direction: 'South',
    directionCheckTimeInterval: 500,
    directionChangeActive: true,
    spriteFrameInterval: 100,
    spriteIdStop: null,
    shootActive: true,
    mapChangeActive: true,
    mapChangeTimeBlock: 500,
  };
  if (!hashIntervals[element.id]) hashIntervals[element.id] = {};

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

  if (typeModels()[type].components().includes('sprites') && element.sprite) {
    spriteDirs.map((spriteDir) => {
      range(0, parseInt(spriteDir[0])).map((spriteFrame) => {
        const src = `/sprites/${element.sprite}/${spriteDir}/${spriteFrame}.png`;
        pixi[type][element.id][src] = PIXI.Sprite.from(src);
        pixi[type][element.id][src].x = 0;
        pixi[type][element.id][src].y = 0;
        pixi[type][element.id][src].width = dim;
        pixi[type][element.id][src].height = dim;
        pixi[type][element.id][src].visible = spriteDir === '08' && element.life > 0;
        container.addChild(pixi[type][element.id][src]);
      });
    });
    const src = `/sprites/ghost/08/0.png`;
    pixi[type][element.id][src] = PIXI.Sprite.from(src);
    pixi[type][element.id][src].x = (dim - dim * 0.6) * 0.5;
    pixi[type][element.id][src].y = 0;
    pixi[type][element.id][src].width = dim * 0.6;
    pixi[type][element.id][src].height = dim;
    pixi[type][element.id][src].visible = element.life <= 0;
    container.addChild(pixi[type][element.id][src]);
  }

  if (typeModels()[type].components().includes('blood')) {
    const maxFrames = 2;
    range(0, maxFrames).map((frame) => {
      const src = `/sprites/blood/08/${frame}.png`;
      const dimFactor = 1;
      pixi[type][element.id][src] = PIXI.Sprite.from(src);
      pixi[type][element.id][src].x = (dim - dim * dimFactor) / 2;
      pixi[type][element.id][src].y = (dim - dim * dimFactor) / 2;
      pixi[type][element.id][src].width = dim * dimFactor;
      pixi[type][element.id][src].height = dim * dimFactor;
      pixi[type][element.id][src].visible = false;
      container.addChild(pixi[type][element.id][src]);
    });
  }

  if (typeModels()[type].components().includes('bar-life')) {
    pixi[type][element.id].barLife = new PIXI.Sprite(PIXI.Texture.WHITE);
    const barLife = pixi[type][element.id].barLife;
    barLife.x = 0;
    barLife.y = 0;
    barLife.width = dim * (element.life / element.maxLife);
    barLife.height = dim / 5;
    barLife.tint = numberColors['green-yellow'];
    container.addChild(barLife);
  }

  if (typeModels()[type].components().includes('life-indicator')) {
    range(0, 10).map((timeAttemp) =>
      setTimeout(() => {
        if (!pixi[type][element.id]) return;
        renderIndicatorLife(container, element, dim, type);
      }, timeAttemp * 100)
    );
  }

  if (typeModels()[type].components().includes('id')) {
    if (socket.id === element.id) {
      const src = `/icons/200x200/yellow-down-arrow.png`;
      const dimFactor = 0.65;
      const posFactorA = typeModels()[type].components().includes('life-indicator') ? 0.9 : 0.7;
      const posFactorB = typeModels()[type].components().includes('life-indicator') ? 1 : 0.8;
      let currentHfactor = posFactorA;
      pixi[type][element.id][src] = PIXI.Sprite.from(src);
      pixi[type][element.id][src].x = (dim - dim * dimFactor) / 2;
      pixi[type][element.id][src].y = -1 * dim * currentHfactor;
      pixi[type][element.id][src].width = dim * dimFactor;
      pixi[type][element.id][src].height = dim * dimFactor * 0.7;
      pixi[type][element.id][src].visible = true;
      container.addChild(pixi[type][element.id][src]);

      if (hashIntervals[element.id][`blink-green-down-arrow`])
        clearInterval(hashIntervals[element.id][`blink-green-down-arrow`]);
      hashIntervals[element.id][`blink-green-down-arrow`] = setInterval(() => {
        if (!params[type][element.id] || !pixi[type][element.id][src]) return;
        currentHfactor === posFactorA ? (currentHfactor = posFactorB) : (currentHfactor = posFactorA);
        pixi[type][element.id][src].y = -1 * dim * currentHfactor;
      }, 250);
    }

    if (typeModels()[type].components().includes('life-indicator') && element.life) {
      params[type][element.id].lastLife = newInstance(element.life);
      params[type][element.id].intervalDiffLifeDisplay = 500;
      if (hashIntervals[element.id][`diff-life-indicator`])
        clearInterval(hashIntervals[element.id][`diff-life-indicator`]);
      hashIntervals[element.id][`diff-life-indicator`] = setInterval(() => {
        if (!params[type][element.id] || params[type][element.id].lastLife === undefined) return;
        renderIndicatorDiffLife(container, element, dim, type);
        params[type][element.id].lastLife = newInstance(element.life);
      }, params[type][element.id].intervalDiffLifeDisplay);
    }

    range(0, 10).map((timeAttemp) =>
      setTimeout(() => {
        if (!pixi[type][element.id]) return;
        pixi[type][element.id].nick = new PIXI.Text(
          id.slice(0, 5).toUpperCase(),
          new PIXI.TextStyle({
            dropShadow: true,
            dropShadowAngle: 6.8,
            dropShadowBlur: 3,
            dropShadowDistance: 2,
            dropShadowColor: '#000000',
            fill: 'white',
            fontFamily: 'retro-font', // Impact
            fontSize: 10,
            align: 'center',
          })
        );
        // if (timeAttemp > 0) return;
        const nick = pixi[type][element.id].nick;

        pixi[type][element.id].containerText = new PIXI.Container();
        const containerText = pixi[type][element.id].containerText;
        containerText.x = 0;
        containerText.y = (-1 * dim) / (typeModels()[type].components().includes('life-indicator') ? 2 : 5);
        containerText.width = dim;
        containerText.height = dim / 5;
        containerText.addChild(nick);

        container.addChild(containerText);
      }, timeAttemp * 100)
    );
  }

  if (typeModels()[type].components().includes('arrow-map')) {
    const dataMapArrow = changeMapsPoints.find(
      (mapData) => mapData.fromX === element.render.x && mapData.fromY === element.render.y
    );
    if (dataMapArrow) {
      const src = `/icons/200x200/arrow-${dataMapArrow.arrow}.png`;
      let dimFactor = 0.7;
      pixi[type][element.id][src] = PIXI.Sprite.from(src);
      pixi[type][element.id][src].x = (dim - dim * dimFactor) / 2;
      pixi[type][element.id][src].y = (dim - dim * dimFactor) / 2;
      pixi[type][element.id][src].width = dim * dimFactor;
      pixi[type][element.id][src].height = dim * dimFactor;
      pixi[type][element.id][src].visible = true;
      container.addChild(pixi[type][element.id][src]);
      if (hashIntervals[element.id][`blink-arrow-${dataMapArrow.arrow}`])
        clearInterval(hashIntervals[element.id][`blink-arrow-${dataMapArrow.arrow}`]);
      hashIntervals[element.id][`blink-arrow-${dataMapArrow.arrow}`] = setInterval(() => {
        if (!params[type][element.id] || !pixi[type][element.id][src]) return;
        dimFactor === 0.7 ? (dimFactor = 0.6) : (dimFactor = 0.7);
        pixi[type][element.id][src].x = (dim - dim * dimFactor) / 2;
        pixi[type][element.id][src].y = (dim - dim * dimFactor) / 2;
        pixi[type][element.id][src].width = dim * dimFactor;
        pixi[type][element.id][src].height = dim * dimFactor;
      }, 250);
    }
  }

  if (typeModels()[type].components().includes('event-pointer-cross')) {
    const src = `/icons/200x200/cross.gif`;
    const dimFactor = 0.8;
    pixi[type][element.id][src] = PIXI.Sprite.from(src);
    pixi[type][element.id][src].x = (dim - dim * dimFactor) / 2;
    pixi[type][element.id][src].y = (dim - dim * dimFactor) / 2;
    pixi[type][element.id][src].width = dim * dimFactor;
    pixi[type][element.id][src].height = dim * dimFactor;
    pixi[type][element.id][src].visible = true;
    container.addChild(pixi[type][element.id][src]);
    setTimeout(() => {
      removePixiElement(element);
      elements[type].splice(
        elements[type].findIndex((element) => element.id === id),
        1
      );
    }, 1000);
  }

  if (typeModels()[type].components().includes('red-power')) {
    const maxFrames = 2;
    let currentFrame = 0;
    range(0, maxFrames).map((frame) => {
      const src = `/sprites/red-power/08/${frame}.png`;
      const dimFactor = 0.35;
      pixi[type][element.id][src] = PIXI.Sprite.from(src);
      pixi[type][element.id][src].x = (dim - dim * dimFactor) / 2;
      pixi[type][element.id][src].y = ((dim - dim * dimFactor) / 2) * 1.7;
      pixi[type][element.id][src].width = dim * dimFactor;
      pixi[type][element.id][src].height = dim * dimFactor;
      pixi[type][element.id][src].visible = frame === currentFrame;
      container.addChild(pixi[type][element.id][src]);
    });
    if (hashIntervals[element.id][`interval-red-power`]) clearInterval(hashIntervals[element.id][`interval-red-power`]);
    hashIntervals[element.id][`interval-red-power`] = setInterval(function () {
      if (!params[type][element.id] || !pixi[type][element.id][`/sprites/red-power/08/${currentFrame}.png`]) return;
      pixi[type][element.id][`/sprites/red-power/08/${currentFrame}.png`].visible = false;
      currentFrame++;
      if (currentFrame > maxFrames) currentFrame = 0;
      if (!params[type][element.id] || !pixi[type][element.id][`/sprites/red-power/08/${currentFrame}.png`]) return;
      pixi[type][element.id][`/sprites/red-power/08/${currentFrame}.png`].visible = true;
    }, 50);
  }

  //  = new PIXI.Graphics();
  // .clear();

  // .beginFill(randomNumberColor());
  // .lineStyle(0);
  // .drawCircle(0, 0, 1.5 * pixiAmplitudeFactor); // x,y,radio

  // .rotation = -(Math.PI / 2);
  // .pivot.x = .width / 2;
  // .pivot.y = .width / 2;

  // .beginFill(numberColors['black'], 1);
  // .lineStyle(0, randomNumberColor(), 1);

  // .moveTo(0, 0);
  // .lineTo(0, 0);
  // .lineTo(0, 0);

  // .endFill();

  return element;
};

const clearFramesSprites = (element) => {
  const { type } = element;
  spriteDirs.map((spriteDir) => {
    range(0, parseInt(spriteDir[0])).map((spriteFrame) => {
      const src = `/sprites/${element.sprite}/${spriteDir}/${spriteFrame}.png`;
      if (!pixi[type][element.id] || !pixi[type][element.id][src]) return;
      pixi[type][element.id][src].visible = false;
    });
  });
};

validateSpritesFrames = (element) => {
  const { type } = element;
  for (const spriteDir of spriteDirs) {
    for (const spriteFrame of range(0, parseInt(spriteDir[0]))) {
      const src = `/sprites/${element.sprite}/${spriteDir}/${spriteFrame}.png`;
      if (!pixi[type][element.id] || !pixi[type][element.id][src]) return false;
    }
  }
  return true;
};

const resetsElements = () => {
  Object.keys(elements).map((type) => {
    elements[type].map((element) => removePixiElement(element));
    elements[type] = [];
  });
};

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
    pixi[type][element.id].barLife.width = newLife;
  }

  if (direction !== undefined) params[type][element.id].direction = direction;
  if (typeModels()[type].components().includes('life-indicator')) renderIndicatorLife(container, element, dim, type); // .text = 'new text';
  // change position animation
  const frames = 6;
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
        container.x = x;
        container.y = y;
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
          s('loader').style.display = 'block';
          params[type][id].mapChangeActive = false;
          const eventElement = newInstance(element);
          eventElement.render.x = newMapObj.toX;
          eventElement.render.y = newMapObj.toY;
          eventElement.map = newMapObj.toMap;
          resetsElements();
          socket.emit('close');
          socket.emit('init', JSON.stringify(eventElement));
        }
      }
    }, frameTime * (updateTimeInterval / (frames - 1))); // 4 frames 100 interval -> 33*0 33*1 33*2 33*3
  });
};
const removePixiElement = (element) => {
  if (!element.type || !element.id || !pixi[element.type][element.id]) return;
  const { type } = element;
  Object.keys(pixi[type][element.id]).map((pixiKey) => pixi[type][element.id][pixiKey].destroy());
  delete params[type][element.id];
  delete pixi[type][element.id];
};

const socket = io(ioWsServerHost);

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
  resetsElements();
});

let userPositionAvailablePoints = [];
let userMatrixCollision = [];

socket.on('update', (...args) => {
  // console.log(`socket.io event: update | reason: ${args}`);
  const eventElement = JSON.parse(args);
  const { id, type } = eventElement;
  const elementIndex = elements[type].findIndex((element) => element.id === id);
  if (eventElement.lifeTime)
    setTimeout(() => {
      removePixiElement(eventElement);
      if (elements[type].findIndex((element) => element.id === id) > -1)
        elements[type].splice(
          elements[type].findIndex((element) => element.id === id),
          1
        );
    }, eventElement.lifeTime);
  if (elementIndex > -1) {
    elements[type][elementIndex] = merge(elements[type][elementIndex], eventElement);
    return renderPixiEventElement(elements[type][elementIndex]);
  }
  if (eventElement.id === socket.id && eventElement.map) {
    userPositionAvailablePoints = getAvailablePoints('user', ['building'], eventElement.map);
    userMatrixCollision = getMatrixCollision('user', ['building'], eventElement.map);
    console.log('userMatrixCollision', JSONmatrix(userMatrixCollision));
    setURI('/' + eventElement.map);
    htmls('title', renderInstanceTitle({ name_map: eventElement.map }));
  }
  if (eventElement.map && eventElement.render && eventElement.id && eventElement.type) {
    elements[type].push(eventElement);
    renderPixiInitElement(eventElement);
  }
});

socket.on('init-data', (...args) => {
  const initData = JSON.parse(args);
  console.log('initData', initData);
  changeMapsPoints = initData.changeMapsPoints;
  changeMapsPoints.map((mapData) => {
    (() => {
      const type = 'to-map';
      const { color, render } = getParamsType(type);
      const { dim } = render;
      const map = mapData.fromMap;
      const toMapElement = {
        id: id(),
        type,
        color,
        map,
        render: {
          x: mapData.fromX,
          y: mapData.fromY,
          dim,
        },
      };
      elements[type].push(toMapElement);
      renderPixiInitElement(toMapElement);
    })();
  });
  s('loader').style.display = 'none';
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
let lastScreenDimMin;
let lastScreenDimMax;
setInterval(() => {
  const screenDim = dimState();
  if (lastScreenDimMin !== screenDim.minValue || lastScreenDimMax !== screenDim.maxValue) {
    lastScreenDimMin = newInstance(screenDim.minValue);
    lastScreenDimMax = newInstance(screenDim.maxValue);
    htmls(
      '.canvas-dim',
      /*css*/ `
      canvas {
        width: ${screenDim.minValue}px;
        height: ${screenDim.minValue}px;
        top: ${screenDim.maxType === 'height' ? (screenDim.maxValue - screenDim.minValue) / 2 : 0}px;
      }
      touch-layer {
        width: ${screenDim.minValue}px;
        height: ${screenDim.minValue}px;
        top: ${screenDim.maxType === 'height' ? (screenDim.maxValue - screenDim.minValue) / 2 : 0}px;
        left: ${screenDim.maxType === 'height' ? 0 : (screenDim.maxValue - screenDim.minValue) / 2}px;
      }
      gui-layer {
        width: ${screenDim.minValue}px;
        height: 100%;
        top: 0px;
        left: ${screenDim.maxType === 'height' ? 0 : (screenDim.maxValue - screenDim.minValue) / 2}px;
      }
      main-menu, .open-menu {
        top: 10px;
        left: ${screenDim.maxType === 'height' ? 0 : (screenDim.maxValue - screenDim.minValue) / 2 + 10}px;
      }
    `
    );
  }
}, updateTimeInterval);

const attack = (element) => {
  if (element.life > 0 && params[element.type][element.id].shootActive === true) {
    params[element.type][element.id].shootActive = false;

    socket.emit(
      'event',
      JSON.stringify({
        event: 'attack',
        element: {
          render: {
            x: element.render.x,
            y: element.render.y,
          },
        },
        direction: params[element.type][element.id].direction,
      })
    );

    setTimeout(() => {
      if (!params[element.type][element.id]) return;
      params[element.type][element.id].shootActive = true;
    }, 500);
  }
};

window.pathfinding = PF;
const finder = new pathfinding.AStarFinder({
  allowDiagonal, // enable diagonal
  dontCrossCorners, // corner of a solid
  heuristic: pathfinding.Heuristic.chebyshev,
});

let currenTimeAttack = 0;
s('touch-layer').onclick = (e, subPath) => {
  // console.log('onClickCanvas', e, subPath);
  let x2 = subPath === undefined ? parseInt(maxRangeMap() * (e.offsetX / dimState().minValue)) : e.offsetX;
  let y2 = subPath === undefined ? parseInt(maxRangeMap() * (e.offsetY / dimState().minValue)) : e.offsetY;

  if (subPath === undefined)
    (() => {
      const type = 'pointer';
      const { color, render } = getParamsType(type);
      const { dim } = render;
      const crossElement = {
        id: id(),
        type,
        color,
        render: {
          x: x2,
          y: y2,
          dim,
        },
      };
      elements[type].push(crossElement);
      renderPixiInitElement(crossElement);
    })();

  const element = elements.user.find((element) => element.id === socket.id);
  if (element) {
    if (subPath === undefined) {
      const newTimeAttack = +new Date();
      let validateAttack = false;
      if (newTimeAttack - currenTimeAttack <= 500) {
        validateAttack = true;
        element.direction = getDirection(element.render.x, element.render.y, x2, y2).direction;
        attack(element);
        renderPixiEventElement(element);
      }
      currenTimeAttack = newTimeAttack;
      console.log('validateAttack', validateAttack);
      if (validateAttack) return;
    }

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
        s('touch-layer').onclick(
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
    if (window.activeKey['Q'] || window.activeKey['q']) {
      attack(element);
    }
    if (update) {
      renderPixiEventElement(element);
      socket.emit('update', JSON.stringify(emitElement));
    }
    // if (location.pathname.replaceAll(`\\`, '').replaceAll('/', '') === 'undefined') {
    //   history.back();
    //   resetsElements();
    //   socket.emit('close');
    //   socket.emit('init', getURI());
    // }
  }
}, updateTimeInterval);
