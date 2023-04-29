window.activeKey = {};
window.onkeydown = (e) => (console.log('onkeydown', e.key), (window.activeKey[e.key] = true));
window.onkeyup = (e) => (console.log('onkeyup', e.key), (window.activeKey[e.key] = undefined));

window._fullscreen = newInstance(checkFullScreen());

let blockKey = false;
setInterval(() => {
  if (_fullscreen !== checkFullScreen()) {
    window._fullscreen = newInstance(checkFullScreen());
    if (_fullscreen === true) {
      if (s(`.full-screen-toggle`).checked === false) s(`.ts-container-full-screen-toggle`).click();
    } else {
      if (s(`.full-screen-toggle`).checked === true) s(`.ts-container-full-screen-toggle`).click();
    }
  }
  if (blockKey) return;
  if (window.activeKey['Enter'] && s('gui-layer').style.display === 'none') {
    blockKey = true;
    s('.btn-chat').click();
  }
  if (window.activeKey['Home'] && s('main-menu').style.display === 'block') {
    blockKey = true;
    s('.close-menu').click();
  } else if (window.activeKey['Home'] && s('gui-layer').style.display === 'block') {
    blockKey = true;
    s('.close-gui').click();
  } else if (
    window.activeKey['Home'] &&
    s('gui-layer').style.display === 'none' &&
    s('main-menu').style.display === 'none'
  ) {
    blockKey = true;
    s('.open-menu').click();
  }
  if (blockKey)
    setTimeout(() => {
      blockKey = false;
    }, 600);
}, 10);

disableOptionsClick('html', ['menu', 'drag', 'select']);
