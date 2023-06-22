let mainUserBag = [];
let localItemsStorage = [];
let localItemsRenderStorage = [];
let sortableBagInstance = null;
let currentTypeBagItemDisplay = 'all';

const getFolderAssetSrc = (item) => {
  switch (item.displayLogic) {
    case 'skins':
      return 'sprites';
    case 'skills':
      return 'skills';
    default:
      return 'items';
  }
};

const getK = (koyn) => {
  /*
  TOP DEFINITION
  1kk
  1kk means million where each K represents 000.
  1k = 1 000
  1kk = 1 000 000
  1kkk =1 000 000 000
  Mostly used in games.
  I'm selling this item for 1kk
  by Aelos03 May 22, 2014
  */
  const limitA = 1000;
  const limitB = 1000000;
  const limitC = 1000000000;
  if (koyn >= limitA && koyn < limitB) return round10(koyn / limitA, -1) + 'k';
  else if (koyn >= limitB && koyn < limitC) return round10(koyn / limitB, -1) + 'kk';
  else if (koyn >= limitC) return round10(koyn / limitC, -1) + 'kkk';
  return koyn;
};

const renderInitModalCounts = () => {
  const element = elements['user'].find((e) => e.id === socket.id);
  if (s('.modal-count-koyn')) htmls('.modal-count-koyn', getK(element.koyn));
  if (s('.modal-count-crypto-koyn')) htmls('.modal-count-crypto-koyn', 0);
  localItemsStorage.map((i) => {
    if (s('.modal-count-' + i.id)) htmls('.modal-count-' + i.id, i.count());
  });
};

const renderItemCount = (valueID, value) => {
  return /*html*/ `
      <div class='abs center count-item-text' style='${borderChar(2, 'black')}'>
         <div class='abs center'>
              <span class='inl x-count-item-text'>X</span>
              <span class='${valueID}'>${getK(value)}</span>
          </div>
      </div>
  `;
};

const getItemData = async (item) => {
  const localItem = localItemsStorage.find((i) => i.id === item.id);
  let result;
  if (localItem) {
    result = {
      status: 'success',
      data: localItem,
    };
  } else {
    result = await serviceRequest(API_BASE + `/items/${item.id}`);
    localItemsStorage.push({
      ...result.data,
      count: () =>
        elements.user.find((e) => e.id === socket.id).items.find((i) => i.id === item.id)
          ? elements.user.find((e) => e.id === socket.id).items.find((i) => i.id === item.id).count
          : 0,
    });
  }
  Object.keys(result.data.name).map((langKey) => {
    result.data.name[langKey] = result.data.name[langKey].replaceAll(' ', '<br>');
  });
  return result;
};

const renderItemBox = (result, count) => /*html*/ `
<div class='abs center'>
  <img src='/${getFolderAssetSrc(result.data)}/${result.data.id}/animation.gif' class='inl item-bag-icon'>
</div> 
<div class='abs center item-bag-style-text'>
    ${renderLang(result.data.name)}
</div>
  ${renderTitleTypeSlot(result.data.itemType)}  
  ${count !== undefined ? renderItemCount(`bag-count-${result.data.id}`, count) : ''} 
`;

