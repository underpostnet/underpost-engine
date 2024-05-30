import { SocketIo } from './components/core/SocketIo.js';
import { Responsive } from './components/core/Responsive.js';
import { Keyboard } from './components/core/Keyboard.js';
import { disableOptionsClick } from './components/core/VanillaJs.js';
import { Pixi } from './components/cyberia/Pixi.js';
import { Elements } from './components/cyberia/Elements.js';
import { TranslateCyberia } from './components/cyberia/TranslateCyberia.js';
import { JoyStickCyberia } from './components/cyberia/JoyStickCyberia.js';
import { MainUser } from './components/cyberia/MainUser.js';
import { SocketIoCyberia } from './components/cyberia/SocketIoCyberia.js';
import { LogOutCyberia } from './components/cyberia/LogOutCyberia.js';
import { TranslateCore } from './components/core/Translate.js';
import { Menu } from './components/cyberia/Menu.js';
import { RouterCyberia } from './components/cyberia/RoutesCyberia.js';
import { Css } from './components/core/Css.js';
import { CssCyberiaDark } from './components/cyberia/CssCyberia.js';
import { Skill } from './components/cyberia/Skill.js';
import { PointAndClickMovement } from './components/cyberia/PointAndClickMovement.js';
import { SignUpCyberia } from './components/cyberia/SignUpCyberia.js';
import { InteractionPanel } from './components/cyberia/InteractionPanel.js';
import { CyberiaParams } from './components/cyberia/CommonCyberia.js';
import { Worker } from './components/core/Worker.js';
Worker.instance({
  router: RouterCyberia,
  render: async () => {
    await Css.loadThemes([CssCyberiaDark]);
    await TranslateCore.Init();
    await TranslateCyberia.Init();
    await MainUser.Render();
    await Pixi.Init();
    await Responsive.Init();
    await Menu.Render();
    await Skill.renderMainKeysSlots();
    await PointAndClickMovement.Render();
    await InteractionPanel.Render({ id: 'map-interaction-panel' });
    await InteractionPanel.Render({ id: 'element-interaction-panel' });
    await SocketIo.Init({ channels: Elements.Data });
    await SocketIoCyberia.Init();
    await LogOutCyberia();
    await SignUpCyberia();
    disableOptionsClick('html', ['drag', 'select', 'menu']);
    await Keyboard.Init({ callBackTime: CyberiaParams.EVENT_CALLBACK_TIME });
    await JoyStickCyberia.Render();
  },
});
