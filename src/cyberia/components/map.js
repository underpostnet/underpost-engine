const renderMainMap = (selector) => {
  if (selector === undefined) selector = '.main-map-render-content';
  // const centerMapPosition = mapMetaData.position;
  htmls(
    selector,
    range(centerMapPosition[1] - rangeMapView, centerMapPosition[1] + rangeMapView)
      .map(
        (yIndex) => /*html*/ `
        <div class='fl'>
          ${range(centerMapPosition[0] - rangeMapView, centerMapPosition[0] + rangeMapView)
            .map((xIndex) => {
              let mapData = mapMetaData.globalInstancesMapData.find(
                (x) => x.position && x.position[0] === xIndex && x.position[1] === yIndex
              );
              let voidMap = false;
              if (!mapData) {
                voidMap = true;
                mapData = {
                  name: 'void',
                };
              }

              setTimeout(() => {
                if (voidMap) return;
                instanceMapTypeStatus(`.resume-info-map-${mapData.name}`, 'center', '', mapData.name, mapData.types);
                s(`.map-cell-${mapData.name}`).onclick = () => renderMapModal(mapData);
              });

              return /*html*/ `
              <div class='in fll map-cell custom-cursor map-cell-${xIndex}-${yIndex}'>
                  <img class='in map-img' src='/tiles/${mapData.name}.png'>
                ${
                  !voidMap
                    ? /*html*/ `
                  <div class='abs center map-hover-gfx map-cell-${mapData.name}' style='${borderChar(1, 'black')}'>
                        <div class='abs center resume-info-map-${mapData.name}'>
                        </div>
                        <div class='gps-map-cell-${mapData.name}'>
                        </div>
                        <div class='noti-content-map-${mapData.name}'>
                        </div>
                  </div>
                `
                    : ''
                }
              </div>        
            `;
            })
            .join('')}
        </div>`
      )
      .join('')
  );
  const gpsMap = mapMetaData.parentMapData ? mapMetaData.parentMapData.name_map : mapMetaData.map;
  if (s(`.gps-map-cell-${gpsMap}`))
    htmls(
      `.gps-map-cell-${gpsMap}`,
      /*html*/ `
    <!-- <img src='/icons/400x400/gps.png' class='abs center gps-icon'>  -->
    <div class='abs center gps-map-dash'>
    
    </div>
`
    );
  instanceMapTypeStatus(
    'map-type-status',
    'map-type-status-content-gui',
    /*html*/ `
    <span style='font-size: 5px; color: white'>${getInstanceName()}</span>
    <br><br>
    `
  );
  s('map-type-status').onclick = () => renderMapModal();
  renderMapsQuests();
};

const map = () => {
  return /*html*/ `
    <map style='display: none'>
        <sub-content-gui class='in'>

                <div class='in title-section'>${renderLang({ es: 'Mapa', en: 'Map' })}</div>
                
                <div class='in config-row'>
                  <div class='fl'>
                    <div class='in fll config-col'>
                      <div class='in config-col-content'>
                          ${renderLang({ es: 'Información de Mapa', en: 'Map Info' })}
                      </div>
                    </div>
                    <div class='in fll config-col'>
                      <div class='in config-col-content'>
                        <div class='inl toggle-switch-content custom-cursor'>
                            ${renderToggleSwitch({
                              factor: 35,
                              id: 'map-info-toggle',
                              checked: true,
                              label: ['', ''],
                              activeColor: 'yellow',
                              onChange: (state) => {
                                if (state) {
                                  if (s('.style-hide-map-cell-info')) s('.style-hide-map-cell-info').remove();
                                  return;
                                }
                                append(
                                  'body',
                                  /*html*/ `
                                  <style class='style-hide-map-cell-info'>
                                  .map-hover-gfx {
                                    display: none !important;
                                  }
                                  </style>
                                `
                                );
                              },
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class='in main-map-render-content'>

                </div>

        </sub-content-gui>
    </map>
    `;
};

let currentQuestsStatusNoti = [];
const setNotiContentMap = () => {
  currentQuestsStatusNoti = [];
  const successQuests = elements['user'].find((e) => e.id === socket.id)
    ? elements['user'].find((e) => e.id === socket.id).successQuests
    : [];
  mapMetaData.globalInstancesMapData.map((mapData) => {
    let dataQuests = [];
    mapData.quests.map((quest) => {
      if (!successQuests.includes(quest.id)) dataQuests.push(quest);
    });
    if (dataQuests.length > 0 && s(`.noti-content-map-${mapData.name}`))
      htmls(
        `.noti-content-map-${mapData.name}`,
        /*html*/ `
          <div class='abs center noti-circle noti-circle-map'>
            <div class='abs center'>
                ${dataQuests.length}
            </div>
          </div>
    `
      );
    else if (s(`.noti-content-map-${mapData.name}`)) htmls(`.noti-content-map-${mapData.name}`, '');
    if (dataQuests.length > 0)
      currentQuestsStatusNoti.push({
        dataQuests,
        map: mapData.name,
      });
  });
  console.log('currentQuestsStatusNoti', currentQuestsStatusNoti);
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
  let currentMapModalDisplay = 'map';
  if (mapData === undefined) mapData = mapMetaData.globalInstancesMapData.find((m) => m.name === mapMetaData.map);
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
  <div class='in main-dropdown-content modal-map-dropdown-content'>
    ${renderDropDown({
      id: `dropdow-map-modal-${mapData.name}`,
      optionCustomClass: 'custom-cursor',
      style_dropdown_option: `
          background: black;
          padding: 10px;
          z-index: 1;
        `,
      label: renderLang({ es: 'Mapa', en: 'Map' }),
      data: [
        {
          display: renderLang({ es: 'Mapa', en: 'Map' }),
          value: 'map',
        },
        {
          display: renderLang({ es: 'Logros', en: 'Achievements' }),
          value: 'quest',
        },
      ],
      onClick: (value) => {
        console.log(`dropdow-map-modal-${mapData.name}`, value);
        s(`.body-map-modal-tab-${currentMapModalDisplay}-${mapData.name}`).style.display = 'none';
        currentMapModalDisplay = `${value}`;
        s(`.body-map-modal-tab-${currentMapModalDisplay}-${mapData.name}`).style.display = 'block';
      },
    })}
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
};
