const banner = () => /*html*/ `
    <div class='in container banner' style='${borderChar(1, 'white')}'>
        <span style='${borderChar(1, 'yellow')}'>
            KO<span class='inl' style='color: red; font-size: 50px; top: 5px; ${borderChar(1, 'white')}'>λ</span>N
            <br>
            Wallet
        </span>               
    </div>
`;

append(
  'body',
  /*html*/ `

<style>

    body {
        background: black;
        color: #cfcfcf;
        font-family: arial;
    }

    a {
        color: yellow;
        text-decoration: underline;
    }

    a:hover {
        color: white;
    }

    .banner {
        font-weight: bold;
        color: black;
        font-size: 25px;
    }
    .container {
        max-width: 1200px;
        margin: auto;
        border: 3px solid #141414;
        padding: 10px;
    }

  

      button {
        background: black;
        border: 4px solid yellow;
        padding: 10px;
        color: yellow;
        cursor: pointer;
        padding: 5px;
        margin: 5px;
      }
      button:hover {
        border: 4px solid white;
        color: white;
      }

      input {
        outline: none !important;
        border: none;
        padding: 10px;
        font-size: 20px;
      }

      .warn-input {
        color: red;
        font-size: 14px;
        padding: 4px;
        height: 12px;
        ${borderChar(1, 'black')}
        padding: 5px;
        margin: 5px;
        border-top: 2px solid black;
      }
      .label-input {
        color: yellow;
        font-size: 14px;
        padding: 4px;
        height: 12px;
        ${borderChar(1, 'black')}
        padding: 5px;
        margin: 5px;
      }

      h1  { color: yellow }
      
</style>

            ${banner()}

            <div class='in container'>
                <h1> ${renderLang({ es: 'Crear Llaves', en: 'Create Keys' })} </h1>
                <form>
                    
                    <label class='in label-input create-key-label-password'></label>
                    <input type='password' autocomplete='new-password' placeholder='${renderLang({
                      es: 'Contraseña',
                      en: 'Password',
                    })}' class='in create-key-input-password'>
                    <div class='in warn-input create-key-warn-password'></div>

                    <button type='submit' class='create-key-submit-btn btn-style'>${renderLang({
                      es: 'Crear Llaves',
                      en: 'Create key',
                    })}</button>

                    <button class='config-key-btn btn-style'>${renderLang({
                      es: 'Ver Configuración',
                      en: 'See configuration',
                    })}</button>

                    <div class='in warn-input create-key-warn-server'></div>

                    <div class='in'>
                        <pre class='view-config-content'></pre> 
                    </div>

                </form>
                <!--
                <pre class='in public-key-display'></pre>
                <pre class='in private-key-display'></pre>
                -->
            </div>

`
);

let validPassword = false;
const checkPassword = () => {
  const value = s('.create-key-input-password').value;
  if (value === '') {
    validPassword = false;
    htmls('.create-key-warn-password', renderLang({ en: 'Empty field', es: 'Campo vacío' }));
    s('.create-key-warn-password').style.borderTop = '2px solid red';
    htmls('.create-key-label-password', '');
  } else {
    validPassword = true;
    htmls('.create-key-warn-password', '');
    s('.create-key-warn-password').style.borderTop = '2px solid black';
    htmls(
      '.create-key-label-password',
      renderLang({
        es: 'Contraseña',
        en: 'Password',
      })
    );
  }
};
s('.create-key-input-password').onblur = checkPassword;
s('.create-key-input-password').oninput = checkPassword;

s('.create-key-submit-btn').onclick = async (e) => {
  e.preventDefault();
  checkPassword();

  const body = JSON.stringify({
    passphrase: s('.create-key-input-password').value,
  });
  const headers = {
    // 'Authorization': renderAuthBearer(),
    'Content-Type': 'application/json',
    // 'content-type': 'application/octet-stream'
    //  'content-length': CHUNK.length,
  };
  console.log('.submit-create-account body', body);
  if (validPassword) {
    const result = await serviceRequest(API_BASE + '/keys/create', {
      method: 'POST',
      headers,
      body,
      log: true,
    });
  }
};

let openConfig = false;
s('.config-key-btn').onclick = (e) => {
  const keyConfigDisplay = newInstance(keyConfig);
  delete keyConfigDisplay.privateKeyEncoding.passphrase;
  e.preventDefault();
  if (!openConfig) {
    openConfig = true;
    htmls('.view-config-content', ' type: ' + keyType + '\n\n' + JSON.stringify(keyConfigDisplay, null, 4));
    htmls(
      '.config-key-btn',
      renderLang({
        es: 'Ocultar Configuración',
        en: 'Hide configuration',
      })
    );
  } else {
    openConfig = false;
    htmls('.view-config-content', '');
    htmls(
      '.config-key-btn',
      renderLang({
        es: 'Ver Configuración',
        en: 'See configuration',
      })
    );
  }
};
