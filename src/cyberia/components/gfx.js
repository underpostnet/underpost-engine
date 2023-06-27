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
        border: 1px solid gray;
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
    </style>
     <style class='style-gfx-cell'></style>
     <style class='style-gfx-cell-select'></style>
    <sub-content-gui class='in'>
          <div class='in title-section'>Graphics Engine</div>
    </sub-content-gui>
    
    <div class='in gfx-content-menu'>
      <input type='color' class='gfx-input-color'>
      <br><br>
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
  s(`.gfx-${x}-${y}`).style.background = currentColorCell;

  if (currentSizeCell > 0) {
    range(1, currentSizeCell).map((sizeY) => {
      range(1, currentSizeCell).map((sizeX) => {
        if (s(`.gfx-${x + sizeX}-${y}`)) s(`.gfx-${x + sizeX}-${y}`).style.background = currentColorCell;
        if (s(`.gfx-${x}-${y + sizeY}`)) s(`.gfx-${x}-${y + sizeY}`).style.background = currentColorCell;
        if (s(`.gfx-${x + sizeX}-${y + sizeY}`))
          s(`.gfx-${x + sizeX}-${y + sizeY}`).style.background = currentColorCell;
      });
    });
  }
};

(() => {
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
})();

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

logicStorage['css-controller']['gfx'] = renderDimGfxEngine;
logicStorage['key-down']['gfx'] = () => {
  if (window.activeKey['Control'] && (window.activeKey['v'] || window.activeKey['V'])) {
    lastPaintClipBoard.map((pasteData) => {
      if (s(`.gfx-${gfxLastX + pasteData.x}-${gfxLastY + pasteData.y}`))
        s(`.gfx-${gfxLastX + pasteData.x}-${gfxLastY + pasteData.y}`).style.background = pasteData.v;
    });
  }
  if (window.activeKey['Control'] && (window.activeKey['c'] || window.activeKey['C'])) {
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
  }
};
