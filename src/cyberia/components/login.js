const logIn = () => {
  setTimeout(() => {
    const cleanForm = () => {
      s('.login-input-email').value = '';
      s('.login-input-password').value = '';
      htmls('.login-label-email', '');
      htmls('.login-label-password', '');
      htmls('.login-warn-email', '');
      htmls('.login-warn-password', '');
      htmls('.login-warn-server', '');
    };
    let validEmail = false;
    const checkEmail = async (options) => {
      const value = s('.login-input-email').value;
      const result = emailValidator(value);
      console.log('checkEmail', result);
      if (!result.validate) {
        htmls('.login-warn-email', result.msg);
        validEmail = false;
      } else {
        htmls('.login-warn-email', '');
        validEmail = true;
      }
      if (value !== '') htmls('.login-label-email', 'Email');
      else htmls('.login-label-email', '');
    };
    s('.login-input-email').onblur = checkEmail;
    s('.login-input-email').oninput = checkEmail;

    let validPassword = false;
    const checkPassword = (options) => {
      const value = s('.login-input-password').value;
      const result = passwordValidator(value);
      console.log('checkPassword', result);
      if (value === '') {
        htmls('.login-warn-password', result.msg);
        validPassword = false;
      } else {
        htmls('.login-warn-password', '');
        validPassword = true;
      }
      if (value !== '')
        htmls(
          '.login-label-password',
          renderLang({
            en: 'Password',
            es: 'Contraseña',
          })
        );
      else htmls('.login-label-password', '');
    };
    s('.login-input-password').onblur = checkPassword;
    s('.login-input-password').oninput = checkPassword;

    s('.btn-submit-login').onclick = async (e) => {
      s('.btn-submit-login').style.display = 'none';
      s('.login-loading').style.display = 'block';
      e.preventDefault();
      const validatorOptions = { type: 'submit' };
      await checkEmail(validatorOptions);
      await checkPassword(validatorOptions);
      console.log(e);
      console.log('validEmail', validEmail);
      console.log('validPassword', validPassword);

      const body = JSON.stringify({
        email: s('.login-input-email').value,
        password: s('.login-input-password').value,
      });
      const headers = {
        // 'Authorization': renderAuthBearer(),
        'Content-Type': 'application/json',
        // 'content-type': 'application/octet-stream'
        //  'content-length': CHUNK.length,
      };
      console.log('.submit-login body', body);
      if (validEmail && validPassword) {
        // const result = { status: 'success', data: { message: 'test' } };
        const result = await serviceRequest(API_BASE + '/auth/login', {
          method: 'POST',
          headers,
          body,
          log: true,
        });
        if (result.status === 'error') {
          if (result.data.errors)
            result.data.errors.map((error) => {
              htmls('.login-warn-' + error.type, error.result.msg);
            });
          else htmls('.login-warn-server', result.data.message);
        } else {
          cleanForm();
          localStorage.setItem('_b', result.data.token);
          resetEventBoard();
          resetCharacterSlots();
          newMainUserInstance(result.data.element);
        }
        renderNotification(result.status, result.data.message);
      } else {
        renderNotification('error', renderLang({ es: 'Campo inválido existente', en: 'Invalid fields' }));
      }
      s('.login-loading').style.display = 'none';
      s('.btn-submit-login').style.display = 'block';
    };
  });
  return /*html*/ `
    
        <login style='display: none'>
            <sub-content-gui class='in'>
                <form>
                <!--
                    autocomplete="new-password"
                    autocomplete="username"
                -->

                <div class='in title-section'>   ${renderLang({ es: 'Ingresar', en: 'Login' })} </div>
                
                <label class='in login-label-email'></label>
                <input type='email' class='login-input-email' placeholder='${renderLang({
                  es: 'Email',
                  en: 'Email',
                  placeholder: '.login-input-email',
                })}'>
                <input-warn class='in login-warn-email'></input-warn>
                <label class='in login-label-password'></label>
                <input type='password'  class='login-input-password' autocomplete="new-password" placeholder='${renderLang(
                  {
                    en: 'Password',
                    es: 'Contraseña',
                    placeholder: '.login-input-password',
                  }
                )}'>
                <input-warn class='in login-warn-password'></input-warn>
                
                <div class='in' style='margin-top: 15px;'>
                    <button type='submit' class='inl btn-submit-login custom-cursor'>
                    ${renderLang({ es: 'Entrar', en: 'Go' })}
                    </button>
                    <div class='in content-loading-btn login-loading' style='display: none'>
                        ${renderSpinner()}
                    </div>
                    <input-warn class='in content-warn-server login-warn-server'></input-warn>
                </div>
                </form>
            </sub-content-gui>

        </login>
    `;
};