const renderItemModal = (item) => {
  let bodyModalRender = '';
  let equipmentBtn = '';
  let countRender = '';

  if (item.typeModal === undefined || item.typeModal === 'reward') {
    countRender = /*html*/ `<span style='font-size: 10px'>X</span><span class='modal-count-${
      item.id
    }' style='color: yellow; font-size: 12px'>${getK(item.count())}</span>`;
  }

  const renderTitleCountType = /*html*/ `
      ${renderLang(item.name)}
      <br>
      <div class='in modal-content-type-item'>
          ${renderTitleTypeSlot(item.itemType)}
      </div>
      <br><br>
      ${countRender}
  `;
  if (item.displayLogic === 'skills') {
    bodyModalRender = /*html*/ `
    <div class='in stats-content-item-modal'>
      <div class='in character-stats-grid-row'>
        <div class='in character-stats-grid-label'>
          ${renderLang({ es: 'Descripción', en: 'Description' }).toUpperCase()} 
        </div>
        <div class='in value-stat-content'>
          ${renderLang(item.description)}
        </div>
      </div>
    </div>
    `;
  } else if (item.displayLogic === 'currencies') {
  } else {
    bodyModalRender = /*html*/ `
        <div class='in stats-content-item-modal'>
              ${renderStatsGrid(item.stats)}
        </div>
      `; // btn-item-equip
  }
  if (
    item.displayLogic !== 'currencies' &&
    (item.typeModal === undefined || item.typeModal === 'character-equip-box')
  ) {
    equipmentBtn = /*html*/ `
          <br>
          <button class='inl custom-cursor item-equip-${item.id}'>
              ${renderLang({ es: 'Equipar', en: 'Equip' })}
          </button>
          <button class='inl custom-cursor item-unequip-${item.id}' style='display: none'>
              ${renderLang({ es: 'Remover', en: 'Remove' })}
          </button>
      
      `;
    setTimeout(() => {
      s(`.item-equip-${item.id}`).onclick = () => {
        console.log('equip', item);
        socket.emit(
          'event',
          JSON.stringify({
            event: 'item-equip',
            item: { id: item.id },
          })
        );
        s(`.item-equip-${item.id}`).style.display = 'none';
        s(`.item-unequip-${item.id}`).style.display = 'inline-table';
      };
      s(`.item-unequip-${item.id}`).onclick = () => {
        console.log('unequip', item);
        socket.emit(
          'event',
          JSON.stringify({
            event: 'item-unequip',
            item: { id: item.id },
          })
        );
        s(`.item-unequip-${item.id}`).style.display = 'none';
        s(`.item-equip-${item.id}`).style.display = 'inline-table';
      };
      if (
        elements['user'].find((e) => e.id === socket.id) &&
        elements['user'].find((e) => e.id === socket.id).items.find((i) => i.id === item.id) &&
        elements['user'].find((e) => e.id === socket.id).items.find((i) => i.id === item.id).active === true
      ) {
        if (item.displayLogic === 'skins') s(`.item-unequip-${item.id}`).style.display = 'none';
        else s(`.item-unequip-${item.id}`).style.display = 'inline-table';
        s(`.item-equip-${item.id}`).style.display = 'none';
      }
    });
  }

  const bodyModal = /*html*/ `
  
  <div class='in modal-item-header'>
    <div class='in fll modal-item-header-col'>
        <div class='abs center'>
            ${renderTitleCountType}
        </div>
    </div>
    <div class='in fll modal-item-header-col'>
        <img class='abs center item-modal-img' src='/${getFolderAssetSrc(item)}/${item.id}/animation.gif'>
    </div>
        <div class='abs btn-close-modal-item custom-cursor close-item-modal-${item.id}'>
            <div class='abs center'>
                <img class='inl icons-close-modal-item' src='/icons/200x200/cross.gif'>
            </div>
        </div>
  </div>

  <div class='in modal-item-stats'>
        ${bodyModalRender}
        ${equipmentBtn}
  </div>
  
  `;
  if (!s(`.item-modal-${item.id}`)) {
    append(
      'body',
      /*html*/ `

        <div class='abs center fix custom-cursor item-modal item-modal-${item.id}'>
            ${bodyModal}                
        </div>
    
    `
    );
  } else htmls(`.item-modal-${item.id}`, bodyModal);

  if (item.active() === true) {
    s(`.item-equip-${item.id}`).style.display = 'none';
    s(`.item-unequip-${item.id}`).style.display = 'inline-table';
  }
  dragDrop(`.item-modal-${item.id}`);
  s(`.close-item-modal-${item.id}`).onclick = () => {
    s(`.item-modal-${item.id}`).remove();
  };
};

