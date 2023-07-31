if (!logicStorage['logout']['engineMap'])
  logicStorage['logout']['engineMap'] = () => {
    s('.btn-map-graphics-engine').remove();
    s('map-graphics-engine').remove();
    guiSections = guiSections.filter((g) => g !== 'map-graphics-engine');
    intanceMenuBtns();
    logicStorage['logout']['engineMap'] = undefined;
    delete logicStorage['logout']['engineMap'];
    logicStorage['css-controller']['engineMap'] = undefined;
    delete logicStorage['css-controller']['engineMap'];
    logicStorage['key-down']['engineMap'] = undefined;
    delete logicStorage['key-down']['engineMap'];
  };

let currentColorCell = 'black';
let currentSizeCell = 0;
let mouseDown = false;
let paintMode = true;
let gridMode = false;
let quadrantMode = false;
let objectQuadrantMode = false;
let cleanQuadranObject = false;
let currentDirectionAdjacentMap = undefined;
let currentAdjacentMapData = undefined;
let solidMode = 0;
let engineMapLastX = 0;
let engineMapLastY = 0;
let globalPaintStorage = {};
let globalSolidStorage = {};
let globalMapObjectStorage = {};
const engineMapCellPixelFactor = 3;
const dimAjcMap = 500;
const adjMapEngineIndex = [2, 4, 5, 6, 8];
let currentAjcLinkGridData = {};

let setOriginGateMode = false;

let setFromOriginGate = true;
let setToOriginGate = false;
let inputGateData;

guiSections.push('map-graphics-engine');
append(
  'common-menu',
  /*html*/ `

<menu-button class='in custom-cursor btn-map-graphics-engine'>
    <div class='abs center'>
        Map Engine
    </div>
</menu-button>

`
);

const renderMapObjectData = (point) => {
  return /*html*/ `
  <div style='font-size: 8px;'>
    ${point === 0 || (typeof point === 'object' && (point[0] === 'tmi' || point[0] === 'to-map')) ? 0 : 1}
    ${
      typeof point === 'object' && point[0] === 'tmi'
        ? `
    <br> <span style='color: red; ${borderChar(1, 'white')}'>T-${point[1]}</span>
    `
        : ''
    }
    ${
      typeof point === 'object' && point[0] === 'to-map'
        ? `
    <br> <span style='color: blue; ${borderChar(1, 'white')}'>G-${point[3]}-${point[1]}</span>
    `
        : ''
    }
  </div>
  `;
};

const renderAjcLinkGrid = (i) => {
  const maxRange = maxRangeMap() - 1;
  return range(0, maxRange)
    .map(
      (y) => /*html*/ `
        <div class='fl'>
        ${range(0, maxRange)
          .map((x) => {
            setTimeout(() => {
              s(`.cell-adj-link-${i}-${x}-${y}`).onclick = async () => {
                let currentMapData;
                let maxIdTerminal = -1;
                let toMapData = ['to-map'];
                switch (i) {
                  case 2:
                    if (currentAjcLinkGridData[2]) {
                      toMapData.push(currentAjcLinkGridData[2].name_map);
                      toMapData.push('up');
                      currentMapData = currentAjcLinkGridData[2];
                    }
                    break;
                  case 8:
                    if (currentAjcLinkGridData[8]) {
                      toMapData.push(currentAjcLinkGridData[8].name_map);
                      toMapData.push('down');
                      currentMapData = currentAjcLinkGridData[8];
                    }
                    break;
                  case 6:
                    if (currentAjcLinkGridData[6]) {
                      toMapData.push(currentAjcLinkGridData[6].name_map);
                      toMapData.push('right');
                      currentMapData = currentAjcLinkGridData[6];
                    }
                    break;
                  case 4:
                    if (currentAjcLinkGridData[4]) {
                      toMapData.push(currentAjcLinkGridData[4].name_map);
                      toMapData.push('left');
                      currentMapData = currentAjcLinkGridData[4];
                    }
                    break;
                  case 5:
                    if (currentAjcLinkGridData[5]) {
                      toMapData.push(currentAjcLinkGridData[5].name_map);
                      currentMapData = currentAjcLinkGridData[5];
                    }
                    break;
                  default:
                    break;
                }
                if (setOriginGateMode && setFromOriginGate) {
                  setFromOriginGate = false;
                  setToOriginGate = true;

                  inputGateData = newInstance({
                    name_map: currentMapData.name_map,
                    x,
                    y,
                  });
                } else if (setOriginGateMode && setToOriginGate) {
                  currentMapData.matrix.map((y) =>
                    y.map((x) => {
                      if (typeof x === 'object' && x[0] === 'tmi' && maxIdTerminal < x[1]) maxIdTerminal = x[1];
                    })
                  );
                  maxIdTerminal++;
                  toMapData.push(maxIdTerminal);

                  const bodyRequest = {
                    gate: {
                      from: inputGateData,
                      to: toMapData,
                    },
                    terminal: {
                      from: {
                        name_map: currentMapData.name_map,
                        x,
                        y,
                      },
                      to: ['tmi', toMapData[3]],
                    },
                  };

                  htmls('.gate-terminal-json-info', JSON.stringify(bodyRequest, null, 4));
                  const result = await mapServices.setOriginGatea(bodyRequest);
                  renderNotification(result.status, result.data.message);

                  s(`.adjacent-link-input`).value = inputGateData.name_map;
                  s(`.adjacent-link-btn`).click();

                  s(`.engineMap-set-origin-gate`).click();
                }
                htmls(
                  '.info-adj-map-click',
                  `
                ---------------------------------------------
                TO MAP DATA:
                ---------------------------------------------
                ${JSON.stringify(toMapData, null, 4)}
                ---------------------------------------------
                FROM ORIGIGIN GATE:
                ---------------------------------------------
                ${JSON.stringify([x, y], null, 4)}
                `
                );
              };
            });
            return /*html*/ `
              <div class='in fll cell-adj-link custom-cursor cell-adj-link-${i}-${x}-${y}'>
                 <!-- ${x},${y} -->
              </div>    
  `;
          })
          .join('')}
            
        </div>
        `
    )
    .join('');
};

