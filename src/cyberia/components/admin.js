if (!logicStorage['logout']['admin'])
  logicStorage['logout']['admin'] = () => {
    s('.btn-graphics-engine').remove();
    s('graphics-engine').remove();
    guiSections = guiSections.filter((g) => g !== 'graphics-engine');
    intanceMenuBtns();
    logicStorage['logout']['admin'] = undefined;
    delete logicStorage['logout']['admin'];
    logicStorage['css-controller']['admin'] = undefined;
    delete logicStorage['css-controller']['admin'];
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
          data: range(1, 2).map((size) => {
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

const renderPaint = (x, y) => {
  s(`.gfx-${x}-${y}`).style.background = currentColorCell;
  if (currentSizeCell > 0) {
    range(1, currentSizeCell).map((size) => {
      if (s(`.gfx-${x + size}-${y}`)) s(`.gfx-${x + size}-${y}`).style.background = currentColorCell;
      if (s(`.gfx-${x}-${y + size}`)) s(`.gfx-${x}-${y + size}`).style.background = currentColorCell;
      if (s(`.gfx-${x + size}-${y + size}`)) s(`.gfx-${x + size}-${y + size}`).style.background = currentColorCell;
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

logicStorage['css-controller']['admin'] = renderDimGfxEngine;
