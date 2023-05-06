const renderKoynLogo = (value, type, valueID) => /*html*/ `
  
                <img class='abs center item-bag-icon' src='/gifs/koyn.gif'>
                <div class='abs center item-bag-style-text'>
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
                </div>
                ${renderItemCount(valueID, value)}
  
  `;