prepend(
  'gui-layer',
  /*html*/ `

  <map-graphics-engine style='display: none'>
    <style>
      engineMap-grid {
        margin-bottom: 10px;
      }
      engineMap-cell {
        box-sizing: border-box;
        background: black;
      }
      engineMap-cell:hover {
        border: 1px solid white;
      }
      .engineMap-content-menu {
        margin: 5px;
      }
      .engineMap-input-color {
        width: 100px;
        padding: 0px;
      }
      .engineMap-content-top-menu {
        margin-bottom: 5px;
      }
      .engineMap-btn {
        margin: 3px;
        font-size: 8px;
      }
      .engineMap-engine-content {
        border: 2px solid yellow;
        margin: 3px 3px 3px 3px;
        padding: 5px;
      }
      .engineMap-engine-content-title {
        padding: 10px;
        color: black;
        text-transform: uppercase;
        font-size: 9px;
        ${borderChar(1, 'yellow')}
      }
      .img-adj-map {
        width: 100%;
        height: 100%;
      }
      .adjacent-map-cell {
        border: 2px solid yellow;
        box-sizing: border-box;
      }
      .adjacent-map-cell:hover {
        border: 2px solid white;
      }
      quadrant-grid {
        width: 100%;
        height: 100%;
        top: 0%;
        left: 0%;
      }
      .map-admin-position-view {
        background: black;
        display: block !important;
        padding: 3px;
      }
      adjancen-map-link {
        width: ${dimAjcMap / 3}px;
        height: ${dimAjcMap / 3}px;
        border: 1px solid yellow;
        box-sizing: border-box;
      }
      .cell-adj-link {
        width: ${(dimAjcMap / 3 / maxRangeMap()) * 0.98}px;
        height: ${(dimAjcMap / 3 / maxRangeMap()) * 0.98}px;
       /* border: 1px solid #d6d6d6; */
        box-sizing: border-box;
        font-size: 7px;
      }
      .cell-adj-link:hover {
        border: 1px solid yellow;
      }
      .adjancen-map-link-img {
        top: 0%;
        left: 0%;
        width: 100%;
        height: 100%;
      }
      .engineMap-content-util-color-board {
        top: 10px;
        left: 56px;
        /* background: black; */
        background: rgba(0,0,0,0.8);
        padding: 10px;
        /* border: 2px solid yellow; */
        z-index: 2;
        /* font-size: 10px !important; */
      }
      
    </style>
     <style class='style-engineMap-cell'></style>
     <style class='style-engineMap-cell-select'></style>
     <style class='style-engineMap-grid'></style>
    <sub-content-gui class='in'>
          <div class='in title-section'>Map Engine</div>
    </sub-content-gui>
    
    <div class='in engineMap-content-menu'>
      <div class='in engineMap-content-top-menu'>
        <div class='fix engineMap-content-util-color-board custom-cursor'>
          <input type='color' class='inl engineMap-input-color'>
          <button class='inl custom-cursor engineMap-btn engineMap-copy-current-hex-color'>
              copy current hex color
          </button>
          <button class='inl engineMap-btn custom-cursor engineMap-grid'>
             grid <span style='color: red'>off</span>
          </button>
          <button class='inl engineMap-btn custom-cursor engineMap-quadrant'>
             quadrant <span style='color: red'>off</span>
          </button>
          <button class='inl engineMap-btn custom-cursor engineMap-paint-mode'>
            paint <span style='color: green'>on</span>
          </button>
          <button class='inl engineMap-btn custom-cursor engineMap-solid'>
            solid <span style='color: red'>off</span>
          </button>

          <div class='inl engineMap-engine-content'>
            <div class='inl engineMap-engine-content-title'>biome engine</div>
              <button class='inl engineMap-btn custom-cursor engineMap-gen-biome'>
                  test
              </button>
              <button class='inl engineMap-btn custom-cursor engineMap-biome-deciduous-temperate-forest'>
                  deciduous temperate forest
              </button>
              <button class='inl engineMap-btn custom-cursor engineMap-biome-color-city'>
                  color city
              </button>
            </div>
          </div>

        </div>
        <button class='inl engineMap-btn custom-cursor engineMap-copy'>
          copy
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-paste'>
          paste
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-clean'>
          clean
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-png'>
          download png
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-svg'>
          download svg
        </button>
        <div class='in'>
          size <input type='number' class='inl engineMap-size-paint' value=${currentSizeCell + 1}>
        </div> 
      </div>
      <div class='inl engineMap-engine-content'>
        <div class='in engineMap-engine-content-title'>solid json</div>
        <div class='in'>
            <button class='inl engineMap-btn custom-cursor engineMap-copy-solid-json'>
              copy
            </button>
        
            <button class='inl engineMap-btn custom-cursor engineMap-load-solid-json'>
              load 
            </button>
            <div class='in engineMap-json-display'></div>
          </div>
      </div>
      
      <div class='inl engineMap-engine-content'>
          <button class='inl engineMap-btn custom-cursor engineMap-upload'>
            upload map
          </button>
          <textarea class='engineMap-metadata-json-input' rows='7' cols='50'>
{
  "name_map": "or56m",
  "position": [5, 3],
  "types": ["pvp", "pve"],
  "safe_cords": []
}
          </textarea>
        </div>
      <div class='inl engineMap-engine-content'>
           name map
          <input type='text' class='engineMap-input-name-map-load'>
          <button class='inl engineMap-btn custom-cursor engineMap-load-map'>
            load map
          </button>
      </div>
      <div class='inl engineMap-engine-content'>
        <div class='in engineMap-engine-content-title'>color json</div>
        <div class='in'>
          <button class='inl engineMap-btn custom-cursor engineMap-copy-color-json'>
            copy
          </button>
          <button class='inl engineMap-btn custom-cursor engineMap-load-color-json'>
            load
          </button>
        </div>
      </div>
      <div class='inl engineMap-engine-content'>
          <div class='in engineMap-engine-content-title'>object engine</div>
          <button class='inl engineMap-btn custom-cursor engineMap-object-quadrant'>
            quadrant object <span style='color: red'>off</span>
          </button>
          <button class='inl engineMap-btn custom-cursor engineMap-clean-object'>
            clean object <span style='color: red'>off</span>
          </button>
            json
          <input type='text'  class='inl engineMap-json-object'>
      </div>
      <div class='in engineMap-engine-content'>
        <div class='in'>
          name map <input type='text' class='adjacent-link-input'>
          <button class='inl engineMap-btn custom-cursor adjacent-link-btn'>load</button>
          <button class='inl engineMap-btn custom-cursor engineMap-set-origin-gate'>
            set origin gate <span style='color: red'>off</span>
          </button>
          <pre class='in info-adj-map-click'>
          </pre>
          <pre class='in gate-terminal-json-info'>
          </pre>
        </div>
        <div class='fl'>
          ${range(1, 9)
            .map(
              (i) => /*html*/ `
              <adjancen-map-link class='in fll'>
                  <img class='abs adjancen-map-link-img adjancen-map-link-img-${i}' style='display: none'>
                  ${adjMapEngineIndex.includes(i) ? renderAjcLinkGrid(i) : ''}
              </adjancen-map-link>
          `
            )
            .join('')}
        </div>          
      </div>
      <div class='in engineMap-engine-content'>
      <div class='in engineMap-engine-content-title'>adjacent map engine</div>
        <div class='in'>
          name map <input type='text' class='inl engineMap-name-adjacent-map'>
        </div>
        <div class='in main-dropdown-content'>
        ${renderDropDown({
          id: 'engineMap-adjancent-map-dropdown',
          optionCustomClass: 'custom-cursor',
          style_dropdown_option: `
            background: black;
            z-index: 1;
          `,
          label: 'type adjacent map',
          data: [
            { value: 'top', display: `top` },
            { value: 'bottom', display: `bottom` },
            { value: 'right', display: `right` },
            { value: 'left', display: `left` },
          ],
          onClick: async (value) => {
            const mapData = await mapServices.getMap(s('.engineMap-name-adjacent-map').value);
            currentAdjacentMapData = mapData;

            const baseDim = s('.engineMap-0-0').offsetHeight;
            const maxPxAdjacentMapRender = baseDim * maxRangeMap() * engineMapCellPixelFactor + baseDim;
            let renderStyle = `
            width: ${maxPxAdjacentMapRender}px;
            height: ${maxPxAdjacentMapRender}px;
            `;
            s('engineMap-grid').style.top = null;
            s('engineMap-grid').style.left = null;
            switch (value) {
              case 'top':
                renderStyle += `
                  top: -${maxPxAdjacentMapRender}px;
                  left: 0px;
                `;
                s('engineMap-grid').style.top = `${maxPxAdjacentMapRender}px`;
                currentDirectionAdjacentMap = 'up';
                break;
              case 'bottom':
                renderStyle += `
                  bottom: -${maxPxAdjacentMapRender}px;
                  left: 0px;
                `;
                currentDirectionAdjacentMap = 'down';
                break;
              case 'right':
                renderStyle += `
                  top: 0px;
                  left: ${maxPxAdjacentMapRender}px;
                `;
                currentDirectionAdjacentMap = 'right';
                break;
              case 'left':
                renderStyle += `
                  top: 0px;
                  left: -${maxPxAdjacentMapRender}px;
                `;
                s('engineMap-grid').style.left = `${maxPxAdjacentMapRender}px`;
                currentDirectionAdjacentMap = 'left';
                break;
              default:
                break;
            }
            const maxRange = maxRangeMap();
            const recDim = 100 / maxRange;
            const renderAdjMap = /*html*/ `
            <div class='abs engineMap-content-img-adjacent-map' style='${renderStyle}'>
              <img
              class='abs img-adj-map' 
              src='/tiles/${s('.engineMap-name-adjacent-map').value}.png'
              >

              ${range(0, maxRange - 1)
                .map((x) =>
                  range(0, maxRange - 1)
                    .map((y) => {
                      setTimeout(() => {
                        s(`.adjacent-map-cell-${x}-${y}`).onclick = () => null;
                      });
                      return /*html*/ `
                        <div class='abs adjacent-map-cell cursor-pointer adjacent-map-cell-${x}-${y}' style='
                        width: ${recDim}%; 
                        height: ${recDim}%;
                        left: ${x * recDim}%; 
                        top: ${y * recDim}%; 
                        '>
                            ${renderMapObjectData(mapData.data.matrix[y][x])}
                        </div>
                        `;
                    })
                    .join('')
                )
                .join('')}
            </div>
            `;
            if (s('.engineMap-content-img-adjacent-map')) s('.engineMap-content-img-adjacent-map').remove();
            append('engineMap-grid', renderAdjMap);

            const mapDataModal = mapMetaData.globalInstancesMapData.find(
              (m) => m.name === s('.engineMap-name-adjacent-map').value
            );
            if (mapDataModal) renderMapModal(mapDataModal);
          },
        })}
        </div>
        <br><br>
      </div>
    </div>
   
    <engineMap-grid class='in custom-cursor'></engineMap-grid>
    <br><br>

  </map-graphics-engine>


`
);

