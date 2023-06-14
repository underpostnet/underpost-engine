const renderKoynLogo = (value, type, valueID) => {
  const koynName = () => /*html*/ `
  ${
    type === 'crypto'
      ? /*html*/ `
  <span style='color: black; font-weight: bold; ${borderChar(1, 'white')}'>
    Crypto
  </span>
  <br>
  `
      : ''
  }
  Ko<span style='color: red;'>λ</span>n
  `;
  return {
    render: () => /*html*/ `
  
    <img class='abs center item-bag-icon' src='/items/koyn/animation.gif'>
    <div class='abs center item-bag-style-text'>
      ${koynName()}
    </div>
    ${renderTitleTypeSlot('currency')}
    ${renderItemCount(valueID, value)}

`,
    data: {
      id: type === 'crypto' ? 'crypto-koyn' : 'koyn',
      name: { es: koynName(), en: koynName() },
      itemType: 'currency',
      active: () => false,
      count: () =>
        type === 'crypto'
          ? 0
          : elements.user.find((e) => e.id === socket.id)
          ? elements.user.find((e) => e.id === socket.id).koyn
          : 0,
    },
  };
};
