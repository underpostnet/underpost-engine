if (!logicStorage['logout']['engineAvatar'])
  logicStorage['logout']['engineAvatar'] = () => {
    s('.btn-avatar-graphics-engine').remove();
    s('avatar-graphics-engine').remove();
    guiSections = guiSections.filter((g) => g !== 'avatar-graphics-engine');
    intanceMenuBtns();
    // logicStorage['logout']['engineAvatar'] = undefined;
    // delete logicStorage['logout']['engineAvatar'];
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
      </style>
      <sub-content-gui class='in'>
            <div class='in title-section'>Avatar Engine</div>
      </sub-content-gui>
  
    </avatar-graphics-engine>
  
  `
);

intanceMenuBtns();
