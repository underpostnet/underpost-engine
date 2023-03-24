const bag = () => {
  const defaultContent = [
    () => renderKoynLogo(0, false, 'bag-koyn-indicator'),
    () => renderKoynLogo(0, 'crypto', 'bag-cryptokoyn-indicator'),
  ];
  setTimeout(() => {
    range(1, 8).map((i) => {
      append(
        '.grid-bag',
        /*html*/ `
        <div class='inl grid-cell custom-cursor'>
             ${i}
            <div class='abs center'>
                ${defaultContent[i - 1] ? defaultContent[i - 1]() : ''}
            </div>
        </div>   
        ${i % 4 === 0 && i - 1 !== 0 ? '<br>' : ''}   
      `
      );
    });
  });
  return /*html*/ `
    <bag style='display: none'>
      <sub-content-gui class='in'>

            <div class='in title-section'>${renderLang({ es: 'Mochila', en: 'Bag' })}</div>
            
            <div class='in grid-content grid-bag'> </div>

      </sub-content-gui>
    </bag>
    `;
};