intanceMenuBtns();

dragDrop(`.engineMap-content-util-color-board`);

const changeSizeCell = () => (currentSizeCell = s('.engineMap-size-paint').value - 1);

s('.engineMap-size-paint').onblur = () => changeSizeCell();
s('.engineMap-size-paint').oninput = () => changeSizeCell();

s('engineMap-grid').onmousedown = () => (mouseDown = true);
s('engineMap-grid').onmouseup = () => (mouseDown = false);

const renderPaint = (x, y) => {
  engineMapLastX = x;
  engineMapLastY = y;
  htmls(
    '.style-engineMap-cell-select',
    /*css*/ `
    .engineMap-${x}-${y} {
      border: 1px solid yellow;
    }
  `
  );

  if (!paintMode) return;
  s(`.engineMap-${x}-${y}`).style.background = currentColorCell;

  if (!globalPaintStorage[x]) globalPaintStorage[x] = {};
  globalPaintStorage[x][y] = currentColorCell;

  if (currentSizeCell > 0) {
    range(1, currentSizeCell).map((sizeY) => {
      range(1, currentSizeCell).map((sizeX) => {
        if (!globalPaintStorage[x + sizeX]) globalPaintStorage[x + sizeX] = {};

        if (s(`.engineMap-${x + sizeX}-${y}`)) {
          s(`.engineMap-${x + sizeX}-${y}`).style.background = currentColorCell;
          globalPaintStorage[x + sizeX][y] = currentColorCell;
        }
        if (s(`.engineMap-${x}-${y + sizeY}`)) {
          s(`.engineMap-${x}-${y + sizeY}`).style.background = currentColorCell;
          globalPaintStorage[x][y + sizeY] = currentColorCell;
        }
        if (s(`.engineMap-${x + sizeX}-${y + sizeY}`)) {
          s(`.engineMap-${x + sizeX}-${y + sizeY}`).style.background = currentColorCell;
          globalPaintStorage[x + sizeX][y + sizeY] = currentColorCell;
        }
      });
    });
  }
};

