const bag = () => {
  return /*html*/ `
    <bag style='display: none'>
      <sub-content-gui class='in'>

             ${renderLang({ es: 'Mochila', en: 'Bag' })}
            <hr>

            <div class='inl coin-value-content' style='${borderChar(2, 'black')}'>
                <div class='fl'  style='height: 100%;'>
                    <div class='in fll' style='width: 50%; height: 100%;'>
                      <img class='abs center koyn-gif' src='/gifs/koyn.gif'>
                      <div class='abs center'>
                        Ko<span style='color: red;'>λ</span>n
                      </div>
                    </div>
                    <div class='in fll' style='width: 50%; height: 100%; background: #090909;'>
                      <div class='abs center value-koyn-text'>
                         0
                      </div>
                    </div>
                </div>
            </div>

            <br>

            <div class='inl coin-value-content' style='${borderChar(2, 'black')}'>
                <div class='fl'  style='height: 100%;'>
                    <div class='in fll' style='width: 50%; height: 100%;'>
                      <img class='abs center koyn-gif' src='/gifs/koyn.gif'>
                      <div class='abs center'>
                        <span style='color: black; font-weight: bold; ${borderChar(1, 'white')}'>
                          Crypto
                        </span>
                        <br>
                        Ko<span style='color: red;'>λ</span>n
                      </div>
                    </div>
                    <div class='in fll' style='width: 50%; height: 100%; background: #090909;'>
                      <div class='abs center value-koyn-text'>
                         0
                      </div>
                    </div>
                </div>
            </div>


           

      </sub-content-gui>
    </bag>
    `;
};
