if (!logicStorage['logout']['admin'])
  logicStorage['logout']['admin'] = () => {
    s('.btn-graphics-engine').remove();
    s('graphics-engine').remove();
    guiSections = guiSections.filter((g) => g !== 'graphics-engine');
    intanceMenuBtns();
    logicStorage['logout']['admin'] = undefined;
    delete logicStorage['logout']['admin'];
  };

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
    <sub-content-gui class='in'>
          <div class='in title-section'>Graphics Engine</div>
    </sub-content-gui>
  </graphics-engine>


`
);

intanceMenuBtns();
