if (!logicStorage['logout']['gfx'])
  logicStorage['logout']['gfx'] = () => {
    s('.btn-graphics-engine').remove();
    s('graphics-engine').remove();
    guiSections = guiSections.filter((g) => g !== 'graphics-engine');
    intanceMenuBtns();
    logicStorage['logout']['gfx'] = undefined;
    delete logicStorage['logout']['gfx'];
    logicStorage['css-controller']['gfx'] = undefined;
    delete logicStorage['css-controller']['gfx'];
    logicStorage['key-down']['gfx'] = undefined;
    delete logicStorage['key-down']['gfx'];
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
let gfxLastX = 0;
let gfxLastY = 0;
let globalPaintStorage = {};
let globalSolidStorage = {};
let globalMapObjectStorage = {};
const gfxCellPixelFactor = 3;

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

prepend(
  'gui-layer',
  /*html*/ `

  <graphics-engine style='display: none'>
    <style>
      gfx-grid {
        margin-bottom: 10px;
      }
      gfx-cell {
        box-sizing: border-box;
        background: black;
      }
      gfx-cell:hover {
        border: 1px solid white;
      }
      .gfx-content-menu {
        margin: 5px;
      }
      .gfx-input-color {
        width: 100px;
        padding: 0px;
      }
      .gfx-content-top-menu {
        margin-bottom: 5px;
      }
      .gfx-btn {
        margin: 3px;
      }
      .gfx-engine-content {
        border: 2px solid yellow;
        max-height: 360px;
        margin: 40px 3px 3px 3px;
        padding: 5px;
        text-align: right;
      }
      .gfx-engine-content-title {
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
    </style>
     <style class='style-gfx-cell'></style>
     <style class='style-gfx-cell-select'></style>
     <style class='style-gfx-grill'></style>
    <sub-content-gui class='in'>
          <div class='in title-section'>Graphics Engine</div>
    </sub-content-gui>
    
    <div class='in gfx-content-menu'>
      <div class='in gfx-content-top-menu'>
        <input type='color' class='inl gfx-input-color'>
        <button class='inl custom-cursor gfx-state'>
          paint <span style='color: green'>on</span>
        </button>
        <button class='inl gfx-btn custom-cursor gfx-copy'>
          copy
        </button>
        <button class='inl gfx-btn custom-cursor gfx-paste'>
          paste
        </button>
        <button class='inl gfx-btn custom-cursor gfx-clean'>
          clean
        </button>
        <button class='inl gfx-btn custom-cursor gfx-grill'>
          grill <span style='color: green'>on</span>
        </button>
        <button class='inl gfx-btn custom-cursor gfx-png'>
          download png
        </button>
        <button class='inl gfx-btn custom-cursor gfx-svg'>
          download svg
        </button>
        <button class='inl gfx-btn custom-cursor gfx-quadrant'>
          quadrant <span style='color: red'>off</span>
        </button>
        size
        <input type='number' class='inl gfx-size-paint' value=${currentSizeCell + 1}>
      </div>
      <div class='in gfx-engine-content'>
        <div class='in gfx-engine-content-title'>SOLID ENGINE</div>
        <div class='in'>
            <button class='inl gfx-btn custom-cursor gfx-json'>
              generate json
            </button>
            <button class='inl gfx-btn custom-cursor gfx-solid'>
              solid <span style='color: red'>off</span>
            </button>
            <button class='inl gfx-btn custom-cursor gfx-load-solid'>
              load json solid 
            </button>
          </div>
      </div>
      <div class='in gfx-engine-content'>
        <div class='in gfx-engine-content-title'>biome engine</div>
          <button class='inl gfx-btn custom-cursor gfx-gen-biome'>
               generate biome
          </button>
        </div>
      </div>
      <div class='in gfx-engine-content'>
        <div class='in gfx-engine-content-title'>JSON COLOR BACKUP</div>
        <div class='in'>
            json color
            <input type='text'  class='inl gfx-input-json-color'>
        </div>
        <div class='in'>
          <button class='inl gfx-btn custom-cursor gfx-copy-color-json'>
            copy matrix color json
          </button>         
          <button class='inl gfx-btn custom-cursor gfx-paste-color-json'>
            paste matrix color json
          </button>
          <button class='inl gfx-btn custom-cursor gfx-load-color-json'>
            load matrix color json
          </button>
        </div>
      </div>
      <div class='in gfx-engine-content'>
          <div class='in gfx-engine-content-title'>link engine</div>
          <button class='inl gfx-btn custom-cursor gfx-object-quadrant'>
            quadrant object <span style='color: red'>off</span>
          </button>
          <button class='inl gfx-btn custom-cursor gfx-clean-object'>
            clean object <span style='color: red'>off</span>
          </button>
            json link
          <input type='text'  class='inl gfx-json-link'>
      </div>
      <div class='in main-dropdown-content gfx-engine-content'>
      <div class='in gfx-engine-content-title'>adjacent map engine</div>
        <div class='in'>
          name map <input type='text' class='inl gfx-name-adjacent-map'>
        </div>
        <div class='in main-dropdown-content'>
        ${renderDropDown({
          id: 'gfx-adjancent-map-dropdown',
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
            const mapData = await mapServices.getMap(s('.gfx-name-adjacent-map').value);
            currentAdjacentMapData = mapData;

            const baseDim = s('.gfx-0-0').offsetHeight;
            const maxPxAdjacentMapRender = baseDim * maxRangeMap() * gfxCellPixelFactor + baseDim;
            let renderStyle = `
            width: ${maxPxAdjacentMapRender}px;
            height: ${maxPxAdjacentMapRender}px;
            `;
            s('gfx-grid').style.top = null;
            s('gfx-grid').style.left = null;
            switch (value) {
              case 'top':
                renderStyle += `
                  top: -${maxPxAdjacentMapRender}px;
                  left: 0px;
                `;
                s('gfx-grid').style.top = `${maxPxAdjacentMapRender}px`;
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
                s('gfx-grid').style.left = `${maxPxAdjacentMapRender}px`;
                currentDirectionAdjacentMap = 'left';
                break;
              default:
                break;
            }
            const maxRange = maxRangeMap();
            const recDim = 100 / maxRange;
            const renderAdjMap = /*html*/ `
            <div class='abs gfx-content-img-adjacent-map' style='${renderStyle}'>
              <img
              class='abs img-adj-map' 
              src='/tiles/${s('.gfx-name-adjacent-map').value}.png'
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
            if (s('.gfx-content-img-adjacent-map')) s('.gfx-content-img-adjacent-map').remove();
            append('gfx-grid', renderAdjMap);

            const mapDataModal = mapMetaData.globalInstancesMapData.find(
              (m) => m.name === s('.gfx-name-adjacent-map').value
            );
            if (mapDataModal) renderMapModal(mapDataModal);
          },
        })}
        </div>
        <br><br>
      </div>
    </div>
    <br>
    <div class='in gfx-json-display'></div>
    <gfx-grid class='in custom-cursor'></gfx-grid>
    <br><br>

  </graphics-engine>


