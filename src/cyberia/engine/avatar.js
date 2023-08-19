(function () {
  if (!logicStorage['logout']['engineAvatar'])
    logicStorage['logout']['engineAvatar'] = () => {
      s('.btn-avatar-graphics-engine').remove();
      s('avatar-graphics-engine').remove();
      guiSections = guiSections.filter((g) => g !== 'avatar-graphics-engine');
      intanceMenuBtns();
      logicStorage['logout']['engineAvatar'] = undefined;
      delete logicStorage['logout']['engineAvatar'];
      // logicStorage['css-controller']['engineAvatar'] = undefined;
      // delete logicStorage['css-controller']['engineAvatar'];
      // logicStorage['key-down']['engineAvatar'] = undefined;
      // delete logicStorage['key-down']['engineAvatar'];
    };

  guiSections.push('avatar-graphics-engine');
  append(
    'common-menu',
    /*html*/ `

<menu-button class='in custom-cursor btn-avatar-graphics-engine'>
    <div class='abs center'>
        Avatar Engine
    </div>
</menu-button>

`
  );

  prepend(
    'gui-layer',
    /*html*/ `
  
    <avatar-graphics-engine style='display: none'>
      <style>
        .engineAvatar-content-tools-board {
          background: rgba(0,0,0,0.8);
          padding: 10px;
          z-index: 2;
        }
        .engineAvatar-btn {
          margin: 3px;
          font-size: 8px;
        }
        .engineAvatar-input-color {
          width: 100px;
          padding: 0px;
        }
      </style>
      <sub-content-gui class='in'>
            <div class='in title-section'>Avatar Engine</div>

            <div class='fix engineAvatar-content-tools-board custom-cursor'>
              <input type='color' class='inl engineAvatar-input-color'>
              <button class='inl custom-cursor engineAvatar-btn engineAvatar-copy-current-hex-color'>
                  copy current hex color
              </button>
            </div>
      </sub-content-gui>
  
    </avatar-graphics-engine>
  
  `
  );

  intanceMenuBtns();
  dragDrop('.engineAvatar-content-tools-board');

  s('.engineAvatar-copy-current-hex-color').onclick = async () => {
    await copyData(s('.engineAvatar-input-color').value);
    renderNotification('success', 'hex color to clipboard');
  };
})();
