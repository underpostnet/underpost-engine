const amplitudeRender = 50;
const elements = {};
const pixi = {};
const params = {};
const hashIntervals = {};
let changeMapsPoints = [];
let mapMetaData = {
  types: ['pve', 'pvp'],
};

Object.keys(typeModels()).map((type) => ((elements[type] = []), (pixi[type] = {}), (params[type] = {})));

const app = new PIXI.Application({
  width: maxRangeMap() * amplitudeRender,
  height: maxRangeMap() * amplitudeRender,
  background: 'black',
});

s('pixi-container').appendChild(app.view);

console.log('typeModels', typeModels());
console.log('elements', elements);
console.log('pixi', pixi);

let firstLoad = true;
setTimeout(() => (firstLoad ? location.reload() : null), 3500);
const socket = io(IO_HOST);

socket.on('connect', () => {
  console.log(`socket.io event: connect | session id: ${socket.id}`);
  socket.emit('init', JSON.stringify({ token: localStorage.getItem('_b'), path: getURI() }));
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
    const sprite = `${elements[type][elementIndex].sprite}`;
    if (
      eventElement.id === socket.id &&
      eventElement.successQuests &&
      Object.values(eventElement.successQuests).length > elements[type][elementIndex].successQuests.length
    )
      setTimeout(() => renderMapsQuests());

    elements[type][elementIndex] = validateSchemeElement(merge(elements[type][elementIndex], eventElement));

    if (eventElement.id === socket.id)
      setTimeout(() => {
        let renderNewStats = false;
        statsItems.map((skillKey) => {
          if (eventElement[skillKey] !== undefined) renderNewStats = true;
        });
        if (renderNewStats) {
          htmls('.character-stats-grid', renderStatsGrid(elements[type][elementIndex]));
          initMainUserJoy(elements[type][elementIndex]);
        }
      });

    if (eventElement.sprite && sprite !== elements[type][elementIndex].sprite)
      renderPixiSprite(elements[type][elementIndex], sprite);

    return renderPixiEventElement(elements[type][elementIndex]);
  }
  if (eventElement.id === socket.id && eventElement.map) {
    // console.log('init main user', JSON.stringify(eventElement, null, 4));
    userPositionAvailablePoints = getAvailablePoints('user', ['building', 'object', 'object-frames'], eventElement.map);
    userMatrixCollision = getMatrixCollision('user', ['building', 'object', 'object-frames'], eventElement.map);
    console.log('userMatrixCollision', JSONmatrix(userMatrixCollision));
    const queryParams = getQueryParams();
    console.warn('queryParams', JSON.stringify(queryParams, null, 4));
    if (queryParams.confirmemail) {
      renderNotification(
        'success',
        renderLang({ es: 'Email confirmado con exito', en: 'Email confirmed successfully' })
      );
    }
    setURI('/' + eventElement.map);
    htmls('title', renderInstanceTitle({ name_map: eventElement.map }));
  }
  if (eventElement.map && eventElement.render && eventElement.id && eventElement.type) {
    if (socket.id === eventElement.id) {
      if (eventElement._id) {
        s('no-session-menu').style.display = 'none';
        s('session-menu').style.display = 'block';
      } else {
        s('session-menu').style.display = 'none';
        s('no-session-menu').style.display = 'block';
        if (localStorage.getItem('_b')) localStorage.removeItem('_b');
      }
      if (eventElement.confirmEmail === true) s('.btn-account-confirm-email').style.display = 'none';
      else s('.btn-account-confirm-email').style.display = 'inline-table';
    }
    elements[type].push(eventElement);
    renderPixiInitElement(eventElement);
  }
});