`
);

intanceMenuBtns();

const changeSizeCell = () => (currentSizeCell = s('.gfx-size-paint').value - 1);

s('.gfx-size-paint').onblur = () => changeSizeCell();
s('.gfx-size-paint').oninput = () => changeSizeCell();

s('gfx-grid').onmousedown = () => (mouseDown = true);
s('gfx-grid').onmouseup = () => (mouseDown = false);

const renderPaint = (x, y) => {
  gfxLastX = x;
  gfxLastY = y;
  htmls(
    '.style-gfx-cell-select',
    /*css*/ `
    .gfx-${x}-${y} {
      border: 1px solid yellow;
    }
  `
  );

  if (!paintMode) return;
  s(`.gfx-${x}-${y}`).style.background = currentColorCell;

  if (!globalPaintStorage[x]) globalPaintStorage[x] = {};
  globalPaintStorage[x][y] = currentColorCell;

  if (currentSizeCell > 0) {
    range(1, currentSizeCell).map((sizeY) => {
      range(1, currentSizeCell).map((sizeX) => {
        if (!globalPaintStorage[x + sizeX]) globalPaintStorage[x + sizeX] = {};

        if (s(`.gfx-${x + sizeX}-${y}`)) {
          s(`.gfx-${x + sizeX}-${y}`).style.background = currentColorCell;
          globalPaintStorage[x + sizeX][y] = currentColorCell;
        }
        if (s(`.gfx-${x}-${y + sizeY}`)) {
          s(`.gfx-${x}-${y + sizeY}`).style.background = currentColorCell;
          globalPaintStorage[x][y + sizeY] = currentColorCell;
        }
        if (s(`.gfx-${x + sizeX}-${y + sizeY}`)) {
          s(`.gfx-${x + sizeX}-${y + sizeY}`).style.background = currentColorCell;
          globalPaintStorage[x + sizeX][y + sizeY] = currentColorCell;
        }
      });
    });
  }
};

const renderGfxGrid = () => {
  if (s('quadrant-grid')) s('.gfx-quadrant').click();
  htmls('gfx-grid', '');
  s('gfx-grid').style.top = null;
  s('gfx-grid').style.left = null;
  currentDirectionAdjacentMap = undefined;
  globalPaintStorage = {};
  globalSolidStorage = {};
  globalMapObjectStorage = {};
  const dim = maxRangeMap() * gfxCellPixelFactor - 1;
  range(0, dim).map((y) => {
    let render = /*html*/ `<div class='fl'>`;
    range(0, dim).map((x) => {
      setTimeout(() => {
        s(`.gfx-${x}-${y}`).onmouseover = () => (mouseDown ? renderPaint(x, y) : null);
        s(`.gfx-${x}-${y}`).onclick = () => renderPaint(x, y);
      });
      render += /*html*/ `
   <gfx-cell class='in fll gfx-${x}-${y}'></gfx-cell> 