const renderGfxGrid = () => {
  if (s('quadrant-grid')) s('.engineMap-quadrant').click();
  htmls('engineMap-grid', '');
  s('engineMap-grid').style.top = null;
  s('engineMap-grid').style.left = null;
  currentDirectionAdjacentMap = undefined;
  htmls('.engineMap-json-display', '');
  globalPaintStorage = {};
  globalSolidStorage = {};
  globalMapObjectStorage = {};
  const dim = maxRangeMap() * engineMapCellPixelFactor - 1;
  range(0, dim).map((y) => {
    let render = /*html*/ `<div class='fl'>`;
    range(0, dim).map((x) => {
      setTimeout(() => {
        s(`.engineMap-${x}-${y}`).onmouseover = () => (mouseDown ? renderPaint(x, y) : null);
        s(`.engineMap-${x}-${y}`).onclick = () => renderPaint(x, y);
      });
      render += /*html*/ `
   <engineMap-cell class='in fll engineMap-${x}-${y}'></engineMap-cell> 
`;
    });
    render += /*html*/ `</div>`;
    append('engineMap-grid', render);
  });
};
renderGfxGrid();

const newColor = () => (currentColorCell = s('.engineMap-input-color').value);

s('.engineMap-input-color').onblur = newColor;
s('.engineMap-input-color').oninput = newColor;

const renderDimGfxEngine = (screenDim) => {
  const dim = screenDim.minValue * 0.02;
  htmls(
    '.style-engineMap-cell',
    /*css*/ `
    engineMap-cell {
      width: ${dim}px;
      height: ${dim}px;
    }
  
  `
  );
};
renderDimGfxEngine(dimState());

let lastPaintClipBoard = [];

const engineMapCopy = () => {
  lastPaintClipBoard = [
    {
      x: 0,
      y: 0,
      v: s(`.engineMap-${engineMapLastX}-${engineMapLastY}`).style.background,
      s: globalSolidStorage[engineMapLastX] && globalSolidStorage[engineMapLastX][engineMapLastY] ? 1 : 0,
    },
  ];
  range(1, currentSizeCell).map((sizeY) => {
    range(1, currentSizeCell).map((sizeX) => {
      if (s(`.engineMap-${engineMapLastX + sizeX}-${engineMapLastY}`))
        lastPaintClipBoard.push({
          x: sizeX,
          y: 0,
          v: s(`.engineMap-${engineMapLastX + sizeX}-${engineMapLastY}`).style.background,
          s:
            globalSolidStorage[engineMapLastX + sizeX] && globalSolidStorage[engineMapLastX + sizeX][engineMapLastY]
              ? 1
              : 0,
        });
      if (s(`.engineMap-${engineMapLastX}-${engineMapLastY + sizeY}`))
        lastPaintClipBoard.push({
          x: 0,
          y: sizeY,
          v: s(`.engineMap-${engineMapLastX}-${engineMapLastY + sizeY}`).style.background,
          s: globalSolidStorage[engineMapLastX] && globalSolidStorage[engineMapLastX][engineMapLastY + sizeY] ? 1 : 0,
        });
      if (s(`.engineMap-${engineMapLastX + sizeX}-${engineMapLastY}`))
        lastPaintClipBoard.push({
          x: sizeX,
          y: sizeY,
          v: s(`.engineMap-${engineMapLastX + sizeX}-${engineMapLastY + sizeY}`).style.background,
          s:
            globalSolidStorage[engineMapLastX + sizeX] &&
            globalSolidStorage[engineMapLastX + sizeX][engineMapLastY + sizeY]
              ? 1
              : 0,
        });
    });
  });
};

const engineMapPaste = () => {
  lastPaintClipBoard.map((pasteData) => {
    if (s(`.engineMap-${engineMapLastX + pasteData.x}-${engineMapLastY + pasteData.y}`)) {
      s(`.engineMap-${engineMapLastX + pasteData.x}-${engineMapLastY + pasteData.y}`).style.background = pasteData.v;
      if (!globalPaintStorage[engineMapLastX + pasteData.x]) globalPaintStorage[engineMapLastX + pasteData.x] = {};
      globalPaintStorage[engineMapLastX + pasteData.x][engineMapLastY + pasteData.y] = pasteData.v;
      if (!globalSolidStorage[engineMapLastX + pasteData.x]) globalSolidStorage[engineMapLastX + pasteData.x] = {};
      globalSolidStorage[engineMapLastX + pasteData.x][engineMapLastY + pasteData.y] = pasteData.s;
    }
  });
};

logicStorage['css-controller']['engineMap'] = renderDimGfxEngine;

logicStorage['key-down']['engineMap'] = () => {
  if (window.activeKey['Control'] && (window.activeKey['v'] || window.activeKey['V'])) engineMapPaste();
  if (window.activeKey['Control'] && (window.activeKey['c'] || window.activeKey['C'])) engineMapCopy();
};

