s('.btn-logout').onclick = () => {
  localStorage.removeItem('_b');
  enableFirstUserRender = true;
  htmls('event-history-render', '');
  resetCharacterSlots();
  resetEventBoard();
  newMainUserInstance();
  Object.keys(logicStorage['logout']).map((logicKey) => logicStorage['logout'][logicKey]());
};
