if (!logicStorage['logout']['admin'])
  logicStorage['logout']['admin'] = () => {
    s('.btn-graphics-engine').remove();
  };

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
