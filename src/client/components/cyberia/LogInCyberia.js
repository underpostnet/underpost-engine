import { CyberiaUserService } from '../../services/cyberia-user/cyberia-user.service.js';
import { UserService } from '../../services/user/user.service.js';
import { Auth } from '../core/Auth.js';
import { newInstance } from '../core/CommonJs.js';
import { LoadingAnimation } from '../core/LoadingAnimation.js';
import { LogIn } from '../core/LogIn.js';
import { SocketIo } from '../core/SocketIo.js';
import { s, setURI } from '../core/VanillaJs.js';
import { Webhook } from '../core/Webhook.js';
import { BaseElement } from './CommonCyberia.js';
import { WebhookCyberia } from './WebhookCyberia.js';
import { ElementsCyberia } from './ElementsCyberia.js';
import { InteractionPanelCyberia } from './InteractionPanelCyberia.js';
import { MainUserCyberia } from './MainUserCyberia.js';
import { SocketIoCyberia } from './SocketIoCyberia.js';

const initAnonSession = async () => {
  LoadingAnimation.barLevel.append();
  await MainUserCyberia.Update();
  SocketIo.Emit('user', {
    status: 'propagate',
  });
};

const LogInCyberia = async function () {
  const type = 'user';
  const id = 'main';

  LogIn.Event['LogInCyberia'] = async (options) => {
    const { token, user } = options;

    localStorage.setItem('jwt', token);
    Auth.setToken(token);

    s(`.main-btn-log-in`).style.display = 'none';
    s(`.main-btn-sign-up`).style.display = 'none';
    s(`.main-btn-log-out`).style.display = null;
    s(`.main-btn-account`).style.display = null;
    if (s(`.modal-log-in`)) s(`.btn-close-modal-log-in`).click();
    if (s(`.modal-sign-up`)) s(`.btn-close-modal-sign-up`).click();
    const oldElement = newInstance(ElementsCyberia.Data[type][id]);
    // ElementsCyberia.Data[type][id] = BaseElement()[type][id];
    Webhook.register({ user });
    const resultUserCyberia = await CyberiaUserService.get({ id: 'auth' });
    if (resultUserCyberia.data.redirect) {
      const redirect = `${location.protocol}//${location.hostname}${resultUserCyberia.data.redirect}`;
      // if (location.port && localStorage.getItem('jwt')) localStorage.removeItem('jwt');
      // return (location.href = redirect);
      setURI(resultUserCyberia.data.redirect);
      await SocketIo.Init({ channels: ElementsCyberia.Data });
      return await SocketIoCyberia.Init();
    }
    LoadingAnimation.barLevel.append();
    if (resultUserCyberia.status === 'success') {
      ElementsCyberia.Init({ type, id, element: resultUserCyberia.data });
      WebhookCyberia.register({ user: resultUserCyberia.data });
    }
    ElementsCyberia.Data[type][id].model.user = user;

    await MainUserCyberia.Update({ oldElement });
  };
  const token = localStorage.getItem('jwt');
  if (token) {
    Auth.setToken(token);
    const result = await UserService.get({ id: 'auth' });
    if (result.status === 'success' && result.data[0]) {
      const [user] = result.data;
      await LogIn.Trigger({
        token,
        user,
      });
    } else {
      localStorage.removeItem('jwt');
      await initAnonSession();
    }
  } else await initAnonSession();
  await InteractionPanelCyberia.PanelRender.element({ type: 'user', id: 'main' });
};

export { LogInCyberia };