const newInstanceBagItems = async (items) => {
  if (items === undefined) {
    const mainUser = elements['user'].find((u) => u.id === socket.id);
    if (mainUser) items = mainUser.items;
    else return;
  }
  if (currentTypeBagItemDisplay === 'all' || currentTypeBagItemDisplay === 'currency')
    mainUserBag = [
      renderKoynLogo(
        elements['user'].find((e) => e.id === socket.id) ? elements['user'].find((e) => e.id === socket.id).koyn : 0,
        false,
        'bag-koyn-indicator'
      ),
      renderKoynLogo(0, 'crypto', 'bag-cryptokoyn-indicator'),
    ];
  else mainUserBag = [];
  for (const item of items) {
    const result = await getItemData(item);
    if (currentTypeBagItemDisplay !== 'all' && result.data.itemType !== currentTypeBagItemDisplay) continue;
    console.log('bag renderItem', result);
    if (result.status === 'success') {
      mainUserBag.push({
        render: () => renderItemBox(result, item.count),
        data: {
          count: () =>
            elements.user.find((e) => e.id === socket.id)
              ? elements.user.find((e) => e.id === socket.id).items.find((i) => i.id === item.id).count
              : 0,
          active: () =>
            elements.user.find((e) => e.id === socket.id)
              ? elements.user.find((e) => e.id === socket.id).items.find((i) => i.id === item.id).active
              : false,
          ...result.data,
        },
      });
      if (
        elements['user'].find((e) => e.id === socket.id) &&
        elements['user'].find((e) => e.id === socket.id).items.find((i) => i.id === result.data.id && i.active === true)
      ) {
        const boxEquipId = `.${result.data.itemType}-equip-content`;
        htmls(boxEquipId, renderItemBox(result));
        s(boxEquipId).onclick = () =>
          renderItemModal({
            ...result.data,
            count: () => undefined,
            active: () => false,
            typeModal: 'character-equip-box',
          });
      }
    }
  }
  htmls('.grid-bag', '');
  let indexCell = 0;
  range(0, 3).map((iRow) => {
    append(
      '.grid-bag',
      /*html*/ `
      <!--
       <div class='fl grid-row-${iRow}'></div>    
       -->
       <div class='fl grid-row-irow'></div> 
      `
    );
    range(0, 3).map((iCell) => {
      const currentIndex = newInstance(indexCell);
      if (mainUserBag[currentIndex])
        setTimeout(() => {
          s(`.grid-cell-${mainUserBag[currentIndex].data.id}`).onclick = () => {
            console.log('item click', mainUserBag[currentIndex].data);
            renderItemModal(mainUserBag[currentIndex].data);
          };
        });
      append(
        // `.grid-row-${iRow}`,
        `.grid-row-irow`,
        /*html*/ `
        <!--
        <div class="in fll grid-cell custom-cursor 
        -->
        <div class="inl fll grid-cell custom-cursor ${
          mainUserBag[currentIndex] ? 'grid-cell-' + mainUserBag[currentIndex].data.id : ''
        }" data-id="${indexCell + 1}">
             ${mainUserBag[currentIndex] ? mainUserBag[currentIndex].render() : ''}
        </div>
        `
      );
      indexCell++;
    });
  });

  sortableBagInstance = new Sortable(s(`.grid-row-irow`), {
    animation: 150,
    group: `bag-grid`,
    forceFallback: true,
    fallbackOnBody: true,
    store: {
      /**
       * Get the order of elements. Called once during initialization.
       * @param   {Sortable}  sortable
       * @returns {Array}
       */
      get: function (sortable) {
        const order = localStorage.getItem(sortable.options.group.name);
        return order ? order.split('|') : [];
      },

      /**
       * Save the order of elements. Called onEnd (when the item is dropped).
       * @param {Sortable}  sortable
       */
      set: function (sortable) {
        const order = sortable.toArray();
        localStorage.setItem(sortable.options.group.name, order.join('|'));
      },
    },
    // chosenClass: 'css-class',
    // ghostClass: 'css-class',
    // Element dragging ended
    onEnd: function (/**Event*/ evt) {
      // console.log('Sortable onEnd', evt);
      // console.log('data-id', evt.item.getAttribute('data-id'));
      // console.log('evt.oldIndex', evt.oldIndex);
      // console.log('evt.newIndex', evt.newIndex);
      if (evt.oldIndex === evt.newIndex)
        s(`.grid-cell-${mainUserBag[parseInt(evt.item.getAttribute('data-id')) - 1].data.id}`).click();
      // var itemEl = evt.item; // dragged HTMLElement
      // evt.to; // target list
      // evt.from; // previous list
      // evt.oldIndex; // element's old index within old parent
      // evt.newIndex; // element's new index within new parent
      // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
      // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
      // evt.clone; // the clone element
      // evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving
    },
  });

  renderInitModalCounts();
};

