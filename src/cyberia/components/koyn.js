const renderKoynLogo = (value, type, valueID) => /*html*/ `
  
       <div class='abs center coin-value-content' style='${borderChar(2, 'black')}'>
       
                <img class='abs center koyn-gif' src='/gifs/koyn.gif'>
                <div class='abs center'>
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
      </div>
      <div class='abs value-koyn-text' style='${borderChar(2, 'black')}'>
          <div ${valueID ? `class='abs center ${valueID}'` : ''}>${value}</div>
      </div>
  
  `;
