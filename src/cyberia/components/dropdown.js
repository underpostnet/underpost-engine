const renderDropDown = (options) => {
  const iconDpOp = '&#8595';
  setTimeout(() => {
    s(`.dropdown-content-${options.id}`).onclick = () => {
      if (s(`dropdown-options-${options.id}`).style.display === 'none') {
        s(`dropdown-options-${options.id}`).style.display = 'block';
      } else {
        s(`dropdown-options-${options.id}`).style.display = 'none';
      }
    };
  });

  return /*html*/ `
    
    <style>
        .dropdown-content-${options.id} {
            width: 200px;
            font-size: 10px;
        }
        .dropdown-option-${options.id} {
            border: 2px solid yellow;
            padding: 5px;
            color: yellow;
        }
        .dropdown-option-${options.id}:hover {
            border: 2px solid white;
            color: white;
        }
    </style>
    <div class='inl dropdown-content-${options.id}'>
        <div class='in dropdown-option-${options.id} dropdown-option-label-${options.id} ${
    options.optionCustomClass ? options.optionCustomClass : ''
  }'>
           ${iconDpOp} ${
    options.label ? options.label : renderLang({ es: 'Escoja una opción', en: 'Choose a options' })
  }
        </div>
        <dropdown-options-${options.id} style='display: none'>
            ${options.data
              .map((optionData) => {
                const hashOption = 'dp-hash-' + s4();
                setTimeout(() => {
                  s('.' + hashOption).onclick = () => {
                    htmls(`.dropdown-option-label-${options.id}`, iconDpOp + ' ' + optionData.display);
                    options.onClick(optionData.value);
                  };
                });
                return /*html*/ `
                <div class='in dropdown-option-${options.id} ${hashOption} ${
                  options.optionCustomClass ? options.optionCustomClass : ''
                }'>
                    ${optionData.display}
                </div>
                `;
              })
              .join('')}
              <div class='in dropdown-option-${options.id} ${
    options.optionCustomClass ? options.optionCustomClass : ''
  }'>
                    X ${renderLang({ es: 'Cerrar', en: 'Close' })}
              </div>
        </dropdown-options-${options.id}>
    </div>
    
    `;
};