s('.engineMap-quadrant').onclick = () => {
  if (quadrantMode) {
    quadrantMode = false;
    htmls('.engineMap-quadrant', `quadrant <span style='color: red'>off</span>`);
    s('quadrant-grid').remove();
    return;
  }
  quadrantMode = true;
  htmls('.engineMap-quadrant', `quadrant <span style='color: green'>on</span>`);
  const maxRange = maxRangeMap();
  const recDim = s('.engineMap-0-0').offsetHeight * engineMapCellPixelFactor * 1.025;
  append(
    'engineMap-grid',
    /*html*/ `
        <quadrant-grid class='abs'>
        ${range(0, maxRange - 1)
          .map((x) =>
            range(0, maxRange - 1)
              .map((y) => {
                setTimeout(() => {
                  s(`.quadrant-map-cell-${x}-${y}`).onclick = () => {
                    const baseX = x * engineMapCellPixelFactor;
                    const baseY = y * engineMapCellPixelFactor;
                    if (paintMode) {
                      s('.engineMap-size-paint').value = engineMapCellPixelFactor;
                      s('.engineMap-size-paint').oninput();
                      renderPaint(baseX, baseY);
                    }
                    if (cleanQuadranObject) {
                      range(0, engineMapCellPixelFactor - 1).map((sumX) =>
                        range(0, engineMapCellPixelFactor - 1).map((sumY) => {
                          if (!globalMapObjectStorage[baseX + sumX]) globalMapObjectStorage[baseX + sumX] = {};
                          globalMapObjectStorage[baseX + sumX][baseY + sumY] = undefined;
                        })
                      );
                    } else if (objectQuadrantMode) {
                      range(0, engineMapCellPixelFactor - 1).map((sumX) =>
                        range(0, engineMapCellPixelFactor - 1).map((sumY) => {
                          if (!globalMapObjectStorage[baseX + sumX]) globalMapObjectStorage[baseX + sumX] = {};
                          globalMapObjectStorage[baseX + sumX][baseY + sumY] = JSON.parse(
                            s('.engineMap-json-object').value.replaceAll("'", `"`).replaceAll('`', `"`)
                          );
                        })
                      );
                    } else {
                      range(0, engineMapCellPixelFactor - 1).map((sumX) =>
                        range(0, engineMapCellPixelFactor - 1).map((sumY) => {
                          if (!globalSolidStorage[baseX + sumX]) globalSolidStorage[baseX + sumX] = {};
                          globalSolidStorage[baseX + sumX][baseY + sumY] = solidMode;
                        })
                      );
                    }

                    s('.engineMap-quadrant').click();
                    s('.engineMap-quadrant').click();
                  };
                });
                return /*html*/ `
              <div class='abs adjacent-map-cell cursor-pointer quadrant-map-cell-${x}-${y}' style='
              width: ${recDim}px; 
              height: ${recDim}px;
              left: ${x * recDim}px; 
              top: ${y * recDim}px; 
              '>

                    ${renderMapObjectData(getCurrentJSONmap()[y][x])}

              </div>
              `;
              })
              .join('')
          )
          .join('')}
        </quadrant-grid>
  `
  );
};

s('.engineMap-object-quadrant').onclick = () => {
  if (objectQuadrantMode) {
    objectQuadrantMode = false;
    htmls('.engineMap-object-quadrant', `quadrant object <span style='color: red'>off</span>`);
    return;
  }
  objectQuadrantMode = true;
  htmls('.engineMap-object-quadrant', `quadrant object <span style='color: green'>on</span>`);
  if (cleanQuadranObject) s('.engineMap-clean-object').click();
};

s('.engineMap-paint-mode').onclick = () => {
  if (paintMode) {
    paintMode = false;
    htmls('.engineMap-paint-mode', `paint <span style='color: red'>off</span>`);
    return;
  }
  paintMode = true;
  htmls('.engineMap-paint-mode', `paint <span style='color: green'>on</span>`);
};

s('.engineMap-solid').onclick = () => {
  if (solidMode === 1) {
    solidMode = 0;
    htmls('.engineMap-solid', `solid <span style='color: red'>off</span>`);
    return;
  }
  solidMode = 1;
  htmls('.engineMap-solid', `solid <span style='color: green'>on</span>`);
};

s('.engineMap-clean-object').onclick = () => {
  if (cleanQuadranObject) {
    cleanQuadranObject = false;
    htmls('.engineMap-clean-object', `clean object <span style='color: red'>off</span>`);
    return;
  }
  cleanQuadranObject = true;
  htmls('.engineMap-clean-object', `clean object <span style='color: green'>on</span>`);
  if (objectQuadrantMode) s('.engineMap-object-quadrant').click();
};

s(`.engineMap-set-origin-gate`).onclick = () => {
  setFromOriginGate = true;
  setToOriginGate = false;
  if (setOriginGateMode) {
    setOriginGateMode = false;
    htmls(`.engineMap-set-origin-gate`, `set origin gate <span style='color: red'>off</span>`);
    return;
  }
  setOriginGateMode = true;
  htmls(`.engineMap-set-origin-gate`, `set origin gate <span style='color: green'>on</span>`);
};

const gridModeChange = () => {
  if (gridMode) {
    gridMode = false;
    htmls('.style-engineMap-grid', '');
    htmls('.engineMap-grid', `grid <span style='color: red'>off</span>`);
    return;
  }
  gridMode = true;
  htmls(
    '.style-engineMap-grid',
    /*css*/ `
    engineMap-cell {
      border: 1px solid gray;
    }
  `
  );
  htmls('.engineMap-grid', `grid <span style='color: green'>on</span>`);
};

s('.engineMap-copy').onclick = () => engineMapCopy();
s('.engineMap-paste').onclick = () => engineMapPaste();
s('.engineMap-clean').onclick = () => renderGfxGrid();
s('.engineMap-grid').onclick = () => gridModeChange();

// https://html2canvas.hertzen.com/configuration
s('.engineMap-png').onclick = () =>
  html2canvas(s('engineMap-grid'), {
    width: 575,
    height: 575,
    backgroundColor: null,
  }).then((canvas) => downloader('map.png', mimes['png'], canvas));

const getSvgRender = () => {
  const renderDim = 575;
  const recDim = renderDim / (maxRangeMap() * engineMapCellPixelFactor);
  const maxRange = maxRangeMap() * engineMapCellPixelFactor - 1;
  return /*html*/ `
  <svg title="cyberia-map" version="1.1" xmlns="http://www.w3.org/2000/svg" width="${renderDim}" height="${renderDim}">
    ${range(0, maxRange)
      .map((x) =>
        range(0, maxRange)
          .map(
            (y) => /*html*/ `
          <rect 
          width="${recDim}" 
          height="${recDim}"
          stroke="${
            globalPaintStorage[x] && globalPaintStorage[x][y] !== undefined ? globalPaintStorage[x][y] : '#000000'
          }" 
          stroke-width="1" 
          stroke-linecap="square"
          x="${x * recDim}" y="${y * recDim}" style="fill: ${
              globalPaintStorage[x] && globalPaintStorage[x][y] !== undefined ? globalPaintStorage[x][y] : '#000000'
            }" />
          `
          )
          .join('')
      )
      .join('')}
  </svg>
`;
};

s('.engineMap-svg').onclick = () => downloader('map.svg', mimes['svg'], getSvgRender());

