const config = () => {
  return /*html*/ `
      <config style='display: none'>
        <sub-content-gui class='in'>
  
          <div class='in title-section'>${renderLang({ en: 'Settings', es: 'Configuraciones' })}</div>


          <div class='in config-row'>

                <div class='inl toggle-switch-content'>
                  ${renderToggleSwitch({
                    factor: 30,
                    id: 'x' + s4(),
                    checked: false,
                    label: ['', ''],
                    activeColor: 'yellow',
                    onChange: (state) => {
                      console.log('renderToggleSwitch onChange', state);
                    },
                  })}
                </div>

                ${renderLang({ es: 'Pantalla Completa', en: 'FullScreen' })}
          </div>
              
  
        </sub-content-gui>
      </config>
      `;
};
