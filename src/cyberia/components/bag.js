let mainUserBag = [];
let localItemsStorage = [];

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

const renderItemCount = (valueID, value) => {
  return /*html*/ `
      <div class='abs count-item-text' style='${borderChar(2, 'black')}'>
         <div class='abs center'>
              <span class='inl x-count-item-text'>X</span>
              <span class='${valueID}'>${getK(value)}</span>
          </div>
      </div>
  `;
};

const renderItemModal = (item) => {
  let statsRender = '';
  let equipmentBtn = '';
  switch (item.itemType) {
    case 'currency':
      break;
    case 'equipment':
      statsRender = /*html*/ `
        <div class='in stats-content-item-modal'>
              ${renderStatsGrid(item.stats)}
        </div>
      `; // btn-item-equip
      equipmentBtn = /*html*/ `
          <br>
          <button class='inl custom-cursor item-equip-${item.id}'>
              ${renderLang({ es: 'Equipar', en: 'Equip' })}
          </button>
      
      `;
      setTimeout(() => {
        s(`.item-equip-${item.id}`).onclick = () => {
          console.log('equip', item);
        };
      });
    default:
      break;
  }
  if (!s(`.item-modal-${item.id}`)) {
    append(
      'body',
      /*html*/ `

        <div class='abs center fix custom-cursor item-modal item-modal-${item.id}'>
                <br><br>
                ${renderLang(item.name)}
                <br>
                <span style='color: yellow; font-size: 7px'>
                    [${item.itemType.toUpperCase()}]
                </span>
                <br><br>
                <span style='font-size: 10px'>X</span><span style='color: yellow; font-size: 12px'>${getK(
                  item.count()
                )}</span>
                <br><br>
                <img class='inl item-modal-img' src='/items/${item.id}/animation.gif'>

                <div class='abs btn-close-modal-item custom-cursor close-item-modal-${item.id}'>
                    <div class='abs center'>
                        <img class='inl icons-close-modal-item' src='/icons/200x200/cross.gif'>
                    </div>
                </div>

                ${statsRender}

                ${equipmentBtn}
                
        </div>
    
    `
    );
    dragDrop(`.item-modal-${item.id}`);
    s(`.close-item-modal-${item.id}`).onclick = () => {
      s(`.item-modal-${item.id}`).remove();
    };
  }
};

const newInstanceBagItems = async (items) => {
  mainUserBag = [
    renderKoynLogo(
      elements['user'].find((e) => e.id === socket.id) ? elements['user'].find((e) => e.id === socket.id).koyn : 0,
      false,
      'bag-koyn-indicator'
    ),
    renderKoynLogo(0, 'crypto', 'bag-cryptokoyn-indicator'),
  ];
  for (item of items) {
    let result;
    const localItem = localItemsStorage.find((i) => i.id === item.id);
    if (localItem) {
      result = {
        status: 'success',
        data: localItem,
      };
    } else {
      result = await serviceRequest(API_BASE + `/items/${item.id}`);
      localItemsStorage.push(result.data);
    }
    Object.keys(result.data.name).map((langKey) => {
      result.data.name[langKey] = result.data.name[langKey].replaceAll(' ', '<br>');
    });
    console.log('bag renderItem', result);
    if (result.status === 'success') {
      mainUserBag.push({
        render: () => /*html*/ `
          <div class='abs center'>
            <img src='/items/${item.id}/animation.gif' class='inl item-bag-icon'>
          </div> 
          <div class='abs center item-bag-style-text'>
              ${renderLang(result.data.name)}
          </div>
          ${renderItemCount(`bag-count-${item.id}`, item.count)}   
          `,
        data: {
          count: () =>
            elements.user.find((e) => e.id === socket.id)
              ? elements.user.find((e) => e.id === socket.id).items.find((i) => i.id === item.id).count
              : 0,
          ...result.data,
        },
      });
    }
  }
  htmls('.grid-bag', '');
  let indexCell = 0;
  range(0, 3).map((iRow) => {
    append(
      '.grid-bag',
      /*html*/ `
       <div class='fl grid-row-${iRow}'></div>    
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
        `.grid-row-${iRow}`,
        /*html*/ `
        <div class="in fll grid-cell custom-cursor ${
          mainUserBag[currentIndex] ? 'grid-cell-' + mainUserBag[currentIndex].data.id : ''
        }">
             ${mainUserBag[currentIndex] ? mainUserBag[currentIndex].render() : ''}
        </div>
        `
      );
      indexCell++;
    });
  });
};

const bag = () => {
  return /*html*/ `
    <bag style='display: none'>
      <sub-content-gui class='in'>

            <div class='in title-section'>${renderLang({ es: 'Mochila', en: 'Bag' })}</div>
            
            <div class='in grid-bag'> </div>

      </sub-content-gui>
    </bag>
    `;
};

const renderDisplayItems = (element) => {
  const { type } = element;
  const { dim } = setAmplitudeRender(element.render);
  const container = pixi[type][element.id].container;
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
};
