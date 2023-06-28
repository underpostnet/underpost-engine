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
let solidMode = false;
let gfxLastX = 0;
let gfxLastY = 0;
let globalPaintStorage = {};
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
      .map-adjacent-engine-content {
        border: 1px solid gray;
        max-height: 360px;
        margin: 40px 3px 3px 3px;
        padding: 5px;
        text-align: right;
      }
      .map-adjacent-preview-img {
        width: 300px;
        height: 300px;
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
      </div>
      <div class='in main-dropdown-content'>
        ${renderDropDown({
          id: 'gfx-size-dropdown',
          optionCustomClass: 'custom-cursor',
          style_dropdown_option: `
            background: black;
            z-index: 1;
          `,
          label: renderLang({ es: 'x1', en: 'x1' }),
          data: range(1, 10).map((size) => {
            return { value: size - 1, display: `x${size}` };
          }),
          onClick: (value) => {
            console.log('gfx-size-dropdown onclick ->', value);
            currentSizeCell = value;
          },
        })}
      </div>
      <div class='in main-dropdown-content map-adjacent-engine-content'>
          <div class='in map-adjacent-preview-content'></div>
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
          onClick: (value) => {
            const baseDim = s('.gfx-0-0').offsetHeight;
            const maxPxAdjacentMapRender = baseDim * maxRangeMap() * gfxCellPixelFactor + baseDim;
            let renderStyle = `
            width: ${maxPxAdjacentMapRender}px;
            height: ${maxPxAdjacentMapRender}px;
            `;
            switch (value) {
              case 'top':
                renderStyle += `
                  top: -${maxPxAdjacentMapRender}px;
                  left: 0px;
                `;
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
                break;
              default:
                break;
            }
            const renderAdjMap = /*html*/ `
              <img
              style='${renderStyle}'
              class='abs gfx-img-adjacent-map' 
              src='/tiles/${s('.gfx-name-adjacent-map').value}.png'
              >
            `;
            htmls(
              '.map-adjacent-preview-content',
              /*html*/ `
            <img
            class='inl map-adjacent-preview-img' 
            src='/tiles/${s('.gfx-name-adjacent-map').value}.png'
            >
            `
            );
            if (s('.gfx-img-adjacent-map')) s('.gfx-img-adjacent-map').remove();
            append('gfx-grid', renderAdjMap);
          },
        })}
      </div>
    </div>
    <br>
    <gfx-grid class='in custom-cursor'></gfx-grid>
    <br><br><br>

  </graphics-engine>


`
);

intanceMenuBtns();

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
  htmls('gfx-grid', '');
  globalPaintStorage = {};
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
  lastPaintClipBoard = [{ x: 0, y: 0, v: s(`.gfx-${gfxLastX}-${gfxLastY}`).style.background }];
  range(1, currentSizeCell).map((sizeY) => {
    range(1, currentSizeCell).map((sizeX) => {
      if (s(`.gfx-${gfxLastX + sizeX}-${gfxLastY}`))
        lastPaintClipBoard.push({
          x: sizeX,
          y: 0,
          v: s(`.gfx-${gfxLastX + sizeX}-${gfxLastY}`).style.background,
        });
      if (s(`.gfx-${gfxLastX}-${gfxLastY + sizeY}`))
        lastPaintClipBoard.push({
          x: 0,
          y: sizeY,
          v: s(`.gfx-${gfxLastX}-${gfxLastY + sizeY}`).style.background,
        });
      if (s(`.gfx-${gfxLastX + sizeX}-${gfxLastY}`))
        lastPaintClipBoard.push({
          x: sizeX,
          y: sizeY,
          v: s(`.gfx-${gfxLastX + sizeX}-${gfxLastY + sizeY}`).style.background,
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
    }
  });
};

logicStorage['css-controller']['gfx'] = renderDimGfxEngine;

logicStorage['key-down']['gfx'] = () => {
  if (window.activeKey['Control'] && (window.activeKey['v'] || window.activeKey['V'])) gfxPaste();
  if (window.activeKey['Control'] && (window.activeKey['c'] || window.activeKey['C'])) gfxCopy();
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
  if (solidMode) {
    solidMode = false;
    htmls('.gfx-solid', `solid <span style='color: red'>off</span>`);
    return;
  }
  solidMode = true;
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
