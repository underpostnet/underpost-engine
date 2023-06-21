const map = () => {
  let countDisplayRow = 0;
  let rowIni = '';
  let rowEnd = '';
  const limitCellRow = 2;
  return /*html*/ `
    <map style='display: none'>
        <sub-content-gui class='in'>

                <div class='in title-section'>${renderLang({ es: 'Mapa', en: 'Map' })}</div>
                
                <div class='in'>
                  ${range(0, globalInstancesMapData.length - 1)
                    .map((index) => {
                      const mapData = globalInstancesMapData.find((x) => x.position === index);

                      if (countDisplayRow === limitCellRow + 1) countDisplayRow = 0;
                      if (countDisplayRow === 0) {
                        rowIni = `<div class='fl'>`;
                        rowEnd = '';
                      } else if (countDisplayRow === limitCellRow) {
                        rowIni = ``;
                        rowEnd = `</div>`;
                      } else {
                        rowIni = ``;
                        rowEnd = ``;
                      }
                      countDisplayRow++;
                      setTimeout(() => {
                        instanceMapTypeStatus(
                          `.resume-info-map-${mapData.name}`,
                          'center',
                          '',
                          mapData.name,
                          mapData.types
                        );
                        s(`.map-cell-${mapData.name}`).onclick = () => renderMapModal(mapData);
                      });
                      return /*html*/ `
                          ${rowIni}
                            <div class='in fll map-cell custom-cursor'>
                                <img class='in map-img' src='/tiles/${mapData.name}.png'>
                                <div class='abs center map-hover-gfx map-cell-${mapData.name}' style='${borderChar(
                        1,
                        'black'
                      )}'>
                                      <div class='abs center resume-info-map-${mapData.name}'>
                                      </div>
                                      <div class='gps-map-cell-${mapData.name}'>
                                      </div>
                                      <div class='noti-content-map-${mapData.name}'>
                                      </div>
                                </div>
                            </div>   
                          ${rowEnd}                     
                        `;
                    })
                    .join('')}
                </div>

        </sub-content-gui>
    </map>
    `;
};

const updateMapGPS = () => {
  if (s(`.gps-map-cell-${mapMetaData.map}`) && mapMetaData.map) htmls(`.gps-map-cell-${mapMetaData.map}`, '');
  setTimeout(() => {
    if (s(`.gps-map-cell-${mapMetaData.map}`))
      htmls(
        `.gps-map-cell-${mapMetaData.map}`,
        /*html*/ `
        <!-- <img src='/icons/400x400/gps.png' class='abs center gps-icon'>  -->
        <div class='abs center gps-map-dash'>
        
        </div>
   `
      );
  });
};

const setNotiContentMap = () => {
  const successQuests = elements['user'].find((e) => e.id === socket.id)
    ? elements['user'].find((e) => e.id === socket.id).successQuests
    : [];
  globalInstancesMapData.map((mapData) => {
    let countQuest = 0;
    mapData.quests.map((quest) => {
      if (!successQuests.includes(quest.id)) countQuest++;
    });
    if (countQuest > 0 && s(`.noti-content-map-${mapData.name}`))
      htmls(
        `.noti-content-map-${mapData.name}`,
        /*html*/ `
          <div class='abs center noti-circle noti-circle-map'>
            <div class='abs center'>
                ${countQuest}
            </div>
          </div>
    `
      );
    else if (s(`.noti-content-map-${mapData.name}`)) htmls(`.noti-content-map-${mapData.name}`, '');
  });
};

const instanceMapTypeStatus = (selector, styleClass, topHTML, map, types) => {
  const titleMap = renderInstanceTitle({ name_map: map ? map : mapMetaData.map }).split('|');
  htmls(
    selector,
    /*html*/ `
    <div class='fix map-type-status-content ${styleClass}'>
          <div class='abs center'>
             ${topHTML}
            <span style='color: black; ${borderChar(1, 'yellow')}'>
              ${titleMap[0]}
            </span>
            <br><br>
            ${(types ? types : mapMetaData.types)
              .map(
                (t, i) => /*html*/ `
                <span class='map-type-${t}'> 
                  ${t.toUpperCase()}
                </span>
                ${i !== mapMetaData.types.length - 1 ? `` : ''}
            `
              )
              .join('')}
              <br>
              zone
          </div>
    </div>
  `
  );
};

const renderMapModal = (mapData) => {
  if (mapData === undefined) mapData = globalInstancesMapData.find((m) => m.name === mapMetaData.map);
  const bodyModal = /*html*/ `
  <div class='in modal-item-header'>
          <!--
          <div class='in fll modal-item-header-col'>
            
          </div>
          <div class='in fll modal-item-header-col'>
                
          </div>
          -->
          <div class='abs center modal-item-header-col-${mapData.name}'>

          </div>
          <div class='abs btn-close-modal-item custom-cursor close-map-modal-${mapData.name}'>
              <div class='abs center'>
                  <img class='inl icons-close-modal-item' src='/icons/200x200/cross.gif'>
              </div>
          </div>
  </div>
  <div class='fl'>
    <button class='in fll custom-cursor menu-btn-modal-map menu-btn-map-${mapData.name} active-btn-map-modal-white'>
      ${renderLang({ es: 'Mapa', en: 'Map' })}
    </button>
    <button class='in fll custom-cursor menu-btn-modal-map menu-btn-quest-${mapData.name}'>
      ${renderLang({ es: 'Logros', en: 'Achievements' })}
    </button>
  </div>
  <div class='in modal-item-stats'>
      <img class='in body-map-modal-tab-map-${mapData.name} quest-map-modal-body map-img-modal' src='/tiles/${
    mapData.name
  }.png'>
      <div class='in body-map-modal-tab-quest-${mapData.name} quest-map-modal-body' style='display: none'>
            ${mapData.quests.map((q) => ` > ${renderLang(q.title)} `).join('<br>')}
      </div>
  </div>

  `;
  if (!s(`.map-modal-${mapData.name}`)) {
    append(
      'body',
      /*html*/ `

        <div class='abs center fix custom-cursor item-modal map-modal-${mapData.name}'>
            ${bodyModal}                
        </div>
    
    `
    );
  } else htmls(`.map-modal-${mapData.name}`, bodyModal);
  dragDrop(`.map-modal-${mapData.name}`);
  s(`.close-map-modal-${mapData.name}`).onclick = () => {
    s(`.map-modal-${mapData.name}`).remove();
  };
  instanceMapTypeStatus(`.modal-item-header-col-${mapData.name}`, 'center', '', mapData.name, mapData.types);
  let currentBtnModalInstance = 'map';
  ['map', 'quest'].map((tab) => {
    s(`.menu-btn-${tab}-${mapData.name}`).onclick = () => {
      if (currentBtnModalInstance !== tab) {
        s(`.menu-btn-${currentBtnModalInstance}-${mapData.name}`).classList.remove('active-btn-map-modal-white');
        s(`.body-map-modal-tab-${currentBtnModalInstance}-${mapData.name}`).style.display = 'none';
        currentBtnModalInstance = `${tab}`;
        s(`.menu-btn-${currentBtnModalInstance}-${mapData.name}`).classList.add('active-btn-map-modal-white');
        s(`.body-map-modal-tab-${currentBtnModalInstance}-${mapData.name}`).style.display = 'block';
      }
    };
  });
};
