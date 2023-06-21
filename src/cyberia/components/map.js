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
                        s(`.map-cell-${mapData.name}`).onclick = () => {};
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
      if (!successQuests.includes(quest)) countQuest++;
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
