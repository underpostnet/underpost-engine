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
  if (!s(`.item-modal-${item.id}`)) {
    append(
      'body',
      /*html*/ `

        <div class='abs center fix item-modal item-modal-${item.id}'>
                ${renderLang(item.name)}
                <br>
                <button class='close-item-modal-${item.id} custom-cursor'> close </button>
        </div>
    
    `
    );
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
        data: result.data,
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
