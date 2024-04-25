import { s, append, getProxyPath } from '../core/VanillaJs.js';
import { getId, newInstance, range, round10, timer } from '../core/CommonJs.js';
import { Responsive } from '../core/Responsive.js';

import { Matrix } from './Matrix.js';
import { Elements } from './Elements.js';

import { Application, BaseTexture, Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { WorldManagement } from './World.js';
import { SocketIo } from '../core/SocketIo.js';
import { CharacterSlotType, CyberiaParams } from './CommonCyberia.js';
import { MainUser } from './MainUser.js';
import { BiomeScope } from './Biome.js';

const Pixi = {
  MetaData: {
    dim: 7 * 16 * 3 * 10,
  },
  Data: {},
  Init: function () {
    Object.keys(Elements.Data).map((type) => (this.Data[type] = {}));
    append(
      'body',
      html`
        <style>
          .pixi-container,
          .pixi-container-top-level {
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            /* overflow: hidden; */
          }
          .pixi-container-top-level {
            transition: 0.4s;
          }
          .adjacent-map {
            /* border: 2px solid #ff0000; */
          }
          .adjacent-map-background {
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            z-index: 1;
          }
        </style>
        <div class="fix pixi-container">
          <div class="abs adjacent-map adjacent-map-limit-top">
            <div class="abs adjacent-map-background adjacent-map-background-top"></div>
          </div>
          <div class="abs adjacent-map adjacent-map-limit-bottom">
            <div class="abs adjacent-map-background adjacent-map-background-bottom"></div>
          </div>
          <div class="abs adjacent-map adjacent-map-limit-left">
            <div class="abs adjacent-map-background adjacent-map-background-left"></div>
          </div>
          <div class="abs adjacent-map adjacent-map-limit-right">
            <div class="abs adjacent-map-background adjacent-map-background-right"></div>
          </div>

          <div class="abs adjacent-map adjacent-map-limit-top-left"></div>
          <div class="abs adjacent-map adjacent-map-limit-top-right"></div>
          <div class="abs adjacent-map adjacent-map-limit-bottom-left"></div>
          <div class="abs adjacent-map adjacent-map-limit-bottom-right"></div>
        </div>
        <div class="fix pixi-container-top-level" style="opacity: 1"></div>
      `,
    );
    this.App = new Application({
      width: this.MetaData.dim,
      height: this.MetaData.dim,
      background: '#c7c7c7',
    });
    this.App.view.classList.add('abs');
    this.App.view.classList.add('pixi-canvas');
    s('.pixi-container').appendChild(this.App.view);

    this.AppTopLevelColor = new Application({
      width: this.MetaData.dim,
      height: this.MetaData.dim,
      background: undefined,
      backgroundAlpha: 0,
    });
    this.AppTopLevelColor.view.classList.add('abs');
    this.AppTopLevelColor.view.classList.add('pixi-canvas-top-level');

    s('.pixi-container-top-level').appendChild(this.AppTopLevelColor.view);
    s('.pixi-container-top-level').style.zIndex = '2';

    (() => {
      return;
      // top level render test
      const componentInstance = new Sprite(Texture.WHITE);
      componentInstance.x = 100;
      componentInstance.y = 100;
      componentInstance.width = this.MetaData.dim * 0.1;
      componentInstance.height = this.MetaData.dim * 0.1;
      componentInstance.tint = '#ff0000';
      componentInstance.visible = true;
      this.AppTopLevelColor.stage.addChild(componentInstance);
    })();

    // Matrix.Render['matrix-center-square']('.pixi-container');

    Responsive.Event['pixi-container'] = () => {
      const ResponsiveDataAmplitude = Responsive.getResponsiveDataAmplitude({ dimAmplitude: Matrix.Data.dimAmplitude });
      const ResponsiveData = Responsive.getResponsiveData();
      s('.pixi-canvas').style.width = `${ResponsiveDataAmplitude.minValue}px`;
      s('.pixi-canvas').style.height = `${ResponsiveDataAmplitude.minValue}px`;
      s('.pixi-canvas-top-level').style.width = `${ResponsiveDataAmplitude.minValue}px`;
      s('.pixi-canvas-top-level').style.height = `${ResponsiveDataAmplitude.minValue}px`;

      for (const limitType of [
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ]) {
        s(`.adjacent-map-limit-${limitType}`).style.height = `${ResponsiveDataAmplitude.minValue}px`;
        s(`.adjacent-map-limit-${limitType}`).style.width = `${ResponsiveDataAmplitude.minValue}px`;
      }

      s('.main-user-container').style.width = `${ResponsiveData.minValue}px`;
      s('.main-user-container').style.height = `${ResponsiveData.minValue}px`;
      // const ResponsiveData = Responsive.getResponsiveData();
      // s('.pixi-container').style.height = `${ResponsiveData.height}px`;
      // s('.pixi-container').style.width = `${ResponsiveData.width}px`;
    };

    // biome containers
    this.Data.biome['seed-city'] = new Container();
    this.Data.biome['seed-city'].width = this.MetaData.dim;
    this.Data.biome['seed-city'].height = this.MetaData.dim;
    this.Data.biome['seed-city'].x = 0;
    this.Data.biome['seed-city'].y = 0;
    this.App.stage.addChild(this.Data.biome['seed-city']);

    this.Data.biome.floorContainer = new Container();
    this.Data.biome.floorContainer.width = this.MetaData.dim;
    this.Data.biome.floorContainer.height = this.MetaData.dim;
    this.Data.biome.floorContainer.x = 0;
    this.Data.biome.floorContainer.y = 0;
    this.App.stage.addChild(this.Data.biome.floorContainer);

    // channels container

    for (const channelType of Object.keys(Elements.Data)) {
      this.Data[channelType].container = new Container();
      this.Data[channelType].container.width = this.MetaData.dim;
      this.Data[channelType].container.height = this.MetaData.dim;
      this.Data[channelType].container.x = 0;
      this.Data[channelType].container.y = 0;
      this.App.stage.addChild(this.Data[channelType].container);
    }
  },
  currentBiomeContainer: String,
  clearBiomeContainers: function () {
    this.Data.biome.container.removeChildren();
    this.Data.biome['seed-city'].removeChildren();
    this.Data.biome.floorContainer.removeChildren();
  },
  setFloor: function (blobUrl) {
    this.clearBiomeContainers();

    this.currentBiomeContainer = 'floorContainer';
    this.Data.biome.floor = Sprite.from(new BaseTexture(blobUrl));
    this.Data.biome.floor.width = this.MetaData.dim;
    this.Data.biome.floor.height = this.MetaData.dim;
    this.Data.biome.floor.x = 0;
    this.Data.biome.floor.y = 0;
    this.Data.biome[this.currentBiomeContainer].addChild(this.Data.biome.floor);
  },
  setFloorTopLevelColor: function (blobUrl) {
    this.AppTopLevelColor.stage.removeChildren();
    const componentInstance = Sprite.from(new BaseTexture(blobUrl));
    componentInstance.width = this.MetaData.dim;
    componentInstance.height = this.MetaData.dim;
    componentInstance.x = 0;
    componentInstance.y = 0;
    this.AppTopLevelColor.stage.addChild(componentInstance);
  },
  setBiome: function (BiomeMatrix) {
    this.clearBiomeContainers();
    if (BiomeMatrix) {
      this.currentBiomeContainer = BiomeMatrix?.container ? BiomeMatrix.container : 'container';

      if (BiomeMatrix.setBiome) {
        for (const cellData of BiomeMatrix.setBiome) {
          const { src, dim, x, y } = cellData;
          this.Data.biome[src] = Sprite.from(src);
          this.Data.biome[src].width = dim;
          this.Data.biome[src].height = dim;
          this.Data.biome[src].x = x * dim;
          this.Data.biome[src].y = y * dim;
          this.Data.biome[this.currentBiomeContainer].addChild(this.Data.biome[src]);
        }
        return;
      }

      const paintDim = Matrix.Data.dim * Matrix.Data.dimPaintByCell;
      const dim = this.MetaData.dim / paintDim;
      range(0, paintDim - 1).map((y) =>
        range(0, paintDim - 1).map((x) => {
          const id = `biome-cell-${x}-${y}`;
          this.Data.biome[id] = new Sprite(Texture.WHITE);
          this.Data.biome[id].x = dim * x;
          this.Data.biome[id].y = dim * y;
          this.Data.biome[id].width = dim;
          this.Data.biome[id].height = dim;
          this.Data.biome[id].tint = BiomeMatrix.color[y][x];
          this.Data.biome[this.currentBiomeContainer].addChild(this.Data.biome[id]);
        }),
      );
    }
  },
  setComponents: function (options = { type: 'user', id: 'main' }) {
    const { type, id } = options;
    let dim = this.MetaData.dim / Matrix.Data.dim;
    if (type === 'user' && id === 'main') dim = dim * Matrix.Data.dimAmplitude;
    if (this.Data[type][id]) this.removeElement({ type, id });
    this.Data[type][id] = new Container();
    this.Data[type][id].width = dim * Elements.Data[type][id].dim;
    this.Data[type][id].height = dim * Elements.Data[type][id].dim;
    this.Data[type][id].x = dim * Elements.Data[type][id].x;
    this.Data[type][id].y = dim * Elements.Data[type][id].y;
    this.Data[type][id].components = {
      'layer-1': { container: new Container() },
      layer0: { container: new Container() },
    };

    this.Data[type][id].components['layer-1'].container.width = dim * Elements.Data[type][id].dim;
    this.Data[type][id].components['layer-1'].container.height = dim * Elements.Data[type][id].dim;
    this.Data[type][id].components['layer-1'].container.x = 0;
    this.Data[type][id].components['layer-1'].container.y = 0;
    this.Data[type][id].addChild(this.Data[type][id].components['layer-1'].container);

    this.Data[type][id].components.layer0.container.width = dim * Elements.Data[type][id].dim;
    this.Data[type][id].components.layer0.container.height = dim * Elements.Data[type][id].dim;
    this.Data[type][id].components.layer0.container.x = 0;
    this.Data[type][id].components.layer0.container.y = 0;
    this.Data[type][id].addChild(this.Data[type][id].components.layer0.container);

    this.Data[type][id].intervals = {};
    let index;
    if (type === 'user' && id === 'main') {
      this.Data[type][id].x = this.MetaData.dim / 2 - dim * Elements.Data[type][id].x * 0.5;
      this.Data[type][id].y = this.MetaData.dim / 2 - dim * Elements.Data[type][id].y * 0.5;
      MainUser.PixiMainUser.stage.addChild(this.Data[type][id]);
      MainUser.renderPixiMainUserBackground();
    } else this.Data[type].container.addChild(this.Data[type][id]);
    for (const componentType of Object.keys(Elements.Data[type][id].components)) {
      if (!this.Data[type][id].components[componentType]) this.Data[type][id].components[componentType] = {};
      switch (componentType) {
        case 'background':
          index = 0;
          for (const component of Elements.Data[type][id].components[componentType]) {
            const { enabled } = component;
            if (!enabled) {
              index++;
              continue;
            }
            const { tint, visible } = component.pixi;
            const componentInstance = new Sprite(Texture.WHITE);
            componentInstance.x = 0;
            componentInstance.y = 0;
            componentInstance.width = dim * Elements.Data[type][id].dim;
            componentInstance.height = dim * Elements.Data[type][id].dim;
            componentInstance.tint = tint;
            componentInstance.visible = visible;
            this.Data[type][id].components[componentType][`${index}`] = componentInstance;
            this.Data[type][id].addChild(componentInstance);
            index++;
          }

          break;

        case 'lifeBar':
          const componentInstance = new Sprite(Texture.WHITE);
          componentInstance.x = 0;
          componentInstance.y = -1 * dim * Elements.Data[type][id].dim * 0.2;

          // maxLife -> 100%
          // life -> x%

          componentInstance.height = dim * Elements.Data[type][id].dim * 0.2;
          componentInstance.tint = '#00e622ff';
          componentInstance.visible = true;
          this.Data[type][id].components[componentType] = componentInstance;
          this.updateLifeBarWidth({ type, id, dim });
          this.Data[type][id].addChild(componentInstance);

          break;

        case 'coinIndicator':
          {
            const componentInstance = new Container();
            componentInstance.x = 0;
            componentInstance.y = -1 * dim * Elements.Data[type][id].dim * 0.8;
            componentInstance.width = dim * Elements.Data[type][id].dim;
            componentInstance.height = dim * Elements.Data[type][id].dim * 0.4;
            this.Data[type][id].components[componentType].container = componentInstance;
            this.Data[type][id].addChild(componentInstance);
          }
          {
            const componentInstance = new Sprite(); // Texture.WHITE
            componentInstance.x = 0;
            componentInstance.y = 0;
            componentInstance.width = dim * Elements.Data[type][id].dim;
            componentInstance.height = dim * Elements.Data[type][id].dim * 0.4;
            // componentInstance.tint = '#000000ff';
            componentInstance.visible = true;
            this.Data[type][id].components[componentType].background = componentInstance;
            this.Data[type][id].components[componentType].container.addChild(componentInstance);
          }
          {
            let lastCoin = newInstance(Elements.Data[type][id].coin);
            const callBack = () => {
              if (Elements.Data[type][id].coin !== lastCoin) {
                let diffCoin = Elements.Data[type][id].coin - lastCoin;
                lastCoin = newInstance(Elements.Data[type][id].coin);
                if (diffCoin > 0) diffCoin = '+' + diffCoin;
                diffCoin = '$ ' + diffCoin;
                const componentInstance = new Text(
                  `${diffCoin}`,
                  new TextStyle({
                    fill: diffCoin[0] !== '+' ? '#d4da1e' : '#d4da1e',
                    fontFamily: 'retro-font', // Impact
                    fontSize: 100 * (type === 'user' && id === 'main' ? 1 : 1 / Matrix.Data.dimAmplitude),
                    dropShadow: true,
                    dropShadowAngle: 1,
                    dropShadowBlur: 3,
                    dropShadowColor: '#121212',
                    dropShadowDistance: 1,
                  }),
                );
                this.Data[type][id].components[componentType].container.addChild(componentInstance);
                setTimeout(() => {
                  componentInstance.destroy();
                }, 450);
              }
            };
            if (!this.Data[type][id].intervals[componentType]) this.Data[type][id].intervals[componentType] = {};
            this.Data[type][id].intervals[componentType]['coinIndicator-interval'] = {
              callBack,
              interval: setInterval(callBack, 500),
            };
          }
          break;
        case 'lifeIndicator':
          {
            const componentInstance = new Container();
            componentInstance.x = 0;
            componentInstance.y = -1 * dim * Elements.Data[type][id].dim * 0.8;
            componentInstance.width = dim * Elements.Data[type][id].dim;
            componentInstance.height = dim * Elements.Data[type][id].dim * 0.4;
            this.Data[type][id].components[componentType].container = componentInstance;
            this.Data[type][id].addChild(componentInstance);
          }
          {
            const componentInstance = new Sprite(); // Texture.WHITE
            componentInstance.x = 0;
            componentInstance.y = 0;
            componentInstance.width = dim * Elements.Data[type][id].dim;
            componentInstance.height = dim * Elements.Data[type][id].dim * 0.4;
            // componentInstance.tint = '#000000ff';
            componentInstance.visible = true;
            this.Data[type][id].components[componentType].background = componentInstance;
            this.Data[type][id].components[componentType].container.addChild(componentInstance);
          }
          {
            let lastLife = newInstance(Elements.Data[type][id].life);
            const callBack = () => {
              if (Elements.Data[type][id].life !== lastLife) {
                let diffLife = Elements.Data[type][id].life - lastLife;
                lastLife = newInstance(Elements.Data[type][id].life);
                if (diffLife > 0) diffLife = '+' + diffLife;
                diffLife = diffLife + ' ♥';
                const componentInstance = new Text(
                  `${diffLife}`,
                  new TextStyle({
                    fill: diffLife[0] !== '+' ? '#FE2712' : '#7FFF00',
                    fontFamily: 'retro-font', // Impact
                    fontSize: 100 * (type === 'user' && id === 'main' ? 1 : 1 / Matrix.Data.dimAmplitude),
                    dropShadow: true,
                    dropShadowAngle: 1,
                    dropShadowBlur: 3,
                    dropShadowColor: '#121212',
                    dropShadowDistance: 1,
                  }),
                );
                this.Data[type][id].components[componentType].container.addChild(componentInstance);
                setTimeout(() => {
                  componentInstance.destroy();
                }, 450);
              }
            };
            if (!this.Data[type][id].intervals[componentType]) this.Data[type][id].intervals[componentType] = {};
            this.Data[type][id].intervals[componentType]['lifeIndicator-interval'] = {
              callBack,
              interval: setInterval(callBack, 500),
            };
          }
          break;
          break;

        default:
          break;
      }
    }
    this.setDisplayComponent({ type, id });
  },
  setDisplayComponent: function (options = { type: 'user', id: 'main' }) {
    // params
    const { type, id } = options;

    let dim = this.MetaData.dim / Matrix.Data.dim;
    if (type === 'user' && id === 'main') dim = dim * Matrix.Data.dimAmplitude;

    for (const componentType of Object.keys(CharacterSlotType)) {
      if (!this.Data[type][id].components[componentType]) continue;
      // clear
      if (this.Data[type][id].intervals && this.Data[type][id].intervals[componentType]) {
        for (const componentIntervalKey of Object.keys(this.Data[type][id].intervals[componentType])) {
          clearInterval(this.Data[type][id].intervals[componentType][componentIntervalKey].interval);
        }
        this.Data[type][id].intervals[componentType] = {};
      }

      if (this.Data[type][id].components[componentType]) {
        for (const componentKeyInstance of Object.keys(this.Data[type][id].components[componentType])) {
          this.Data[type][id].components[componentType][componentKeyInstance].destroy();
        }
        this.Data[type][id].components[componentType] = {};
      }

      // set skin
      let index = 0;
      for (const component of Elements.Data[type][id].components[componentType]) {
        const { displayId, position, enabled, positions, velFrame, assetFolder, extension } = component;
        for (const positionData of positions) {
          const { positionId, frames } = positionData;
          for (const frame of range(0, frames - 1)) {
            const src = `${getProxyPath()}assets/${assetFolder}/${displayId}/${positionId}/${frame}.${
              extension ? extension : `png`
            }`;
            const componentInstance = Sprite.from(src);
            let componentContainer;
            switch (displayId) {
              case 'green-power':
              case 'red-power':
                componentInstance.width = dim * Elements.Data[type][id].dim * 0.5;
                componentInstance.height = dim * Elements.Data[type][id].dim * 0.5;
                componentInstance.x =
                  (dim * Elements.Data[type][id].dim) / 2 - (dim * Elements.Data[type][id].dim * 0.5) / 2;
                componentInstance.y =
                  (dim * Elements.Data[type][id].dim) / 2 - (dim * Elements.Data[type][id].dim * 0.5) / 2;
                break;
              case 'tim-knife':
                componentInstance.width = dim * Elements.Data[type][id].dim;
                componentInstance.height = dim * Elements.Data[type][id].dim;
                componentInstance.x = 0;
                componentInstance.y = dim * Elements.Data[type][id].dim * 0.15;
                break;
              case 'brown-wing':
                switch (positionId) {
                  case '08':
                  case '18':
                    componentContainer = 'layer0';
                    componentInstance.width =
                      dim * Elements.Data[type][id].dim + (dim * Elements.Data[type][id].dim) / 2.5;
                    componentInstance.height = dim * Elements.Data[type][id].dim;
                    componentInstance.x = -1 * ((dim * Elements.Data[type][id].dim) / 5);
                    componentInstance.y = 0;
                    break;
                  case '02':
                  case '12':
                    componentInstance.width =
                      dim * Elements.Data[type][id].dim + (dim * Elements.Data[type][id].dim) / 2.5;
                    componentInstance.height = dim * Elements.Data[type][id].dim;
                    componentInstance.x = -1 * ((dim * Elements.Data[type][id].dim) / 5);
                    componentInstance.y = 0;
                    break;
                  case '06':
                  case '16':
                    componentInstance.width = (dim * Elements.Data[type][id].dim) / 2;
                    componentInstance.height = dim * Elements.Data[type][id].dim;
                    componentInstance.x = -1 * ((dim * Elements.Data[type][id].dim) / 5);
                    componentInstance.y = 0;
                    break;
                  case '04':
                  case '14':
                    componentInstance.width = (dim * Elements.Data[type][id].dim) / 2;
                    componentInstance.height = dim * Elements.Data[type][id].dim;
                    componentInstance.x = dim * Elements.Data[type][id].dim - (dim * Elements.Data[type][id].dim) / 4.5;
                    componentInstance.y = 0;
                    break;

                  default:
                    break;
                }
                break;
              default:
                componentInstance.width = dim * Elements.Data[type][id].dim;
                componentInstance.height = dim * Elements.Data[type][id].dim;
                componentInstance.x = 0;
                componentInstance.y = 0;
                break;
            }
            componentInstance.visible = position === positionId && frame === 0 && enabled;
            this.Data[type][id].components[componentType][`${src}-${index}`] = componentInstance;

            componentContainer
              ? this.Data[type][id].components[componentContainer].container.addChild(componentInstance)
              : this.Data[type][id].addChild(componentInstance);

            if (frame === 0) {
              let currentFrame = 0;
              let currentSrc;
              let currentIndex = newInstance(index);
              if (!this.Data[type][id].intervals[componentType]) this.Data[type][id].intervals[componentType] = {};

              const callBack = () => {
                if (!Elements.Data[type][id]) return this.removeElement({ type, id });
                if (!Elements.Data[type][id].components[componentType][currentIndex])
                  return clearInterval(this.Data[type][id].intervals[componentType][`${currentSrc}-${currentIndex}`]);
                const position = Elements.Data[type][id].components['skin'].find((s) => s.current).position;

                currentSrc = `${getProxyPath()}assets/${assetFolder}/${displayId}/${positionId}/${currentFrame}.${
                  extension ? extension : `png`
                }`;
                this.Data[type][id].components[componentType][`${currentSrc}-${currentIndex}`].visible = false;

                currentFrame++;
                if (currentFrame === frames) currentFrame = 0;

                currentSrc = `${getProxyPath()}assets/${assetFolder}/${displayId}/${positionId}/${currentFrame}.${
                  extension ? extension : `png`
                }`;

                const enabledSkin = Elements.Data[type][id].components[componentType].find((s) => s.enabled);
                this.Data[type][id].components[componentType][`${currentSrc}-${currentIndex}`].visible =
                  position === positionId && enabledSkin && enabledSkin.displayId === displayId;
              };
              setTimeout(() => callBack());
              this.Data[type][id].intervals[componentType][`${src}-${currentIndex}`] = {
                callBack,
                interval: setInterval(callBack, velFrame ? velFrame : CyberiaParams.EVENT_CALLBACK_TIME * 10),
              };
            }
          }
        }
        index++;
      }
    }
    this.updateLifeBarWidth({ type, id, dim });
    if (type === 'user' && id === 'main') MainUser.renderPixiMainUserBackground();
  },
  updateLife: function (options) {
    const { type, id } = options;
    let dim = this.MetaData.dim / Matrix.Data.dim;
    if (type === 'user' && id === 'main') dim = dim * Matrix.Data.dimAmplitude;
    this.Data[type][id].components['lifeBar'].width =
      dim * Elements.Data[type][id].dim * (Elements.Data[type][id].life / Elements.Data[type][id].maxLife);
  },
  updatePosition: function (options) {
    const { type, id } = options;

    if (type === 'user' && id === 'main') {
      if (Elements.Data[type][id].x <= 0) {
        console.warn('limit map position', 'left');
        WorldManagement.ChangeFace({ type, id, direction: 'left' });
      }
      if (Elements.Data[type][id].y <= 0) {
        console.warn('limit map position', 'top');
        WorldManagement.ChangeFace({ type, id, direction: 'top' });
      }
      if (Elements.Data[type][id].x >= Matrix.Data.dim - Elements.Data[type][id].dim) {
        console.warn('limit map position', 'right');
        WorldManagement.ChangeFace({ type, id, direction: 'right' });
      }
      if (Elements.Data[type][id].y >= Matrix.Data.dim - Elements.Data[type][id].dim) {
        console.warn('limit map position', 'bottom');
        WorldManagement.ChangeFace({ type, id, direction: 'bottom' });
      }
    }

    if (type === 'user' && id === 'main') {
      this.topLevelCallBack({ type, id });
      SocketIo.Emit(type, {
        status: 'update-position',
        element: { x: Elements.Data[type][id].x, y: Elements.Data[type][id].y },
      });
    } else {
      const dim = this.MetaData.dim / Matrix.Data.dim;
      this.Data[type][id].x = dim * Elements.Data[type][id].x;
      this.Data[type][id].y = dim * Elements.Data[type][id].y;
    }
  },
  topLevelCallBack: function ({ type, id }) {
    if (!BiomeScope.Data[Matrix.Data.biomeDataId]) return;
    if (
      BiomeScope.Data[Matrix.Data.biomeDataId].topLevelColor &&
      BiomeScope.Data[Matrix.Data.biomeDataId].topLevelColor[
        round10(
          Elements.Data[type][id].y * Matrix.Data.dimPaintByCell +
            (Elements.Data[type][id].dim / 2) * Matrix.Data.dimPaintByCell,
        )
      ] &&
      BiomeScope.Data[Matrix.Data.biomeDataId].topLevelColor[
        round10(
          Elements.Data[type][id].y * Matrix.Data.dimPaintByCell +
            (Elements.Data[type][id].dim / 2) * Matrix.Data.dimPaintByCell,
        )
      ][
        round10(
          Elements.Data[type][id].x * Matrix.Data.dimPaintByCell +
            (Elements.Data[type][id].dim / 2) * Matrix.Data.dimPaintByCell,
        )
      ] &&
      `${s(`.pixi-container-top-level`).style.opacity}` !== `0.3`
    ) {
      s(`.pixi-container-top-level`).style.opacity = '0.3';
    } else if (
      (!BiomeScope.Data[Matrix.Data.biomeDataId].topLevelColor[
        round10(
          Elements.Data[type][id].y * Matrix.Data.dimPaintByCell +
            (Elements.Data[type][id].dim / 2) * Matrix.Data.dimPaintByCell,
        )
      ] ||
        !BiomeScope.Data[Matrix.Data.biomeDataId].topLevelColor[
          round10(
            Elements.Data[type][id].y * Matrix.Data.dimPaintByCell +
              (Elements.Data[type][id].dim / 2) * Matrix.Data.dimPaintByCell,
          )
        ][
          round10(
            Elements.Data[type][id].x * Matrix.Data.dimPaintByCell +
              (Elements.Data[type][id].dim / 2) * Matrix.Data.dimPaintByCell,
          )
        ]) &&
      `${s(`.pixi-container-top-level`).style.opacity}` !== `1`
    ) {
      s(`.pixi-container-top-level`).style.opacity = '1';
    }
  },
  removeElement: function (options = { type: 'user', id: 'main' }) {
    const { type, id } = options;
    if (!this.Data[type][id]) return; // error case -> type: bot, skill, id: main
    for (const componentType of Object.keys(this.Data[type][id].intervals)) {
      for (const keyIntervalInstance of Object.keys(this.Data[type][id].intervals[componentType])) {
        if (this.Data[type][id].intervals[componentType][keyIntervalInstance].interval)
          clearInterval(this.Data[type][id].intervals[componentType][keyIntervalInstance].interval);
      }
    }
    this.Data[type][id].destroy();
    delete this.Data[type][id];
  },
  triggerUpdateDisplay: function (options = { type: 'user', id: 'main' }) {
    const { type, id } = options;
    for (const componentType of Object.keys(CharacterSlotType))
      if (this.Data[type][id].intervals[componentType])
        for (const skinInterval of Object.keys(this.Data[type][id].intervals[componentType]))
          this.Data[type][id].intervals[componentType][skinInterval].callBack();
  },
  removeAll: function () {
    for (const type of Object.keys(Elements.Data)) {
      for (const id of Object.keys(Elements.Data[type])) {
        this.removeElement({ type, id });
      }
    }
  },
  markers: {},
  renderMarker: async function ({ x, y }) {
    const id = getId(this.markers, 'marker-');

    this.markers[id] = { x, y };

    const dim = this.MetaData.dim / Matrix.Data.dim;
    const container = new Container();
    container.width = dim;
    container.height = dim;
    container.x = dim * x;
    container.y = dim * y;

    const sprites = {};

    for (const frame of range(0, 3)) {
      const src = `${getProxyPath()}assets/icons/pointer/${frame}.png`;
      sprites[frame] = Sprite.from(src);
      sprites[frame].width = dim / 2;
      sprites[frame].height = dim / 2;
      sprites[frame].x = 0;
      sprites[frame].y = 0;
      sprites[frame].visible = frame === 0;
      container.addChild(sprites[frame]);
    }
    this.AppTopLevelColor.stage.addChild(container);

    await timer(30);
    sprites[0].visible = false;
    sprites[1].visible = true;
    await timer(30);
    sprites[1].visible = false;
    sprites[2].visible = true;
    await timer(30);
    sprites[2].visible = false;
    sprites[3].visible = true;
    await timer(750);
    sprites[3].visible = false;
    sprites[2].visible = true;
    await timer(10);
    sprites[3].visible = false;
    sprites[2].visible = true;
    await timer(10);
    sprites[2].visible = false;
    sprites[1].visible = true;
    await timer(10);
    sprites[1].visible = false;
    sprites[0].visible = true;
    await timer(10);

    container.destroy();
    delete this.markers[id];
  },
  setUsername: function ({ type, id }) {
    // https://pixijs.io/pixi-text-style/#
    const componentType = 'username';
    let dim = this.MetaData.dim / Matrix.Data.dim;
    if (type === 'user' && id === 'main') dim = dim * Matrix.Data.dimAmplitude;
    {
      if (this.Data[type][id].components[componentType] && this.Data[type][id].components[componentType].container)
        this.Data[type][id].components[componentType].container.destroy();
      const componentInstance = new Container();
      componentInstance.x = 0;
      componentInstance.y = -1 * dim * Elements.Data[type][id].dim * 0.5;
      componentInstance.width = dim * Elements.Data[type][id].dim;
      componentInstance.height = dim * Elements.Data[type][id].dim * 0.4;
      this.Data[type][id].components[componentType].container = componentInstance;
      this.Data[type][id].addChild(componentInstance);
    }
    {
      setTimeout(() => {
        const componentInstance = new Text(
          Elements.getDisplayName({ type, id }),
          new TextStyle({
            fill: '#dcdcdc',
            fontFamily: 'retro-font-sensitive',
            fontSize: 100 * (type === 'user' && id === 'main' ? 1 : 1 / Matrix.Data.dimAmplitude),
            // fontWeight: 'bold',
            dropShadow: true,
            dropShadowAngle: 1,
            dropShadowBlur: 3,
            dropShadowColor: '#121212',
            dropShadowDistance: 1,
          }),
        );
        this.Data[type][id].components[componentType].container.addChild(componentInstance);
      }, 100);
    }
  },
  updateLifeBarWidth: function ({ type, id, dim }) {
    if (this.Data[type][id].components['lifeBar'])
      this.Data[type][id].components['lifeBar'].width =
        dim * Elements.Data[type][id].dim * (Elements.Data[type][id].life / Elements.Data[type][id].maxLife);
  },
};

export { Pixi };