socket.on('init-data', (...args) => {
  const initData = JSON.parse(args);
  console.log('initData', initData);
  changeMapsPoints = initData.changeMapsPoints;
  updateMapGPS();
  mapMetaData = initData.mapMetaData;
  instanceMapTypeStatus();
  renderMapsQuests();
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
  mapMetaData.safe_cords.map((cords) => {
    const type = 'safe-zone';
    const { color, render } = getParamsType(type);
    const { dim } = render;
    const map = mapMetaData.map;
    const safeZoneElement = {
      id: id(),
      type,
      color,
      map,
      render: {
        x: cords[0],
        y: cords[1],
        dim,
      },
    };
    elements[type].push(safeZoneElement);
    renderPixiInitElement(safeZoneElement);
  });
  s('loader').style.display = 'none';
  if (firstLoad) {
    if (localStorage.getItem('_b')) s('.close-menu').click();
    else s('main-menu').style.display = 'block';
    firstLoad = false;
  }
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

socket.on('event', (...args) => {
  const eventElement = JSON.parse(args);
  switch (eventElement.type) {
    case 'chat':
      renderChatMsg(eventElement.element, eventElement.msg);
      break;
    case 'drop':
      const { item, elementFromDrop, newItemsState } = eventElement;
      renderEventBoard({
        history: true,
        tag: 'DROP',
        msg: /*html*/ `                    
          ${renderLang({
            es: /*html*/ `
              [<span style='color: yellow'> 
                ${getDisplayName(elementFromDrop)} 
                  <img src='/sprites/${elementFromDrop.sprite}/08/0.png' class='inl icon-board-img'> 
                </span>]
                ha botado un item`,
            en: /*html*/ `
              [<span style='color: yellow'> 
                ${getDisplayName(elementFromDrop)} 
                  <img src='/sprites/${elementFromDrop.sprite}/08/0.png' class='inl icon-board-img'> 
                </span>]
                has dropped an item`,
          })}     
          [<span style='color: yellow'>
            ${renderLang(item.name)}
            <img src='/items/${item.id}/animation.gif' class='inl icon-board-img'>    
          </span>]
      `,
      });
      newInstanceBagItems(newItemsState);
      if (s('.modal-count-' + item.id)) setTimeout(() => htmls('.modal-count-' + item.id, getK(item.count)));
      break;
    case 'dead-count':
      renderDeadCount(eventElement);
      break;
    case 'duplicate-user-delete':
      socket.disconnect();
      htmls(
        'body',
        /*html*/ `
     <div class='abs center'>
        <img class='inl' src='/icons/144x144/cyberia.png'>
        <br><br>
        ${renderLang({
          en: 'The platform is open <br> in another tab',
          es: 'La plataforma ha sido abierta <br> en otra pestaña',
        })}
    </div>
      `
      );
      break;
    case 'equip-item':
      renderDisplayItems(
        {
          ...elements['user'].find((e) => e.id === eventElement.id),
          displayItems: eventElement.displayItems,
        },
        eventElement.item
      );
      if (eventElement.id === socket.id) {
        const boxEquipId = `.${eventElement.item.itemType}-equip-content`;
        htmls(boxEquipId, renderItemBox({ data: eventElement.item }));
        // s('.close-gui').click();
        // s('.btn-character-stats').click();
        s(boxEquipId).onclick = () =>
          renderItemModal({
            ...eventElement.item,
            count: () => undefined,
            active: () => false,
            typeModal: 'character-equip-box',
          });
        if (s(`.item-modal-${eventElement.item.id}`)) {
          s(`.item-equip-${eventElement.item.id}`).style.display = 'none';
          if (eventElement.item.displayLogic === 'skins')
            s(`.item-unequip-${eventElement.item.id}`).style.display = 'none';
          else s(`.item-unequip-${eventElement.item.id}`).style.display = 'inline-table';
        }
      }
      break;
    case 'unequip-item':
      removeDisplayItem(
        elements['user'].find((e) => e.id === eventElement.id),
        eventElement.item.id
      );
      const indexEventUser = elements['user'].findIndex((e) => e.id === eventElement.id);
      elements['user'][indexEventUser].displayItems = elements['user'][indexEventUser].displayItems.filter(
        (i) => i !== eventElement.item.id
      );
      if (eventElement.id === socket.id) {
        removeTypeSlot(eventElement.item.itemType);
        if (s(`.item-modal-${eventElement.item.id}`)) {
          s(`.item-unequip-${eventElement.item.id}`).style.display = 'none';
          s(`.item-equip-${eventElement.item.id}`).style.display = 'inline-table';
        }
      }
      break;

    case 'kill-element':
      const { fromElmement, toElement } = eventElement;

      renderEventBoard({
        history: true,
        tag: 'KILL',
        msg: /*html*/ `                    
          ${renderLang({
            es: /*html*/ `
              [<span style='color: yellow'> 
                ${getDisplayName(fromElmement)} 
                  <img src='/sprites/${fromElmement.sprite}/08/0.png' class='inl icon-board-img'> 
                </span>]
                a derrotado a`,
            en: /*html*/ `
              [<span style='color: yellow'> 
                ${getDisplayName(fromElmement)} 
                  <img src='/sprites/${fromElmement.sprite}/08/0.png' class='inl icon-board-img'> 
                </span>]
                has defeated`,
          })}     
          ${renderLang({
            es: /*html*/ `
              [<span style='color: yellow'> 
                ${getDisplayName(toElement)} 
                  <img src='/sprites/${toElement.sprite}/08/0.png' class='inl icon-board-img'> 
                </span>]
                en ${toElement.map}`,
            en: /*html*/ `
              [<span style='color: yellow'> 
                ${getDisplayName(toElement)} 
                  <img src='/sprites/${toElement.sprite}/08/0.png' class='inl icon-board-img'> 
                </span>]
                in ${toElement.map}`,
          })}     
      `,
      });
      Object.keys(questsLogicsStorage).map((questId) => {
        if (questsLogicsStorage[questId].type === 'kill-element')
          questsLogicsStorage[questId].checkStatusQuest(eventElement);
      });
      break;

    default:
      break;
  }
});

socket.onAny((event, ...args) => {
  // console.log(`socket.io onAny event: ${event} | arguments: ${args}`);
});

// intervals clear
// setInterval(() => {
//   Object.keys(hashIntervals).map((idElement) => {
//     if (!getAllElements().find((e) => e.id === idElement)) {
//       Object.keys(hashIntervals[idElement]).map((idInterval) => {
//         if (hashIntervals[idElement][idInterval]) clearInterval(hashIntervals[idElement][idInterval]);
//       });
//       delete hashIntervals[idElement];
//     }
//   });
// }, 1000);
