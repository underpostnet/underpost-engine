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

                      return /*html*/ `
                          ${rowIni}
                            <div class='in fll map-cell custom-cursor'>
                                <img class='in map-img' src='/tiles/${mapData.name}.png'>
                                <div class='abs center map-hover-gfx' style='${borderChar(1, 'black')}'>
                                      <div class='abs center'>
                                          ${renderInstanceTitle({ name_map: mapData.name })
                                            .replaceAll('|', '')
                                            .replaceAll('CYBERIA', '')}
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