const getCurrentJSONmap = (pixelfactor) => {
  if (pixelfactor === undefined) pixelfactor = engineMapCellPixelFactor;
  let dataJSON = [];
  const maxRange = maxRangeMap() * pixelfactor - 1;
  range(0, maxRange).map((x) =>
    range(0, maxRange).map((y) => {
      if (!dataJSON[y]) dataJSON[y] = [];
      if (globalMapObjectStorage[x] !== undefined && globalMapObjectStorage[x][y] !== undefined) {
        dataJSON[y][x] = globalMapObjectStorage[x][y];
      } else {
        dataJSON[y][x] =
          globalSolidStorage[x] !== undefined && globalSolidStorage[x][y] !== undefined ? globalSolidStorage[x][y] : 0;
      }
    })
  );
  return dataJSON
    .map((y, iy) =>
      iy % pixelfactor === 0 ? y.map((x, ix) => (ix % pixelfactor === 0 ? x : null)).filter((c) => c !== null) : null
    )
    .filter((c) => c !== null);
};

s('.engineMap-copy-solid-json').onclick = async () => {
  const renderJSON = JSONmatrix(getCurrentJSONmap());
  htmls(
    '.engineMap-json-display',
    /*html*/ `
    <pre class='in'>${renderJSON}</pre>
  
  `
  );
  await copyData(renderJSON);
  renderNotification('success', 'json copy to clipboard');
};

s('.engineMap-copy-current-hex-color').onclick = async () => {
  await copyData(s('.engineMap-input-color').value);
  renderNotification('success', 'hex color to clipboard');
};

s('.engineMap-gen-biome').onclick = () => {
  const maxRangeMapParam = maxRangeMap() * engineMapCellPixelFactor - 1;
  const centerIndex = random(0, colors.length - 1 - 2);
  const matrixColorBiome = {};

  range(0, maxRangeMapParam).map((y) => {
    range(0, maxRangeMapParam).map((x) => {
      const probColor = random(0, 99);
      if (probColor <= 1) {
        currentColorCell = colors[centerIndex - 2].hex;
      } else if (probColor <= 10) {
        currentColorCell = colors[centerIndex - 1].hex;
        // } else if (probColor <= 30) {
        //   currentColorCell = colors[centerIndex].hex;
        // } else if (probColor <= 60) {
        //   currentColorCell = colors[centerIndex + 1].hex;
      } else {
        currentColorCell = colors[centerIndex + 2].hex;
      }

      if (!matrixColorBiome[y]) matrixColorBiome[y] = {};
      matrixColorBiome[y][x] = newInstance(currentColorCell);

      renderPaint(x, y);
    });
  });

  currentColorCell = colors[centerIndex - 2].hex;
  Object.keys(matrixColorBiome).map((y) => {
    Object.keys(matrixColorBiome[y]).map((x) => {
      x = parseInt(x);
      y = parseInt(y);
      if (matrixColorBiome[y][x] === currentColorCell) {
        range(-1, 1).map((sumX) =>
          range(-3, 3).map((sumY) => {
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);
          })
        );
      }
    });
  });
};

s('.engineMap-biome-color-city').onclick = () => {
  const maxRangeMapParam = maxRangeMap() * engineMapCellPixelFactor - 1;
  const matrixColorBiome = {};
  const buildingStyles = [
    {
      name: 'blue',
      body: ['#000c2d', '#001a5e'],
      window: ['#ccce41', '#ffff4a', '#ffff99'],
    },
    {
      name: 'purple',
      body: ['#4f004f', '#620062'],
      window: ['#b83e0a', '#e44d0c', '#f47239'],
    },
  ];
  const pavementStyle = ['#373737', '#282828', '#1d1d1d', 'black'];
  // biome seeds
  range(0, maxRangeMapParam).map((y) => {
    range(0, maxRangeMapParam).map((x) => {
      if (x % engineMapCellPixelFactor === 0 && y % engineMapCellPixelFactor === 0 && random(0, 700) < 10) {
        currentColorCell = buildingStyles[random(0, buildingStyles.length - 1)].body[0];
      } else {
        const probPavement = random(0, 700);
        if (probPavement < 10) {
          currentColorCell = pavementStyle[pavementStyle.length - 1];
        } else if (probPavement < 100) {
          currentColorCell = pavementStyle[pavementStyle.length - 2];
        } else if (probPavement < 300) {
          currentColorCell = pavementStyle[pavementStyle.length - 3];
        } else {
          currentColorCell = pavementStyle[pavementStyle.length - 4];
        }
      }
      if (!matrixColorBiome[y]) matrixColorBiome[y] = {};
      matrixColorBiome[y][x] = newInstance(currentColorCell);
      renderPaint(x, y);
    });
  });

  const baseCordValidator = (x, y, maxLimitX, maxLimitY) => x >= 0 && y >= 0 && x <= maxLimitX && y <= maxLimitY;

  const buildLimitStorage = {};
  Object.keys(matrixColorBiome).map((y) => {
    Object.keys(matrixColorBiome[y]).map((x) => {
      x = parseInt(x);
      y = parseInt(y);
      buildingStyles.map((buildStyle) => {
        // builging
        if (matrixColorBiome[y][x] === buildStyle.body[0]) {
          // body
          const xFactor = random(4, 8);
          const yFactor = random(3, 10);
          const buildLimitX = engineMapCellPixelFactor * xFactor - 1;
          const buildLimitY = engineMapCellPixelFactor * yFactor - 1;

          if (!buildLimitStorage[x]) buildLimitStorage[x] = {};
          buildLimitStorage[x][y] = {
            buildLimitX,
            buildLimitY,
          };

          range(0, buildLimitX).map((sumX) =>
            range(0, buildLimitY).map((sumY) => {
              if (baseCordValidator(x + sumX, y + sumY, maxRangeMapParam, maxRangeMapParam)) {
                currentColorCell = buildStyle.body[random(0, 500) < 100 || x + sumX <= x + random(3, 7) ? 0 : 1];
                renderPaint(x + sumX, y + sumY);
              }
            })
          );
          // window
          range(0, buildLimitX).map((sumX) =>
            range(0, buildLimitY).map((sumY) => {
              if (random(0, 1) === 0) return;
              if (
                baseCordValidator(x + sumX, y + sumY, maxRangeMapParam, maxRangeMapParam) &&
                (x + sumX) % 4 === 0 &&
                (y + sumY) % 4 === 0
              ) {
                // single window area
                const xFactorWindow = random(1, 2);
                const yFactorWindow = random(1, 2);
                range(0, xFactorWindow).map((sumX0) =>
                  range(0, yFactorWindow).map((sumY0) => {
                    if (
                      baseCordValidator(x + sumX + sumX0, y + sumY + sumY0, x + buildLimitX, y + buildLimitY) &&
                      y + sumY + sumY0 < y + buildLimitY - 4 &&
                      y + sumY + sumY0 > y
                    ) {
                      currentColorCell = buildStyle.window[random(0, 2)];
                      renderPaint(x + sumX + sumX0, y + sumY + sumY0);
                    }
                  })
                );
              }
            })
          );
        }
      });
    });
  });

  Object.keys(matrixColorBiome).map((y) => {
    Object.keys(matrixColorBiome[y]).map((x) => {
      x = parseInt(x);
      y = parseInt(y);
      buildingStyles.map((buildStyle) => {
        // builging
        if (matrixColorBiome[y][x] === buildStyle.body[0]) {
          const { buildLimitX, buildLimitY } = buildLimitStorage[x][y];
          // door
          const dimDoor = 2;
          const xDoorPadding = 2;
          const xDoorCords = range(x + xDoorPadding, x + buildLimitX - xDoorPadding - dimDoor).filter(
            (n) => n % engineMapCellPixelFactor === 0
          );
          const xDoor = xDoorCords[random(0, xDoorCords.length - 1)];
          const yDoor = y + buildLimitY;
          let validDoor = true;
          // currentColorCell = 'red';
          range(0, dimDoor).map((deltaX) =>
            range(1, dimDoor + 1).map((deltaY) => {
              if (
                !baseCordValidator(xDoor + deltaX, yDoor + deltaY, maxRangeMapParam, maxRangeMapParam) ||
                !baseCordValidator(xDoor + deltaX, yDoor + deltaY, x + buildLimitX, y + buildLimitY + dimDoor + 1)
              ) {
                validDoor = false;
                return;
              }
              if (!pavementStyle.includes(globalPaintStorage[xDoor + deltaX][yDoor + deltaY])) {
                // renderPaint(xDoor + deltaX, yDoor + deltaY);
                validDoor = false;
              }
            })
          );
          if (!validDoor) return;
          currentColorCell = 'black';
          range(0, dimDoor).map((deltaX) =>
            range(0, dimDoor).map((deltaY) => {
              if (
                baseCordValidator(xDoor + deltaX, yDoor - deltaY, maxRangeMapParam, maxRangeMapParam) &&
                baseCordValidator(xDoor + deltaX, yDoor - deltaY, x + buildLimitX, y + buildLimitY)
              ) {
                renderPaint(xDoor + deltaX, yDoor - deltaY);
              }
            })
          );
        }
      });
    });
  });
};

