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
        if (spriteDir === '08' && id === socket.id) s('.character-stats-img-avatar').src = src;
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

  if (socket.id === id) {
    renderStatsGrid(element);
    if (localStorage.getItem('_b')) {
      s('.session-account-input-email').value = element.email;
      s('.session-account-input-email').oninput();
    }
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

    if (
      typeModels()[type].components().includes('koyn-indicator') &&
      element.koyn !== undefined &&
      element.id === socket.id
    ) {
      params[type][element.id].lastKoyn = newInstance(element.koyn);
      params[type][element.id].intervalDiffKoynDisplay = 500;
      htmls('.bag-koyn-indicator', element.koyn);
      if (hashIntervals[element.id][`diff-koyn-indicator`])
        clearInterval(hashIntervals[element.id][`diff-koyn-indicator`]);
      hashIntervals[element.id][`diff-koyn-indicator`] = setInterval(() => {
        if (!params[type][element.id] || params[type][element.id].lastKoyn === undefined) return;
        if (element.koyn !== params[type][element.id].lastKoyn) {
          const msg = /*html*/ `
          ${renderLang({ en: 'Has obtained', es: 'Has obtenido' })}
          [ <span style='color: yellow; font-size: 15px'>+${
            element.koyn - params[type][element.id].lastKoyn
          }</span><img src='/icons/50x50/koyn.gif' class='inl icon-board-img'> ] koyns.
          `;
          renderEventBoard(/*html*/ { tag: 'KOYN', msg, history: true });
          htmls('.bag-koyn-indicator', element.koyn);
          params[type][element.id].lastKoyn = newInstance(element.koyn);
        }
      }, params[type][element.id].intervalDiffKoynDisplay);
    }

    range(0, 10).map((timeAttemp) =>
      setTimeout(() => {
        if (!pixi[type][element.id]) return;
        pixi[type][element.id].nick = new PIXI.Text(
          getDisplayName(element),
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

  if (element.id === socket.id) initMainUserJoy(element);

  if (element.displayItems)
    element.displayItems.map((item) => {
      let currentFrame = 0;
      range(0, item.frames).map((frame) => {
        const src = `/items/${item.id}/${frame}.gif`;
        pixi[type][element.id][src] = PIXI.Sprite.from(src);
        pixi[type][element.id][src].x = dim * item.renderFactor.x;
        pixi[type][element.id][src].y = dim * item.renderFactor.y;
        pixi[type][element.id][src].width = dim * item.renderFactor.width;
        pixi[type][element.id][src].height = dim * item.renderFactor.height;
        pixi[type][element.id][src].visible = frame === currentFrame;
        container.addChild(pixi[type][element.id][src]);
      });
      if (hashIntervals[element.id][item.id]) clearInterval(hashIntervals[element.id][item.id]);
      hashIntervals[element.id][item.id] = setInterval(function () {
        if (!params[type][element.id] || !pixi[type][element.id][`/items/${item.id}/${currentFrame}.gif`]) return;
        pixi[type][element.id][`/items/${item.id}/${currentFrame}.gif`].visible = false;
        currentFrame++;
        if (currentFrame > item.frames) currentFrame = 0;
        if (!params[type][element.id] || !pixi[type][element.id][`/items/${item.id}/${currentFrame}.gif`]) return;
        if (element.life > 0) pixi[type][element.id][`/items/${item.id}/${currentFrame}.gif`].visible = true;
      }, item.frameTimeInterval);
    });

  return element;
};
