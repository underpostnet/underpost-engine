const wiki = () => {
  const wikiMetaData = [
    {
      name: renderLang({ es: 'Controles para el Movil', en: 'Mobile Controls' }),
      open: true,
      render: () => {
        return /*html*/ `
            <div class='fl wiki-row'>
              <div class='in fll wiki-key'>
              <div class='in wiki-cell'>
                ${renderLang({ en: 'Double tap:', es: 'Doble toque:' })}
                </div>
              </div>
              <div class='in fll wiki-value'>
              <div class='in wiki-cell'>
                ${renderLang({ en: 'Basic effect', es: 'Ataque Basico' })}
              </div>
              </div>
            </div>
            <div class='fl wiki-row'>
              <div class='in fll wiki-key'>
              <div class='in wiki-cell'>
                ${renderLang({
                  en: 'Single tap:',
                  es: 'Unico toque:',
                })}
                </div>
              </div>
              <div class='in fll wiki-value'>
              <div class='in wiki-cell'>
                ${renderLang({
                  en: 'Movement to location',
                  es: 'Movimiento hacia la ubicación',
                })}
                </div>
            </div>
          </div>
        `;
      },
    },
    {
      name: renderLang({ es: 'Controles de Escritorio', en: 'Desktop Controls' }),
      open: true,
      render: () => {
        return /*html*/ `
            <div class='fl wiki-row'>
              <div class='in fll wiki-key'>
              <div class='in wiki-cell'>
               ${renderLang({ en: 'Double click:', es: 'Doble click:' })}
               </div>
              </div> 
              <div class='in fll wiki-value'>
              <div class='in wiki-cell'>
                ${renderLang({ en: 'Basic effect', es: 'Ataque Basico' })}
                </div>
              </div>
            </div>
            <div class='fl wiki-row'>
              <div class='in fll wiki-key'>
              <div class='in wiki-cell'>
                ${renderLang({
                  en: 'Single click:',
                  es: 'Unico click:',
                })}
                </div>
               </div>
               <div class='in fll wiki-value'>
               <div class='in wiki-cell'>
                ${renderLang({
                  en: 'Movement to location',
                  es: 'Movimiento hacia la ubicación',
                })}
                </div>
               </div>
            </div>
            <div class='fl wiki-row'>
              <div class='in fll wiki-key'>
                <div class='in wiki-cell'>
                   ${renderLang({ en: '[ Q ] key:', es: 'tecla [ Q ]:' })}
                </div>
              </div>
              <div class='in fll wiki-value'>
                <div class='in wiki-cell'>
                    ${renderLang({ en: 'Basic effect', es: 'Ataque Basico' })}
                </div>
              </div>
            </div>
            <div class='fl wiki-row'>
              <div class='in fll wiki-key'>
                <div class='in wiki-cell'>
                   ${renderLang({ en: '[ Enter ] key:', es: 'tecla [ Enter ]:' })}
                </div>
              </div>
              <div class='in fll wiki-value'>
                <div class='in wiki-cell'>
                    ${renderLang({ en: 'Open chat', es: 'Abrir chat' })}
                </div>
              </div>
            </div>
            <div class='fl wiki-row'>
              <div class='in fll wiki-key'>
                <div class='in wiki-cell'>
                   ${renderLang({ en: '[ Home ] key:', es: 'tecla [ Inicio ]:' })}
                </div>
              </div>
              <div class='in fll wiki-value'>
                <div class='in wiki-cell'>
                    ${renderLang({ en: 'Close/Open Menu/GUI', es: 'Cerrar/Abrir Menu/GUI' })}
                </div>
              </div>
            </div>
            <div class='fl wiki-row'>
              <div class='in fll wiki-key'>
                <div class='in wiki-cell'>
                   ${renderLang({
                     en: '[ &larr; &rarr; &uarr; &darr; ] keys:',
                     es: ' teclas [ &larr; &rarr; &uarr; &darr; ]:',
                   })}
                </div>
              </div>
              <div class='in fll wiki-value'>
                <div class='in wiki-cell'>
                    ${renderLang({
                      en: 'Movement to quadrant to the adjacent or diagonal direction',
                      es: 'Movimiento a cuadrante de dirección adyacente o diagonal',
                    })}
                </div>
              </div>
            </div>
            
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
