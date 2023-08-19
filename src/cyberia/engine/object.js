(function () {
  if (!logicStorage['logout']['engineObject'])
    logicStorage['logout']['engineObject'] = () => {
      s('.btn-object-graphics-engine').remove();
      s('object-graphics-engine').remove();
      guiSections = guiSections.filter((g) => g !== 'object-graphics-engine');
      intanceMenuBtns();
      logicStorage['logout']['engineObject'] = undefined;
      delete logicStorage['logout']['engineObject'];
      // logicStorage['css-controller']['engineObject'] = undefined;
      // delete logicStorage['css-controller']['engineObject'];
      // logicStorage['key-down']['engineObject'] = undefined;
      // delete logicStorage['key-down']['engineObject'];
    };

  guiSections.push('object-graphics-engine');
  append(
    'common-menu',
    /*html*/ `

<menu-button class='in custom-cursor btn-object-graphics-engine'>
    <div class='abs center'>
        Object Engine
    </div>
</menu-button>

`
  );

  prepend(
    'gui-layer',
    /*html*/ `
  
    <object-graphics-engine style='display: none'>
      <style>
        .engineObject-content-tools-board {
          background: rgba(0,0,0,0.8);
          padding: 10px;
          z-index: 2;
        }
        .engineObject-btn {
          margin: 3px;
          font-size: 8px;
        }
        .engineObject-input-color {
          width: 100px;
          padding: 0px;
        }
        .engineObject-cell {
          box-sizing: border-box;
          border: 2px solid yellow;
          width: 18px;
          height: 18px;
        }
        .engineObject-cell:hover {
          border: 2px solid white;
        }
      </style>
      <sub-content-gui class='in'>
            <div class='in title-section'>Object Engine</div>

            <div class='fix engineObject-content-tools-board custom-cursor'>
              <input type='color' class='inl engineObject-input-color'>
              <button class='inl custom-cursor engineObject-btn engineObject-copy-current-hex-color'>
                  copy current hex color
              </button>
            </div>

            <object-engine-grid class='in'>
            </object-engine-grid> 
      </sub-content-gui>
  
    </object-graphics-engine>
  
  `
  );

  intanceMenuBtns();
  dragDrop('.engineObject-content-tools-board');

  s('.engineObject-copy-current-hex-color').onclick = async () => {
    await copyData(s('.engineObject-input-color').value);
    renderNotification('success', 'hex color to clipboard');
  };

  const renderGridObjectEngine = () => {
    const objectEngineDim = 29;
    let render = '';
    range(0, objectEngineDim).map((y) => {
      render += /*html*/ `<div class='fl'>`;
      range(0, objectEngineDim).map((x) => {
        render += /*html*/ `
            <div class='in fll engineObject-cell custom-cursor'>
            </div>
        `;
      });
      render += /*html*/ `</div>`;
    });
    htmls('object-engine-grid', render);
  };
  renderGridObjectEngine();
})();
