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
let solidMode = 0;
let gfxLastX = 0;
let gfxLastY = 0;
let globalPaintStorage = {};
let globalSolidStorage = {};
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
        z-index: 1;
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
        border: 1px solid gray;
        max-height: 360px;
        margin: 40px 3px 3px 3px;
        padding: 5px;
        text-align: right;
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
        <button class='inl gfx-btn custom-cursor gfx-solid'>
          solid <span style='color: red'>off</span>
        </button>
        <button class='inl gfx-btn custom-cursor gfx-json'>
          generate json
        </button>
        <button class='inl gfx-btn custom-cursor gfx-quadrant'>
          quadrant <span style='color: red'>off</span>
        </button>
        size
        <input type='number' class='inl gfx-size-paint' value=${currentSizeCell + 1}>
      </div>
      <div class='in gfx-engine-content'>
          link engine
      </div>
      <div class='in main-dropdown-content gfx-engine-content'>
          adjacent map engine
        <br>
        <input type='text' placeholder='name adjacent map' class='gfx-name-adjacent-map'>
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
                break;
              case 'bottom':
                renderStyle += `
                  bottom: -${maxPxAdjacentMapRender}px;
                  left: 0px;
                `;
                break;
              case 'right':
                renderStyle += `
                  top: 0px;
                  left: ${maxPxAdjacentMapRender}px;
                `;
                break;
              case 'left':
                renderStyle += `
                  top: 0px;
                  left: -${maxPxAdjacentMapRender}px;
                `;
                s('gfx-grid').style.left = `${maxPxAdjacentMapRender}px`;
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
                        font-size: 8px;
                        '>
                            ${mapData.data.matrix[y][x] === 0 ? 0 : 1}
                            ${
                              typeof mapData.data.matrix[y][x] === 'object' && mapData.data.matrix[y][x][0] === 'tmi'
                                ? `
                            <br> <span style='color: red'>T-${mapData.data.matrix[y][x][1]}</span>
                            `
                                : ''
                            }
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
          },
        })}
      </div>
    </div>
    <br>
    <gfx-grid class='in custom-cursor'></gfx-grid>
    <br><br>
    <div class='in gfx-json-display'></div>
    <br><br><br>

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

  if (!globalSolidStorage[x]) globalSolidStorage[x] = {};
  globalSolidStorage[x][y] = solidMode;

  if (currentSizeCell > 0) {
    range(1, currentSizeCell).map((sizeY) => {
      range(1, currentSizeCell).map((sizeX) => {
        if (!globalPaintStorage[x + sizeX]) globalPaintStorage[x + sizeX] = {};
        if (!globalSolidStorage[x + sizeX]) globalSolidStorage[x + sizeX] = {};

        if (s(`.gfx-${x + sizeX}-${y}`)) {
          s(`.gfx-${x + sizeX}-${y}`).style.background = currentColorCell;
          globalPaintStorage[x + sizeX][y] = currentColorCell;
          globalSolidStorage[x + sizeX][y] = solidMode;
        }
        if (s(`.gfx-${x}-${y + sizeY}`)) {
          s(`.gfx-${x}-${y + sizeY}`).style.background = currentColorCell;
          globalPaintStorage[x][y + sizeY] = currentColorCell;
          globalSolidStorage[x][y + sizeY] = solidMode;
        }
        if (s(`.gfx-${x + sizeX}-${y + sizeY}`)) {
          s(`.gfx-${x + sizeX}-${y + sizeY}`).style.background = currentColorCell;
          globalPaintStorage[x + sizeX][y + sizeY] = currentColorCell;
          globalSolidStorage[x + sizeX][y + sizeY] = solidMode;
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
  globalPaintStorage = {};
  globalSolidStorage = {};
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
                    s('.gfx-size-paint').value = 1;
                    s('.gfx-size-paint').oninput();
                    const baseX = x * gfxCellPixelFactor;
                    const baseY = y * gfxCellPixelFactor;
                    range(0, gfxCellPixelFactor - 1).map((sumX) =>
                      range(0, gfxCellPixelFactor - 1).map((sumY) => {
                        renderPaint(baseX + sumX, baseY + sumY);
                      })
                    );
                  };
                });
                return /*html*/ `
              <div class='abs adjacent-map-cell cursor-pointer quadrant-map-cell-${x}-${y}' style='
              width: ${recDim}px; 
              height: ${recDim}px;
              left: ${x * recDim}px; 
              top: ${y * recDim}px; 
              '>
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

s('.gfx-json').onclick = () => {
  let dataJSON = [];
  const maxRange = maxRangeMap() * gfxCellPixelFactor - 1;
  range(0, maxRange).map((x) =>
    range(0, maxRange).map((y) => {
      if (!dataJSON[y]) dataJSON[y] = [];
      dataJSON[y][x] = globalSolidStorage[x] !== undefined && globalSolidStorage[x][y] === 1 ? 1 : 0;
    })
  );
  const renderJSON = JSONmatrix(
    dataJSON
      .map((y, iy) =>
        iy % gfxCellPixelFactor === 0
          ? y.map((x, ix) => (ix % gfxCellPixelFactor === 0 ? x : null)).filter((c) => c !== null)
          : null
      )
      .filter((c) => c !== null)
  );
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
  s('.gfx-copy-json').onclick = () => copyData(renderJSON);
};
