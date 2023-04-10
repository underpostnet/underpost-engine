const bag = () => {
  const defaultContent = [
    () => renderKoynLogo(0, false, 'bag-koyn-indicator'),
    () => renderKoynLogo(0, 'crypto', 'bag-cryptokoyn-indicator'),
  ];
  setTimeout(() => {
    let indexCell = 0;
    range(0, 2).map((iRow) => {
      append(
        '.grid-bag',
        /*html*/ `
       <div class='fl grid-row-${iRow}'></div>    
      `
      );
      range(0, 3).map((iCell) => {
        append(
          `.grid-row-${iRow}`,
          /*html*/ `
        <div class="in fll grid-cell custom-cursor">
             ${defaultContent[indexCell] ? defaultContent[indexCell]() : ''}
        </div>
        `
        );
        indexCell++;
      });
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
