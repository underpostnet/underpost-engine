const config = () => {
  return /*html*/ `
      <config style='display: none'>
        <sub-content-gui class='in'>
  
          <div class='in title-section'>${renderLang({ en: 'Settings', es: 'Configuraciones' })}</div>


          <div class='in config-row'>
                <div class='fl'>
                      <div class='in fll config-col'>
                        <div class='in config-col-content'>
                           ${renderLang({ es: 'Pantalla Completa', en: 'FullScreen' })}
                        </div>
                      </div>
                      <div class='in fll config-col'>
                       <div class='in config-col-content'>
                          <div class='inl toggle-switch-content'>
                          ${renderToggleSwitch({
                            factor: 23,
                            id: 'full-screen-toggle',
                            checked: false,
                            label: ['', ''],
                            activeColor: 'yellow',
                            onChange: (state) => {
                              console.log('renderToggleSwitch onChange', state);
                              if (state) return fullScreenIn();
                              fullScreenOut();
                            },
                          })}
                        </div>
                      </div>
                    </div>
                </div>

               
          </div>
          <div class='in config-row'>

            <div class='fl'>
                <div class='in fll config-col'>
                    <div class='in config-col-content'>
                      ${renderLang({ es: 'Cambiar Idioma', en: 'Change language' })}
                    </div>
                </div>
                <div class='in fll config-col'>
                    <div class='in config-col-content'>
                      ${renderDropDown({
                        id: 'lang-dropdown',
                        optionCustomClass: 'custom-cursor',
                        label: renderLang({ es: 'Español', en: 'English' }),
                        data: [
                          {
                            display: renderLang({ es: 'Español', en: 'Spanish' }),
                            value: 'es',
                          },
                          {
                            display: renderLang({ es: 'Ingles', en: 'English' }),
                            value: 'en',
                          },
                        ],
                        onClick: (value) => window._execTranslate(value),
                      })}
                    </div>
                </div>
            </div>


          </div>
              
  
        </sub-content-gui>
      </config>
      `;
};
