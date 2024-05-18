import { Auth } from '../core/Auth.js';
import { LogOut } from '../core/LogOut.js';
import { NotificationManager } from '../core/NotificationManager.js';
import { Translate } from '../core/Translate.js';
import { s } from '../core/VanillaJs.js';

const LogOutCyberiaPortal = async function () {
  LogOut.Event['LogOutCyberiaPortal'] = async () => {
    localStorage.removeItem('jwt');
    s(`.main-btn-log-out`).style.display = 'none';
    s(`.main-btn-account`).style.display = 'none';
    s(`.main-btn-log-in`).style.display = null;
    s(`.main-btn-sign-up`).style.display = null;
    s(`.toolbar-sign-up`).classList.remove('hide');
    s(`.toolbar-log-in`).classList.remove('hide');
    if (s(`.modal-log-out`)) s(`.btn-close-modal-log-out`).click();
    if (s(`.modal-account`)) s(`.btn-close-modal-account`).click();

    Auth.deleteToken();

    NotificationManager.Push({
      html: Translate.Render(`success-logout`),
      status: 'success',
    });
  };
};

export { LogOutCyberiaPortal };
