if (!logicStorage['logout']['engineMap'])
  logicStorage['logout']['engineMap'] = () => {
    s('.btn-graphics-engine').remove();
    s('graphics-engine').remove();
    guiSections = guiSections.filter((g) => g !== 'graphics-engine');
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
let grillMode = false;
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

guiSections.push('graphics-engine');
append(
  'common-menu',
  /*html*/ `

<menu-button class='in custom-cursor btn-graphics-engine'>
    <div class='abs center'>
        Graphics Engine
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
          .map(
            (x) => /*html*/ `
                <div class='in fll cell-adj-link custom-cursor'>
                   <!-- ${x},${y} -->
                </div>    
    `
          )
          .join('')}
            
        </div>
        `
    )
    .join('');
};

prepend(
  'gui-layer',
  /*html*/ `

  <graphics-engine style='display: none'>
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
        border: 1px solid yellow;
        box-sizing: border-box;
        font-size: 7px;
      }
      .cell-adj-link:hover {
        border: 1px solid red;
      }
    </style>
     <style class='style-engineMap-cell'></style>
     <style class='style-engineMap-cell-select'></style>
     <style class='style-engineMap-grill'></style>
    <sub-content-gui class='in'>
          <div class='in title-section'>Graphics Engine</div>
    </sub-content-gui>
    
    <div class='in engineMap-content-menu'>
      <div class='in engineMap-content-top-menu'>
        <input type='color' class='inl engineMap-input-color'>
        <button class='inl custom-cursor engineMap-paint-mode'>
          paint <span style='color: green'>on</span>
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-solid'>
          solid <span style='color: red'>off</span>
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-copy'>
          copy
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-paste'>
          paste
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-clean'>
          clean
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-grill'>
          grill <span style='color: green'>on</span>
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-png'>
          download png
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-svg'>
          download svg
        </button>
        <button class='inl engineMap-btn custom-cursor engineMap-quadrant'>
          quadrant <span style='color: red'>off</span>
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
        <div class='in engineMap-engine-content-title'>biome engine</div>
          <button class='inl engineMap-btn custom-cursor engineMap-gen-biome'>
               generate biome
          </button>
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
          <button class='inl custom-cursor adjacent-link-btn'>load</button>
        </div>
        <div class='fl'>
          ${range(1, 9)
            .map(
              (i) => /*html*/ `
              <adjancen-map-link class='in fll'>
                  ${[2, 4, 5, 6, 8].includes(i) ? renderAjcLinkGrid(i) : ''}
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

  </graphics-engine>


`
);

intanceMenuBtns();

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

const grillModeChange = () => {
  if (grillMode) {
    grillMode = false;
    htmls('.style-engineMap-grill', '');
    htmls('.engineMap-grill', `grill <span style='color: red'>off</span>`);
    return;
  }
  grillMode = true;
  htmls(
    '.style-engineMap-grill',
    /*css*/ `
    engineMap-cell {
      border: 1px solid gray;
    }
  `
  );
  htmls('.engineMap-grill', `grill <span style='color: green'>on</span>`);
};
grillModeChange();

s('.engineMap-copy').onclick = () => engineMapCopy();
s('.engineMap-paste').onclick = () => engineMapPaste();
s('.engineMap-clean').onclick = () => renderGfxGrid();
s('.engineMap-grill').onclick = () => grillModeChange();

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
  const result = await mapServices.getAdjMaps(s(`.adjacent-link-input`).value);
  renderNotification(result.status, result.data.message);
};