s('.engineMap-biome-deciduous-temperate-forest').onclick = () => {
  const maxRangeMapParam = maxRangeMap() * engineMapCellPixelFactor - 1;
  const centerIndex = random(0, colors.length - 1 - 2);
  const matrixColorBiome = {};
  // phenotypes
  const treePhenotype = [
    ['#c41919', '#810202'],
    ['#aaf93e', '#e7ef46'],
  ];
  // biome seeds
  range(0, maxRangeMapParam).map((y) => {
    range(0, maxRangeMapParam).map((x) => {
      const probColor = random(0, 700);
      if (probColor <= 3) {
        // currentColorCell = colors[centerIndex - 2].hex;
        currentColorCell = '#AF5E06';
      } else if (probColor <= 22) {
        currentColorCell = '#29714c';
      } else if (probColor <= 30) {
        // currentColorCell = colors[centerIndex - 1].hex;
        currentColorCell = treePhenotype[random(0, treePhenotype.length - 1)][0];
        // } else if (probColor <= 30) {
        //   currentColorCell = colors[centerIndex].hex;
        // } else if (probColor <= 60) {
        //   currentColorCell = colors[centerIndex + 1].hex;
      } else {
        // currentColorCell = colors[centerIndex + 2].hex;
        currentColorCell = '#3bb177'; // '#339966';
      }

      if (!matrixColorBiome[y]) matrixColorBiome[y] = {};
      matrixColorBiome[y][x] = newInstance(currentColorCell);

      renderPaint(x, y);
    });
  });
  // dark lawn
  currentColorCell = '#29714c';
  Object.keys(matrixColorBiome).map((y) => {
    Object.keys(matrixColorBiome[y]).map((x) => {
      x = parseInt(x);
      y = parseInt(y);
      if (matrixColorBiome[y][x] === currentColorCell) {
        range(-3, 3).map((sumX) =>
          range(-1, 1).map((sumY) => {
            if (random(0, 8) > 2) return;
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);
          })
        );
        currentColorCell = '#349a67';
        range(-5, 5).map((sumX) =>
          range(-3, 3).map((sumY) => {
            if (random(0, 10) > 2) return;
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);
          })
        );
        currentColorCell = '#29714c';
      }
    });
  });
  // flowers
  Object.keys(matrixColorBiome).map((y) => {
    Object.keys(matrixColorBiome[y]).map((x) => {
      x = parseInt(x);
      y = parseInt(y);
      treePhenotype.map((phenoType) => {
        if (matrixColorBiome[y][x] === phenoType[0]) {
          range(-2, 2).map((sumX) =>
            range(1, 1).map((sumY) => {
              if (random(0, 1) === 0) return;
              currentColorCell = phenoType[random(0, phenoType.length - 1)];
              if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
                renderPaint(x + sumX, y + sumY);
            })
          );
        }
      });
    });
  });

  currentColorCell = '#AF5E06';
  Object.keys(matrixColorBiome).map((y) => {
    Object.keys(matrixColorBiome[y]).map((x) => {
      x = parseInt(x);
      y = parseInt(y);
      if (matrixColorBiome[y][x] === currentColorCell) {
        // shadow
        currentColorCell = '#29714c';
        range(-2, 2).map((sumX) =>
          range(4, 5).map((sumY) => {
            // if (random(0, 1) === 0) return;
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);
          })
        );
        range(-3, 3).map((sumX) =>
          range(3, 6).map((sumY) => {
            if (random(0, 1) === 0) return;
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);
          })
        );
        currentColorCell = '#349a67';
        range(-4, 4).map((sumX) =>
          range(2, 7).map((sumY) => {
            if (random(0, 10) > 1) return;
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);
          })
        );
        // tree leaves
        const selectPhenotype = treePhenotype[random(0, treePhenotype.length - 1)];
        range(-4, 4).map((sumX) =>
          range(-6, -1).map((sumY) => {
            if (random(1, 0) === 1 && (sumX > 3 || sumX < -3) && (sumY > -3 || sumY < -4)) return;
            currentColorCell = selectPhenotype[0];
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);
          })
        );
        range(-5, 5).map((sumX) =>
          range(-5, 0).map((sumY) => {
            if (random(1, 4) === 4) return;
            currentColorCell = selectPhenotype[1];
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);
          })
        );
        // rhizome
        currentColorCell = '#AF5E06';
        range(0, 0).map((sumX) =>
          range(-1, 3).map((sumY) => {
            if (random(0, 1) === 0) currentColorCell = '#975206';
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);

            currentColorCell = '#AF5E06';
          })
        );
        // roots
        [-1, 1].map((sumX) =>
          range(-1, 3).map((sumY) => {
            if (random(0, 1) === 0) return;
            if (random(0, 1) === 0) currentColorCell = '#975206';
            if (x + sumX >= 0 && y + sumY >= 0 && x + sumX <= maxRangeMapParam && y + sumY <= maxRangeMapParam)
              renderPaint(x + sumX, y + sumY);

            currentColorCell = '#AF5E06';
          })
        );
      }
    });
  });
};

