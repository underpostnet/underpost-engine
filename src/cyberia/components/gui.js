append(
  'body',
  /*html*/ `
      <style>
  
        input-warn {
          ${borderChar(1, 'black')}
        }
  
        label, .title-type-equip {
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
  
      <pixi-container class='fix'></pixi-container>
  
      <event-board class='fix' style='display: none'>
          
      </event-board>
  
      <dead-count></dead-count>
  
      <touch-layer class='fix custom-cursor'>
        <loader class='abs'>
          ${renderSpinner()}
        </loader>
      </touch-layer>

      <touch-over-layer class='fix tol-0 custom-cursor'></touch-over-layer>
      <touch-over-layer class='fix tol-1 custom-cursor'></touch-over-layer>
      <touch-over-layer class='fix tol-2 custom-cursor'></touch-over-layer>
      <touch-over-layer class='fix tol-3 custom-cursor'></touch-over-layer>
      <touch-over-layer class='fix tol-4 custom-cursor'></touch-over-layer>
      <touch-over-layer class='fix tol-5 custom-cursor'></touch-over-layer>
      <touch-over-layer class='fix tol-6 custom-cursor'></touch-over-layer>
      <touch-over-layer class='fix tol-7 custom-cursor'></touch-over-layer>
  
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
          <div class='fix close-gui custom-cursor hover-button'>
              <div class='abs center'>
                  <img class='inl icons-menu' src='/icons/200x200/cross.gif'>
              </div>
          </div>
      </gui-layer>
      
      <map-type-status class='custom-cursor'>
      </map-type-status>
      
      <div class='fix open-menu custom-cursor hover-button' style='display: none'>
          <div class='abs center'>
              <img class='inl cyberia-logo' src='/icons/144x144/cyberia.png'>
          </div>
          <div class='abs noti-circle noti-circle-gui noti-circle-total' style='display: none'>
              <div class='abs center noti-count-total'>
                
              </div>
          </div>
      </div>
  
      <main-menu class='fix' style='display: none'>
  
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
                ${renderLang({ es: 'Logros', en: 'Achievements' })}
              </div>
              <div class='abs noti-circle noti-circle-gui noti-circle-quests' style='display: none'>
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
              <div class='abs noti-circle noti-circle-gui noti-circle-chat' style='display: none'>
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

let guiSections = [
  'create-account',
  'login',
  'bag',
  'chat',
  'character-stats',
  'config',
  'wiki',
  'map',
  'account',
  'quests',
  'history-board',
];

let tempGuiSections = [];

const closeGuiSections = () => {
  guiSections.map((section) => (s(section).style.display = 'none'));
  tempGuiSections.map((section) => (s(section) ? (s(section).style.display = 'none') : null));
  tempGuiSections = [];
};

s('.close-menu').onclick = () => {
  s('main-menu').style.display = 'none';
  s('.open-menu').style.display = 'block';
};
s('.open-menu').onclick = () => {
  s('.open-menu').style.display = 'none';
  s('main-menu').style.display = 'block';
};

const mainCloseGUI = () => {
  s('.close-menu').click();
  closeGuiSections();
  s('gui-layer').style.display = 'block';
};

const intanceMenuBtns = () => {
  guiSections.map((section) => {
    s(`.btn-${section}`).onclick = () => {
      mainCloseGUI();
      s(section).style.display = 'block';

      switch (section) {
        case 'chat':
          setTimeout(() => s('.chat-input').focus());
          resetNotiCircleChat();
          break;
        case 'quests':
          // resetNotiCircleQuests();
          break;
        default:
          break;
      }
    };
  });
};
intanceMenuBtns();

s('.close-gui').onclick = () => {
  s('gui-layer').style.display = 'none';
  closeGuiSections();
};

range(0, 7).map((ti) => {
  s(`.tol-${ti}`).onclick = () => {
    const screenDim = dimState();
    const element = elements['user'].find((u) => u.id === socket.id);
    if (!element) return;
    if (screenDim.maxType === 'height') {
      switch (ti) {
        case 0:
          element.direction = 'North West';
          params[element.type][element.id].direction = 'North West';
          break;
        case 1:
          element.direction = 'North';
          params[element.type][element.id].direction = 'North';
          break;
        case 2:
          element.direction = 'North East';
          params[element.type][element.id].direction = 'North East';
          break;
        case 3:
          element.direction = 'South West';
          params[element.type][element.id].direction = 'South West';
          break;
        case 4:
          element.direction = 'South';
          params[element.type][element.id].direction = 'South';
          break;
        case 5:
          element.direction = 'South East';
          params[element.type][element.id].direction = 'South East';
          break;
        case 6:
          element.direction = 'East';
          params[element.type][element.id].direction = 'East';
          break;
        case 7:
          element.direction = 'West';
          params[element.type][element.id].direction = 'West';
          break;
      }
    } else {
    }
    effect(element);
  };
});
