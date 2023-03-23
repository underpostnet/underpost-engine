const bag = () => {
  return /*html*/ `
    <bag style='display: none'>
      <sub-content-gui class='in'>

            ${renderLang({ es: 'Mochila', en: 'Bag' })}
            <hr>
            ${renderKoynLogo(0, false, 'bag-koyn-indicator')}
            <br>
            ${renderKoynLogo(0, 'crypto', 'bag-cryptokoyn-indicator')}          

      </sub-content-gui>
    </bag>
    `;
};
