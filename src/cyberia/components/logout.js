s('.btn-logout').onclick = () => {
  localStorage.removeItem('_b');
  Object.keys(logicStorage['logout']).map((logicKey) => logicStorage['logout'][logicKey]());
  enableFirstUserRender = true;
  htmls('event-history-render', '');
  resetCharacterSlots();
  resetEventBoard();
  newMainUserInstance();
};
