const banner = () => /*html*/ `
    <div class='in container banner' style='${borderChar(1, 'white')}'>
        <span style='${borderChar(1, 'yellow')}'>
            KO<span class='inl' style='color: red; font-size: 50px; top: 5px; ${borderChar(1, 'white')}'>λ</span>N
            <br>
            Wallet
        </span>               
    </div>
`;

const renderSpinner = () => /*html*/ `
    <div class='abs center'>
        <div class='lds-ring'><div></div><div></div><div></div><div></div></div>
    </div>
`;

const renderNotification = (status, message) => {
  const hash = 'notification-' + s4() + s4();
  append(
    'body',
    /*html*/ `
  <style>
    .${hash} {
      width: 200px;
      height: 100px;
      background: rgba(0,0,0,0.8);
      color: ${status === 'success' ? 'green' : 'red'};
      ${borderChar(1, 'black')}
      border: 3px solid ${status === 'success' ? 'green' : 'red'};
    }
  </style>
  <div class='fix center ${hash}'>
      <div class='abs center'>
          <span style='font-size: 20px'>
            ${status === 'success' ? '&check;' : '&#215;'}
          </span>
          <br>
          <br>
          <span style='font-size: 10px'>
            ${message}
          </span>
      </div>
  </div>
  
  `
  );
  setTimeout(() => {
    s(`.${hash}`).remove();
  }, 1500);
};

append(
  'body',
  /*html*/ `
  
            ${banner()}

            <div class='in container'>
                <h1> ${renderLang({ es: 'Crear Llaves', en: 'Create Keys' })} </h1>
                <form>
                  <div class='in spinner-content' style='display: none'>
                          ${renderSpinner()}
                  </div>
                  <div class='in create-keys-form-btns'>
                    
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

                  </div>

                    <div class='in warn-input create-key-warn-server'></div>

                    <div class='in'>
                        <pre class='view-config-content'></pre> 
                    </div>

                </form>
                <create-keys-result></create-keys-result>
            </div>

`
);

const cleanForm = () => {
  s('.create-key-input-password').value = '';
  htmls('.create-key-label-password', '');
  htmls('.create-key-warn-password', '');
};

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
  htmls('create-keys-result', '');
  s('.create-keys-form-btns').style.display = 'none';
  s('.spinner-content').style.display = 'block';
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
    if (result.status === 'success') {
      const { SHA256_HEX_PUBLIC_KEY, publicKey } = result.data;
      htmls(
        'create-keys-result',
        `
        <b style='color: yellow'> SHA256_HEX_PUBLIC_KEY: </b>
        <br><br>
          ${SHA256_HEX_PUBLIC_KEY} 
        <br><br>
        <b style='color: yellow'> PUBLIC PEM: </b>
        <br><br>
        <pre>
          ${publicKey}
        </pre>
    `
      );
      cleanForm();
    }
    renderNotification(result.status, result.data.message);
  }
  s('.spinner-content').style.display = 'none';
  s('.create-keys-form-btns').style.display = 'block';
};

let openConfig = false;
s('.config-key-btn').onclick = (e) => {
  e.preventDefault();
  if (!openConfig) {
    openConfig = true;
    htmls('.view-config-content', ' type: ' + keyType + '\n\n' + JSON.stringify(keyConfig(), null, 4));
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
