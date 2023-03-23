const renderKoynLogo = (value, type, valueID) => /*html*/ `
  
       <div class='inl coin-value-content' style='${borderChar(2, 'black')}'>
          <div class='fl'  style='height: 100%;'>
              <div class='in fll' style='width: 50%; height: 100%;'>
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
              <div class='in fll' style='width: 50%; height: 100%;'> <!--  background: #090909; -->
                <div class='abs center value-koyn-text'>
                    <span ${valueID ? `class='${valueID}'` : ''}>${value}</span>
                </div>
              </div>
          </div>
      </div>
  
  `;

const renderKoynNotification = (value, type) => {
  const hash = 'renderKoynNotification-' + s4() + s4();
  append(
    'body',
    /*html*/ `
    <${hash} class='fix abs center koyn-notification-content'>

          <div class='abs center'>
              ${renderKoynLogo(value, type)}
          </div>

    </${hash}>
  `
  );
  setTimeout(() => s(hash).remove(), 1000);
};