const getMapColorJSON = () => {
  const renderJSON = [];
  const maxRange = maxRangeMap() * engineMapCellPixelFactor - 1;
  range(0, maxRange).map((x) =>
    range(0, maxRange).map((y) => {
      if (!renderJSON[y]) renderJSON[y] = [];
      renderJSON[y][x] =
        globalPaintStorage[x] && globalPaintStorage[x][y] !== undefined ? globalPaintStorage[x][y] : '#000000';
    })
  );
  return renderJSON;
};

s('.engineMap-copy-color-json').onclick = async () => {
  await copyData(JSONmatrix(getMapColorJSON()));
  renderNotification('success', 'json copy to clipboard');
};

const loadColorMap = (inputJSON) => {
  if (!paintMode) s('.engineMap-paint-mode').click();
  s('.engineMap-size-paint').value = 1;
  s('.engineMap-size-paint').oninput();
  const maxRange = maxRangeMap() * engineMapCellPixelFactor - 1;
  range(0, maxRange).map((x) =>
    range(0, maxRange).map((y) => {
      if (!globalPaintStorage[x]) globalPaintStorage[x] = {};
      currentColorCell = inputJSON[y][x];
      renderPaint(x, y);
    })
  );
  s('.engineMap-input-color').value = currentColorCell;
  s('.engineMap-input-color').oninput();
};

s('.engineMap-load-color-json').onclick = async () => loadColorMap(JSON.parse(await pasteData()));

const loadSolidMap = (inputJSON) => {
  const maxRange = maxRangeMap() * engineMapCellPixelFactor - 1;

  console.log('inputJSON', JSONmatrix(inputJSON));
  let inputX = 0;
  let inputY = 0;
  range(0, maxRange).map((x) => {
    if (x !== 0 && x % engineMapCellPixelFactor === 0) inputX++;
    range(0, maxRange).map((y) => {
      if (y !== 0 && y % engineMapCellPixelFactor === 0) inputY++;

      if (!globalMapObjectStorage[x]) globalMapObjectStorage[x] = {};
      if (!globalSolidStorage[x]) globalSolidStorage[x] = {};

      if (typeof inputJSON[inputY][inputX] === 'object') {
        globalMapObjectStorage[x][y] = inputJSON[inputY][inputX];
        globalSolidStorage[x][y] = 0;
      } else globalSolidStorage[x][y] = inputJSON[inputY][inputX];
    });
    inputY = 0;
  });
  if (quadrantMode) {
    s('.engineMap-quadrant').click();
    s('.engineMap-quadrant').click();
  }
};
s('.engineMap-load-solid-json').onclick = async () => loadSolidMap(JSON.parse(await pasteData()));

s('.engineMap-upload').onclick = async () => {
  const body = {
    colorData: {
      svg: getSvgRender(),
      json: getMapColorJSON(),
    },
    mapData: {
      matrix: getCurrentJSONmap(),
      ...JSON.parse(s('.engineMap-metadata-json-input').value),
    },
  };
  console.log('engineMap Upload', body);

  const result = await mapServices.upload(body);
  renderNotification(result.status, result.data.message);
};

s('.engineMap-load-map').onclick = async () => {
  const result = await mapServices.getMapDataEngine(s('.engineMap-input-name-map-load').value);
  renderNotification(result.status, result.data.message);
  loadColorMap(result.data.color);
  loadSolidMap(result.data.map.matrix);
  s('.engineMap-metadata-json-input').value = JSON.stringify(
    {
      name_map: result.data.map.name_map,
      position: result.data.map.position,
      types: result.data.map.types,
      safe_cords: result.data.map.safe_cords,
      parent: result.data.map.parent,
    },
    null,
    4
  );
};

s(`.adjacent-link-btn`).onclick = async () => {
  const nameSelectMap = s(`.adjacent-link-input`).value;
  const result = await mapServices.getAdjMaps(nameSelectMap);
  renderNotification(result.status, result.data.message);
  const mainDataMap = result.data.maps.find((m) => m.name_map === nameSelectMap);
  if (!mainDataMap) return;
  adjMapEngineIndex.map((i) => {
    let mapData;
    switch (i) {
      case 2:
        mapData = result.data.maps.find(
          (m) => mainDataMap.position[0] === m.position[0] && mainDataMap.position[1] === m.position[1] + 1
        );
        break;
      case 8:
        mapData = result.data.maps.find(
          (m) => mainDataMap.position[0] === m.position[0] && mainDataMap.position[1] === m.position[1] - 1
        );
        break;
      case 6:
        mapData = result.data.maps.find(
          (m) => mainDataMap.position[0] === m.position[0] - 1 && mainDataMap.position[1] === m.position[1]
        );
        break;
      case 4:
        mapData = result.data.maps.find(
          (m) => mainDataMap.position[0] === m.position[0] + 1 && mainDataMap.position[1] === m.position[1]
        );
        break;
      case 5:
        mapData = mainDataMap;
        break;
      default:
        break;
    }
    if (mapData) {
      currentAjcLinkGridData[i] = newInstance(mapData);
      s(`.adjancen-map-link-img-${i}`).src = `/tiles/${mapData.name_map}.PNG`;
      s(`.adjancen-map-link-img-${i}`).style.display = 'block';
    } else s(`.adjancen-map-link-img-${i}`).style.display = 'none';
  });
};