const bag = () => {
  return /*html*/ `
    <bag style='display: none'>
      <sub-content-gui class='in'>

            <div class='in title-section'>${renderLang({ es: 'Mochila', en: 'Bag' })}</div>

            <div class='in bag-dropdown-content'>
                ${renderDropDown({
                  id: 'bag-dropdown',
                  optionCustomClass: 'custom-cursor',
                  style_dropdown_option: `
                    background: black;
                    z-index: 1;
                  `,
                  label: renderLang({ es: 'Todos', en: 'All' }),
                  data: [
                    {
                      display: renderLang({ es: 'Todos', en: 'All' }),
                      value: 'all',
                    },
                    {
                      display: 'currency',
                      value: 'currency',
                    },
                  ]
                    .concat(
                      characterSlots.map((x) => {
                        return {
                          display: cap(x.replaceAll('-', ' ').replaceAll('_', ' ')),
                          value: x,
                        };
                      })
                    )
                    .concat(
                      skillTypes.map((x) => {
                        return {
                          display: cap(x.replaceAll('-', ' ').replaceAll('_', ' ')),
                          value: x,
                        };
                      })
                    ),
                  onClick: (value) => {
                    console.log('bag-dropdown onclick ->', value);
                    currentTypeBagItemDisplay = `${value}`;
                    newInstanceBagItems();
                  },
                })}
            </div>
            <br><br>
            
            <div class='in grid-bag'> </div>

      </sub-content-gui>
    </bag>
    `;
};

const renderItemDisplayLogic = (element, item) => {
  // console.error('renderItemDisplayLogic', item);
  const { type } = element;
  const container = pixi[type][element.id].container;
  const botContainer = pixi[type][element.id].botContainer;
  switch (item.displayLogic) {
    case 'wings':
      const { x, y, width, height } = setAmplitudeRender(item.renderFactor);
      const amplitudeFactor = 1.35;

      [
        { dir: 'North', container, preSrc: '' },
        { dir: 'South', container: botContainer, preSrc: '' },
        { dir: 'South East', container, preSrc: 'r/' },
        { dir: 'East', container, preSrc: 'r/' },
        { dir: 'North East', container, preSrc: 'r/' },
        { dir: 'South West', container, preSrc: 'l/' },
        { dir: 'West', container, preSrc: 'l/' },
        { dir: 'North West', container, preSrc: 'l/' },
      ].map((dirObj) => {
        const { dir, container, preSrc } = dirObj;
        range(0, item.frames).map((i) => {
          const src = `/items/${item.id}/${preSrc}${i}.${item.frameFormat}`;
          pixi[type][element.id][`${dir}${src}`] = PIXI.Sprite.from(src);

          pixi[type][element.id][`${dir}${src}`].x =
            preSrc === 'l/'
              ? width + width * ((amplitudeFactor - 1) / 2) - width * amplitudeFactor * (preSrc !== '' ? 0.5 : 1)
              : x - width * ((amplitudeFactor - 1) / 2);
          pixi[type][element.id][`${dir}${src}`].y = y - width * ((amplitudeFactor - 1) / 2);

          pixi[type][element.id][`${dir}${src}`].width = width * amplitudeFactor * (preSrc !== '' ? 0.5 : 1);
          pixi[type][element.id][`${dir}${src}`].height = height * amplitudeFactor;
          pixi[type][element.id][`${dir}${src}`].visible = false;
          container.addChild(pixi[type][element.id][`${dir}${src}`]);
        });
        const idInterval = `interval-${dir}-${item.id}-${element.id}`;
        if (hashIntervals[element.id][idInterval]) clearInterval(hashIntervals[element.id][idInterval]);
        let currentFrame = 0;
        hashIntervals[element.id][idInterval] = setInterval(() => {
          currentFrame++;
          if (!pixi[type][element.id]) return clearInterval(hashIntervals[element.id][idInterval]);
          range(0, item.frames).map((i) => {
            const src = `/items/${item.id}/${preSrc}${i}.${item.frameFormat}`;
            if (!pixi[type][element.id][`${dir}${src}`]) return clearInterval(hashIntervals[element.id][idInterval]);
            pixi[type][element.id][`${dir}${src}`].visible =
              i === currentFrame && params[type][element.id].direction === dir;
          });
          if (currentFrame === item.frames) currentFrame = -1;
        }, item.frameTimeInterval);
      });

      break;

    default:
      break;
  }
};

