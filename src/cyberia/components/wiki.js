const wiki = () => {
  const wikiMetaData = [
    {
      name: renderLang({ es: 'Controles', en: 'Controls' }),
      open: true,
      render: () => {
        return /*html*/ `
            test
        `;
      },
    },
  ];
  return /*html*/ `
    
    <wiki style='display: none'>
        <sub-content-gui class='in'>

            <div class='in title-section'>${renderLang({ es: 'Wiki', en: 'Wiki' })}</div>
            
            ${wikiMetaData
              .map((wmd, i) => {
                let openSection = false;
                setTimeout(() => {
                  s(`.wsh-${i}`).onclick = () => {
                    if (openSection) {
                      openSection = false;
                      htmls(`.wsh-icon-${i}`, '>');
                      s(`.ws-${i}`).style.display = 'none';
                    } else {
                      openSection = true;
                      htmls(`.wsh-icon-${i}`, 'X');
                      s(`.ws-${i}`).style.display = 'block';
                    }
                  };
                  if (wmd.open) s(`.wsh-${i}`).click();
                });
                return /*html*/ `
                <div class='in wiki-section-header wsh-${i} custom-cursor'>
                    <span class='wsh-icon-${i}'>></span> ${wmd.name}
                </div>
                <div class='in wiki-section ws-${i}' style='display: none'>
                    ${wmd.render()}
                </div>
                `;
              })
              .join('')}

        </sub-content-gui>
    </wiki>
    
    `;
};
