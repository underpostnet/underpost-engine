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
    </div>
    <br>
    <gfx-grid class='custom-cursor'></gfx-grid>

  </graphics-engine>


`
);

intanceMenuBtns();

s('gfx-grid').onmousedown = () => (mouseDown = true);
s('gfx-grid').onmouseup = () => (mouseDown = false);

let gfxLastX = 0;
let gfxLastY = 0;
let globalPaintStorage = {};

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
  const dim = 31;
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
  const dim = screenDim.minValue * 0.03;
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
    if (s(`.gfx-${gfxLastX + pasteData.x}-${gfxLastY + pasteData.y}`))
      s(`.gfx-${gfxLastX + pasteData.x}-${gfxLastY + pasteData.y}`).style.background = pasteData.v;
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
  const recDim = renderDim / (maxRangeMap() * 2);
  const maxRange = maxRangeMap() * 2 - 1;
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
