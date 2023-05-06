append(
  'body',
  /*html*/ `
      <style>
  
        input-warn {
          ${borderChar(1, 'black')}
        }
  
        label {
          ${borderChar(1, 'black')}
        }
  
        .title-section {
          ${borderChar(2, 'yellow')}
        }

        .item-bag-style-text {
          ${borderChar(2, 'black')}
        }
  
      </style>
      <style class='css-controller'></style>
  
      <pixi-container class='in'></pixi-container>
  
      <event-board class='abs' style='display: none'>
          
      </event-board>
  
      <map-type-status>
      </map-type-status>
  
      <dead-count></dead-count>
  
      <touch-layer class='abs custom-cursor'>
        <loader class='abs'>
          ${renderSpinner()}
        </loader>
      </touch-layer>
  
      <gui-layer class='abs' style='display: none'>
          ${createAccount()}
          ${logIn()}
          ${bag()}
          ${chat()}
          ${characterStats()}
          ${config()}
          ${wiki()}
          ${map()}
          ${account()}
          ${quests()}
          ${historyBoard()}
          <div class='abs close-gui custom-cursor hover-button'>
              <div class='abs center'>
                  <img class='inl icons-menu' src='/icons/200x200/cross.gif'>
              </div>
          </div>
      </gui-layer>
      
      <div class='abs open-menu custom-cursor hover-button' style='display: none'>
          <div class='abs center'>
              <img class='inl cyberia-logo' src='/icons/144x144/cyberia.png'>
          </div>
          <div class='abs noti-circle noti-circle-total' style='display: none'>
              <div class='abs center noti-count-total'>
                
              </div>
          </div>
      </div>
  
      <main-menu class='abs' style='display: none'>
  
        <div class='abs close-menu custom-cursor hover-button'>
            <div class='abs center'>
                <img class='inl icons-menu' src='/icons/200x200/cross.gif'>
            </div>
        </div>
  
        <div class='abs content-cyberia-logo'>
              ${renderCyberiaLogo()}
        </div>
  
        <common-menu class='in'>    
            <menu-button class='in custom-cursor btn-quests'>
              <div class='abs center'>
                ${renderLang({ es: 'Misiones', en: 'Quests' })}
              </div>
              <div class='abs noti-circle noti-circle-quests' style='display: none'>
                <div class='abs center noti-count-quests'>
                  
                </div>
              </div>
            </menu-button>        
            <menu-button class='in custom-cursor btn-bag'>
              <div class='abs center'>
                ${renderLang({ es: 'Mochila', en: 'Bag' })}
              </div>
            </menu-button>
            <menu-button class='in custom-cursor btn-chat'>
              <div class='abs center'>
                ${renderLang({ es: 'Chat', en: 'Chat' })}
              </div>
              <div class='abs noti-circle noti-circle-chat' style='display: none'>
                <div class='abs center noti-count-chat'>
                  
                </div>
              </div>
            </menu-button>          
            <menu-button class='in custom-cursor btn-character-stats'>
              <div class='abs center'>
                ${renderLang({ es: 'Estadistica de Personaje', en: 'Character Stats' })}
              </div>
            </menu-button>
            <menu-button class='in custom-cursor btn-map'>
              <div class='abs center'>
                ${renderLang({ en: 'Map', es: 'Mapa' })}
              </div>
            </menu-button>
            <menu-button class='in custom-cursor btn-wiki'>
              <div class='abs center'>
                ${renderLang({ en: 'Wiki', es: 'Wiki' })}
              </div>
            </menu-button>
            <menu-button class='in custom-cursor btn-history-board'>
              <div class='abs center'>
                ${renderLang({ en: 'Event History', es: 'Historial de eventos' })}
              </div>
            </menu-button>
            <menu-button class='in custom-cursor btn-config'>
              <div class='abs center'>
                ${renderLang({ en: 'Settings', es: 'Configuraciones' })}
              </div>
            </menu-button>
        </common-menu>
  
        <no-session-menu  class='in' style='display: none'>
          <menu-button class='in custom-cursor btn-login'>
            <div class='abs center'>
              ${renderLang({ es: 'Ingresar', en: 'Login' })}
            </div>
          </menu-button>
          <menu-button class='in custom-cursor btn-create-account'>
            <div class='abs center'>
              ${renderLang({ es: 'Crear cuenta', en: 'Create Account' })}
            </div>
          </menu-button>
        </no-session-menu>
  
        <session-menu  class='in' style='display: none'>
          <menu-button class='in custom-cursor btn-account'>
              <div class='abs center'>
                ${renderLang({ en: 'Account', es: 'Cuenta' })}
              </div>
          </menu-button>
          <menu-button class='in custom-cursor btn-logout'>
            <div class='abs center'>
              ${renderLang({ es: 'Cerrar Sesión', en: 'Logout' })}
            </div>
          </menu-button>
        </session-menu>
  
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
  s('create-account').style.display = 'block';
};

s('.btn-login').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('login').style.display = 'block';
};

s('.btn-bag').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('bag').style.display = 'block';
};

s('.btn-chat').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('chat').style.display = 'block';
  setTimeout(() => s('.chat-input').focus());
  resetNotiCircleChat();
};

s('.btn-character-stats').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('character-stats').style.display = 'block';
};

s('.btn-config').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('config').style.display = 'block';
};

s('.btn-wiki').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('wiki').style.display = 'block';
};

s('.btn-map').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('map').style.display = 'block';
};

s('.btn-account').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('account').style.display = 'block';
};

s('.btn-quests').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('quests').style.display = 'block';
  resetNotiCircleQuests();
};

s('.btn-history-board').onclick = () => {
  s('.close-menu').click();
  s('gui-layer').style.display = 'block';
  s('history-board').style.display = 'block';
};

s('.close-gui').onclick = () => {
  s('gui-layer').style.display = 'none';
  s('create-account').style.display = 'none';
  s('login').style.display = 'none';
  s('bag').style.display = 'none';
  s('chat').style.display = 'none';
  s('character-stats').style.display = 'none';
  s('config').style.display = 'none';
  s('wiki').style.display = 'none';
  s('map').style.display = 'none';
  s('account').style.display = 'none';
  s('quests').style.display = 'none';
  s('history-board').style.display = 'none';
};

s('.btn-logout').onclick = () => {
  localStorage.removeItem('_b');
  htmls('event-history-render', '');
  newMainUserInstance();
};