const removeItemDisplayLogic = (element, item) => {
  // console.error('removeItemDisplayLogic', item);
  const { type } = element;
  switch (item.displayLogic) {
    case 'wings':
      [
        { dir: 'North', preSrc: '' },
        { dir: 'South', preSrc: '' },
        { dir: 'South East', preSrc: 'r/' },
        { dir: 'East', preSrc: 'r/' },
        { dir: 'North East', preSrc: 'r/' },
        { dir: 'South West', preSrc: 'l/' },
        { dir: 'West', preSrc: 'l/' },
        { dir: 'North West', preSrc: 'l/' },
      ].map((dirObj) => {
        const { dir, preSrc } = dirObj;
        const idInterval = `interval-${dir}-${item.id}-${element.id}`;
        if (hashIntervals[element.id][idInterval]) clearInterval(hashIntervals[element.id][idInterval]);
        delete hashIntervals[element.id][idInterval];
        range(0, item.frames).map((i) => {
          const src = `/items/${item.id}/${preSrc}${i}.${item.frameFormat}`;
          if (pixi[type][element.id][`${dir}${src}`]) {
            pixi[type][element.id][`${dir}${src}`].destroy();
            delete pixi[type][element.id][`${dir}${src}`];
          }
        });
      });
      break;

    default:
      break;
  }
};

const renderDisplayItems = (element, singleItem) => {
  const { type } = element;
  const { dim } = setAmplitudeRender(element.render);
  const container = pixi[type][element.id].container;
  element.displayItems.map(async (itemId) => {
    if (singleItem !== undefined && itemId !== singleItem.id) return;
    let item = localItemsRenderStorage.find((i) => i.id === itemId);
    if (!item) {
      const result = await serviceRequest(API_BASE + `/items/render/${itemId}`);
      if (result.data && result.data.id) {
        localItemsRenderStorage.push(result.data);
        item = result.data;
      } else {
        console.error(result);
        return;
      }
    }

    if (item.displayLogic !== undefined) return renderItemDisplayLogic(element, item);

    let currentFrame = 0;
    range(0, item.frames).map((frame) => {
      const src = `/items/${item.id}/${frame}.${item.frameFormat}`;
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
      if (!params[type][element.id] || !pixi[type][element.id][`/items/${item.id}/${currentFrame}.${item.frameFormat}`])
        return;
      pixi[type][element.id][`/items/${item.id}/${currentFrame}.${item.frameFormat}`].visible = false;
      currentFrame++;
      if (currentFrame > item.frames) currentFrame = 0;
      if (!params[type][element.id] || !pixi[type][element.id][`/items/${item.id}/${currentFrame}.${item.frameFormat}`])
        return;
      if (element.life > 0)
        pixi[type][element.id][`/items/${item.id}/${currentFrame}.${item.frameFormat}`].visible = true;
    }, item.frameTimeInterval);
  });
};

const removeDisplayItem = (element, itemId) => {
  const item = localItemsRenderStorage.find((i) => i.id === itemId);

  if (item.displayLogic !== undefined) return removeItemDisplayLogic(element, item);

  const { type } = element;
  if (item) {
    range(0, item.frames).map((frame) => {
      const src = `/items/${item.id}/${frame}.${item.frameFormat}`;
      pixi[type][element.id][src].destroy();
      delete pixi[type][element.id][src];
    });
    if (hashIntervals[element.id][item.id]) clearInterval(hashIntervals[element.id][item.id]);
    delete hashIntervals[element.id][item.id];
  }
};
