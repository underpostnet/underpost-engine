const renderSpinner = () => /*html*/ `
        <div class='abs center loading-content' style='${borderChar(1, 'white')}'>
            ${renderLang({ es: 'cargando', en: 'loading' }).toUpperCase()}
            <br>
            <img src='/gifs/points-loading.gif' class='inl points-gif-loading'>
        </div>
`;

const renderCyberiaLogo = () => /*html*/ `
      <div class='abs center'>
                      
          <img class='inl cyberia-logo-open-menu' src='/icons/144x144/cyberia.png'> C Y B E R I A
          <br>
          <span class='online-cyberia-logo-text'>o n l i n e</span>        

      </div>
`;

const renderNotification = (status, message) => {
  const hash = 'notification-' + s4() + s4();
  append(
    'body',
    /*html*/ `
  <style class='style-${hash}'>
    .${hash} {
      width: 200px;
      height: 100px;
      background: rgba(0,0,0,0.8);
      color: ${status === 'success' ? 'green' : 'red'};
      ${borderChar(1, 'black')}
      border: 3px solid ${status === 'success' ? 'green' : 'red'};
    }
  </style>
  <div class='fix center ${hash}'>
      <div class='abs center'>
          <span style='font-size: 20px'>
            ${status === 'success' ? '&check;' : '&#215;'}
          </span>
          <br>
          <br>
          <span style='font-size: 10px'>
            ${message}
          </span>
      </div>
  </div>
  
  `
  );
  setTimeout(() => {
    s(`.${hash}`).remove();
    s(`.style-${hash}`).remove();
  }, 1500);
};

const getDateFormat = (date) => date.toISOString().replace('T', ' ').slice(0, -5); // -8

const renderDeadCount = (data) => {
  const hashRender = 'x' + s4();

  append(
    'dead-count',
    /*html*/ `
    <div class='fix center dead-content ${hashRender}'>
        <div class='abs center'>
            <img class='inl dead-icon' src='/icons/dead.png'>
              <br>
            <span class='dead-count' style='${borderChar(2, 'red')}'>${data.deadTime}</span>
        </div>
    </div>
  
  `
  );
  setTimeout(() => {
    s(`.${hashRender}`).remove();
  }, 1050);
};

const getDisplayName = (element) => (element.username ? element.username : element.id.slice(0, 5).toUpperCase());

const setAmplitudeRender = (render) => {
  if (!render) return;
  const returnRender = {};
  Object.keys(render).map((keyRender) => {
    returnRender[keyRender] = render[keyRender] * amplitudeRender;
  });
  return returnRender;
};
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
  let diffLife = element.life - params[type][element.id].lastLife;
  if (diffLife === 0) return;
  if (diffLife > 0) diffLife = '+' + diffLife;
  diffLife = diffLife + ' ♥';
  pixi[type][element.id].diffLifeIndicator = new PIXI.Text(
    `${diffLife}`,
    new PIXI.TextStyle({
      // dropShadow: true,
      // dropShadowAngle: 6.8,
      // dropShadowBlur: 3,
      // dropShadowDistance: 2,
      // dropShadowColor: 'black',
      fill: diffLife[0] !== '+' ? '#FE2712' : '#7FFF00',
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
  diffTextBackground.width = (dim / 4) * `${diffLife}`.length + dim / padding + 10;
  diffTextBackground.height = dim / 4 + dim / padding;
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

const newMainUserInstance = (element) => {
  s('.close-gui').click();
  s('loader').style.display = 'block';
  const initObj = {};
  if (element) {
    element.id = socket.id;
    params[element.type][element.id].mapChangeActive = false;
    initObj.element = element;
  } else {
    initObj.path = getURI();
  }
  resetsElements();
  socket.emit('close');
  socket.emit('init', JSON.stringify(initObj));
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

const validateSpritesFrames = (element) => {
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

const attack = (element) => {
  if (
    element.life > 0 &&
    params[element.type][element.id].shootActive === true &&
    !mapMetaData.types.includes('safe')
  ) {
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

    setTimeout(
      () => {
        if (!params[element.type][element.id]) return;
        params[element.type][element.id].shootActive = true;
      },
      element.velAttack !== undefined ? element.velAttack : 500
    );
  }
};

const instanceMapTypeStatus = () => {
  const titleMap = renderInstanceTitle({ name_map: mapMetaData.map }).split('|');
  htmls(
    'map-type-status',
    /*html*/ `
    <div class='fix map-type-status-content'>
          <div class='abs center'>
            <span style='font-size: 5px; color: white'>C Y B E R I A</span>
            <br><br>
            <span style='color: black; ${borderChar(1, 'yellow')}'>
              ${titleMap[0]}
            </span>
            <br><br>
            ${mapMetaData.types
              .map(
                (t, i) => /*html*/ `
                <span class='map-type-${t}'> 
                  ${t.toUpperCase()}
                </span>
                ${i !== mapMetaData.types.length - 1 ? `` : ''}
            `
              )
              .join('')}
              <br>
              zone
          </div>
    </div>
  `
  );
};

const initMainUserJoy = (userElement) => {
  if (hashIntervals[`key-attack`]) clearInterval(hashIntervals[`key-attack`]);
  hashIntervals[`key-attack`] = setInterval(() => {
    if (window.activeKey['Q'] || window.activeKey['q']) {
      const element = elements.user.find((element) => element.id === socket.id);
      if (element) attack(element);
    }
  }, 10);
  if (hashIntervals[`joy`]) clearInterval(hashIntervals[`joy`]);
  hashIntervals[`joy`] = setInterval(() => {
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
      // if (location.pathname.replaceAll(`\\`, '').replaceAll('/', '') === 'undefined') {
      //   history.back();
      //   resetsElements();
      //   socket.emit('close');
      //   socket.emit('init', getURI());
      // }
    }
  }, updateTimeInterval * (userElement.velFactor ? userElement.velFactor : 1));
};

const renderPixiSprite = (element, oldSpriteId) => {
  const { type } = element;
  const { dim } = setAmplitudeRender(element.render);
  const container = pixi[type][element.id].spriteContainer;
  if (oldSpriteId !== undefined) {
    spriteDirs.map((spriteDir) => {
      range(0, parseInt(spriteDir[0])).map((spriteFrame) => {
        const src = `/sprites/${oldSpriteId}/${spriteDir}/${spriteFrame}.png`;
        if (pixi[type][element.id][src]) {
          pixi[type][element.id][src].destroy();
          delete pixi[type][element.id][src];
        }
      });
    });
  }
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
  if (oldSpriteId === undefined) {
    const src = `/sprites/ghost/08/0.png`;
    pixi[type][element.id][src] = PIXI.Sprite.from(src);
    pixi[type][element.id][src].x = (dim - dim * 0.6) * 0.5;
    pixi[type][element.id][src].y = 0;
    pixi[type][element.id][src].width = dim * 0.6;
    pixi[type][element.id][src].height = dim;
    pixi[type][element.id][src].visible = element.life <= 0;
    container.addChild(pixi[type][element.id][src]);
  }
};