`;
    });
    render += /*html*/ `</div>`;
    append('gfx-grid', render);
  });
};
renderGfxGrid();

const newColor = () => (currentColorCell = s('.gfx-input-color').value);

s('.gfx-input-color').onblur = newColor;
s('.gfx-input-color').oninput = newColor;

const renderDimGfxEngine = (screenDim) => {
  const dim = screenDim.minValue * 0.02;
  htmls(
    '.style-gfx-cell',
    /*css*/ `
    gfx-cell {
      width: ${dim}px;
      height: ${dim}px;
    }
  
  `
  );
};
renderDimGfxEngine(dimState());

let lastPaintClipBoard = [];

const gfxCopy = () => {
  lastPaintClipBoard = [
    {
      x: 0,
      y: 0,
      v: s(`.gfx-${gfxLastX}-${gfxLastY}`).style.background,
      s: globalSolidStorage[gfxLastX] && globalSolidStorage[gfxLastX][gfxLastY] ? 1 : 0,
    },
  ];
  range(1, currentSizeCell).map((sizeY) => {
    range(1, currentSizeCell).map((sizeX) => {
      if (s(`.gfx-${gfxLastX + sizeX}-${gfxLastY}`))
        lastPaintClipBoard.push({
          x: sizeX,
          y: 0,
          v: s(`.gfx-${gfxLastX + sizeX}-${gfxLastY}`).style.background,
          s: globalSolidStorage[gfxLastX + sizeX] && globalSolidStorage[gfxLastX + sizeX][gfxLastY] ? 1 : 0,
        });
      if (s(`.gfx-${gfxLastX}-${gfxLastY + sizeY}`))
        lastPaintClipBoard.push({
          x: 0,
          y: sizeY,
          v: s(`.gfx-${gfxLastX}-${gfxLastY + sizeY}`).style.background,
          s: globalSolidStorage[gfxLastX] && globalSolidStorage[gfxLastX][gfxLastY + sizeY] ? 1 : 0,
        });
      if (s(`.gfx-${gfxLastX + sizeX}-${gfxLastY}`))
        lastPaintClipBoard.push({
          x: sizeX,
          y: sizeY,
          v: s(`.gfx-${gfxLastX + sizeX}-${gfxLastY + sizeY}`).style.background,
          s: globalSolidStorage[gfxLastX + sizeX] && globalSolidStorage[gfxLastX + sizeX][gfxLastY + sizeY] ? 1 : 0,
        });
    });
  });
};

const gfxPaste = () => {
  lastPaintClipBoard.map((pasteData) => {
    if (s(`.gfx-${gfxLastX + pasteData.x}-${gfxLastY + pasteData.y}`)) {
      s(`.gfx-${gfxLastX + pasteData.x}-${gfxLastY + pasteData.y}`).style.background = pasteData.v;
      if (!globalPaintStorage[gfxLastX + pasteData.x]) globalPaintStorage[gfxLastX + pasteData.x] = {};
      globalPaintStorage[gfxLastX + pasteData.x][gfxLastY + pasteData.y] = pasteData.v;
      if (!globalSolidStorage[gfxLastX + pasteData.x]) globalSolidStorage[gfxLastX + pasteData.x] = {};
      globalSolidStorage[gfxLastX + pasteData.x][gfxLastY + pasteData.y] = pasteData.s;
    }
  });
};

logicStorage['css-controller']['gfx'] = renderDimGfxEngine;

logicStorage['key-down']['gfx'] = () => {
  if (window.activeKey['Control'] && (window.activeKey['v'] || window.activeKey['V'])) gfxPaste();
  if (window.activeKey['Control'] && (window.activeKey['c'] || window.activeKey['C'])) gfxCopy();
};

s('.gfx-quadrant').onclick = () => {
  if (quadrantMode) {
    quadrantMode = false;
    htmls('.gfx-quadrant', `quadrant <span style='color: red'>off</span>`);
    s('quadrant-grid').remove();
    return;
  }
  quadrantMode = true;
  htmls('.gfx-quadrant', `quadrant <span style='color: green'>on</span>`);
  const maxRange = maxRangeMap();
  const recDim = s('.gfx-0-0').offsetHeight * gfxCellPixelFactor * 1.025;
  append(
    'gfx-grid',
    /*html*/ `
        <quadrant-grid class='abs'>
        ${range(0, maxRange - 1)
          .map((x) =>
            range(0, maxRange - 1)
              .map((y) => {
                setTimeout(() => {
                  s(`.quadrant-map-cell-${x}-${y}`).onclick = () => {
                    const baseX = x * gfxCellPixelFactor;
                    const baseY = y * gfxCellPixelFactor;
                    if (paintMode) {
                      s('.gfx-size-paint').value = gfxCellPixelFactor;
                      s('.gfx-size-paint').oninput();
                      renderPaint(baseX, baseY);
                    }
                    if (cleanQuadranObject) {
                      range(0, gfxCellPixelFactor - 1).map((sumX) =>
                        range(0, gfxCellPixelFactor - 1).map((sumY) => {
                          if (!globalMapObjectStorage[baseX + sumX]) globalMapObjectStorage[baseX + sumX] = {};
                          globalMapObjectStorage[baseX + sumX][baseY + sumY] = undefined;
                        })
                      );
                    } else if (objectQuadrantMode) {
                      range(0, gfxCellPixelFactor - 1).map((sumX) =>
                        range(0, gfxCellPixelFactor - 1).map((sumY) => {
                          if (!globalMapObjectStorage[baseX + sumX]) globalMapObjectStorage[baseX + sumX] = {};
                          globalMapObjectStorage[baseX + sumX][baseY + sumY] = JSON.parse(
                            s('.gfx-json-link').value.replaceAll("'", `"`).replaceAll('`', `"`)
                          );
                        })
                      );
                    } else {
                      range(0, gfxCellPixelFactor - 1).map((sumX) =>
                        range(0, gfxCellPixelFactor - 1).map((sumY) => {
                          if (!globalSolidStorage[baseX + sumX]) globalSolidStorage[baseX + sumX] = {};
                          globalSolidStorage[baseX + sumX][baseY + sumY] = solidMode;
                        })
                      );
                    }

                    s('.gfx-quadrant').click();
                    s('.gfx-quadrant').click();
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

s('.gfx-object-quadrant').onclick = () => {
  if (objectQuadrantMode) {
    objectQuadrantMode = false;
    htmls('.gfx-object-quadrant', `quadrant object <span style='color: red'>off</span>`);
    return;
  }
  objectQuadrantMode = true;
  htmls('.gfx-object-quadrant', `quadrant object <span style='color: green'>on</span>`);
  if (cleanQuadranObject) s('.gfx-clean-object').click();
};

s('.gfx-state').onclick = () => {
  if (paintMode) {
    paintMode = false;
    htmls('.gfx-state', `paint <span style='color: red'>off</span>`);
    return;
  }
  paintMode = true;
  htmls('.gfx-state', `paint <span style='color: green'>on</span>`);
};

s('.gfx-solid').onclick = () => {
  if (solidMode === 1) {
    solidMode = 0;
    htmls('.gfx-solid', `solid <span style='color: red'>off</span>`);
    return;
  }
  solidMode = 1;
  htmls('.gfx-solid', `solid <span style='color: green'>on</span>`);
};

s('.gfx-clean-object').onclick = () => {
  if (cleanQuadranObject) {
    cleanQuadranObject = false;
    htmls('.gfx-clean-object', `clean object <span style='color: red'>off</span>`);
    return;
  }
  cleanQuadranObject = true;
  htmls('.gfx-clean-object', `clean object <span style='color: green'>on</span>`);
  if (objectQuadrantMode) s('.gfx-object-quadrant').click();
};

const grillModeChange = () => {
  if (grillMode) {
    grillMode = false;
    htmls('.style-gfx-grill', '');
    htmls('.gfx-grill', `grill <span style='color: red'>off</span>`);
    return;
  }
  grillMode = true;
  htmls(
    '.style-gfx-grill',
    /*css*/ `
    gfx-cell {
      border: 1px solid gray;
    }
  `
  );
  htmls('.gfx-grill', `grill <span style='color: green'>on</span>`);
};
grillModeChange();

s('.gfx-copy').onclick = () => gfxCopy();
s('.gfx-paste').onclick = () => gfxPaste();
s('.gfx-clean').onclick = () => renderGfxGrid();
s('.gfx-grill').onclick = () => grillModeChange();

// https://html2canvas.hertzen.com/configuration
s('.gfx-png').onclick = () =>
  html2canvas(s('gfx-grid'), {
    width: 575,
    height: 575,
    backgroundColor: null,
  }).then((canvas) => downloader('map.png', mimes['png'], canvas));

s('.gfx-svg').onclick = () => {
  const renderDim = 575;
  const recDim = renderDim / (maxRangeMap() * gfxCellPixelFactor);
  const maxRange = maxRangeMap() * gfxCellPixelFactor - 1;
  const svgRender = /*html*/ `
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
  // htmls(, svgRender);
  downloader('map.svg', mimes['svg'], svgRender);
};

const getCurrentJSONmap = (pixelfactor) => {
  if (pixelfactor === undefined) pixelfactor = gfxCellPixelFactor;
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

s('.gfx-json').onclick = () => {
  const renderJSON = JSONmatrix(getCurrentJSONmap());
  htmls(
    '.gfx-json-display',
    /*html*/ `
    <div class='in'>
        <button class='inl gfx-copy-json custom-cursor'>
            copy json
        </button>
    </div>
    <pre class='in'>${renderJSON}</pre>
  
  `
  );
  s('.gfx-copy-json').onclick = async () => {
    await copyData(renderJSON);
    renderNotification('success', 'json copy to clipboard');
  };
};

s('.gfx-gen-biome').onclick = () => {
  const maxRangeMapParam = maxRangeMap() * gfxCellPixelFactor - 1;
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

s('.gfx-copy-color-json').onclick = async () => {
  const renderJSON = [];
  const maxRange = maxRangeMap() * gfxCellPixelFactor - 1;
  range(0, maxRange).map((x) =>
    range(0, maxRange).map((y) => {
      if (!renderJSON[y]) renderJSON[y] = [];
      renderJSON[y][x] =
        globalPaintStorage[x] && globalPaintStorage[x][y] !== undefined ? globalPaintStorage[x][y] : '#000000';
    })
  );
  await copyData(JSONmatrix(renderJSON));
  renderNotification('success', 'json copy to clipboard');
};

s('.gfx-load-color-json').onclick = () => {
  const inputJSON = JSON.parse(s('.gfx-input-json-color').value);
  s('.gfx-size-paint').value = 1;
  s('.gfx-size-paint').oninput();
  const maxRange = maxRangeMap() * gfxCellPixelFactor - 1;
  range(0, maxRange).map((x) =>
    range(0, maxRange).map((y) => {
      if (!globalPaintStorage[x]) globalPaintStorage[x] = {};
      currentColorCell = inputJSON[y][x];
      renderPaint(x, y);
    })
  );
  s('.gfx-input-color').value = currentColorCell;
  s('.gfx-input-color').oninput();
};
s('.gfx-paste-color-json').onclick = async () => (s('.gfx-input-json-color').value = await pasteData());

s('.gfx-load-solid').onclick = async () => {
  const inputJSON = JSON.parse(await pasteData());
  const maxRange = maxRangeMap() * gfxCellPixelFactor - 1;

  console.log('inputJSON', JSONmatrix(inputJSON));
  let inputX = 0;
  let inputY = 0;
  range(0, maxRange).map((x) => {
    if (x !== 0 && x % gfxCellPixelFactor === 0) inputX++;
    range(0, maxRange).map((y) => {
      if (y !== 0 && y % gfxCellPixelFactor === 0) inputY++;

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
    s('.gfx-quadrant').click();
    s('.gfx-quadrant').click();
  }
};
