const createAccount = () => {
  setTimeout(() => {
    let validEmail = false;
    const checkEmail = async (options) => {
      const value = s('.create-account-input-email').value;
      const result = emailValidator(value);
      console.log('checkEmail', result);
      if (!result.validate) {
        htmls('.create-account-warn-email', result.msg);
        validEmail = false;
      } else {
        htmls('.create-account-warn-email', '');
        validEmail = true;
      }
      if (value !== '') htmls('.create-account-label-email', 'Email');
      else htmls('.create-account-label-email', '');
      if (validEmail === true) {
        const result = await serviceRequest('/api/v1/auth/validate/email/' + value);
        if (result.status === 'error' && result.data.errors) {
          validEmail = false;
          result.data.errors.map((error) => {
            htmls('.create-account-warn-' + error.type, error.result.msg);
          });
        }
      }
    };
    s('.create-account-input-email').onblur = checkEmail;
    s('.create-account-input-email').oninput = checkEmail;

    let validUsername = false;
    const checkUsername = async (options) => {
      const value = s('.create-account-input-username').value;
      const result = usernameValidator(value);
      console.log('checkUsername', result);
      if (!result.validate) {
        htmls('.create-account-warn-username', result.msg);
        validUsername = false;
      } else {
        htmls('.create-account-warn-username', '');
        validUsername = true;
      }
      if (value !== '')
        htmls(
          '.create-account-label-username',
          renderLang({
            es: 'Nombre de usuario',
            en: 'Username',
          })
        );
      else htmls('.create-account-label-username', '');
      if (validUsername === true) {
        const result = await serviceRequest('/api/v1/auth/validate/username/' + value);
        if (result.status === 'error' && result.data.errors) {
          validUsername = false;
          result.data.errors.map((error) => {
            htmls('.create-account-warn-' + error.type, error.result.msg);
          });
        }
      }
    };
    s('.create-account-input-username').onblur = checkUsername;
    s('.create-account-input-username').oninput = checkUsername;

    let validPassword = false;
    const checkPassword = (options) => {
      const value = s('.create-account-input-password').value;
      if (value !== '') checkRepeatPassword();
      const result = passwordValidator(value);
      console.log('checkPassword', result);
      if (!result.validate) {
        htmls('.create-account-warn-password', result.msg);
        validPassword = false;
      } else {
        htmls('.create-account-warn-password', '');
        validPassword = true;
      }
      if (value !== '')
        htmls(
          '.create-account-label-password',
          renderLang({
            en: 'Password',
            es: 'Contraseña',
          })
        );
      else htmls('.create-account-label-password', '');
    };
    s('.create-account-input-password').onblur = checkPassword;
    s('.create-account-input-password').oninput = checkPassword;

    let validRepeatPassword = false;
    const checkRepeatPassword = (options) => {
      const value = s('.create-account-input-repeat-password').value;
      const result = passwordMatchValidator(s('.create-account-input-password').value, value);
      console.log('checkRepeatPassword', result);
      if (!result.validate) {
        htmls('.create-account-warn-repeat-password', result.msg);
        validRepeatPassword = false;
      } else {
        htmls('.create-account-warn-repeat-password', '');
        validRepeatPassword = true;
      }
      if (value !== '')
        htmls(
          '.create-account-label-repeat-password',
          renderLang({
            en: 'Repeat Password',
            es: 'Repetir Contraseña',
          })
        );
      else htmls('.create-account-label-repeat-password', '');
    };
    s('.create-account-input-repeat-password').onblur = checkRepeatPassword;
    s('.create-account-input-repeat-password').oninput = checkRepeatPassword;

    s('.btn-submit-create-account').onclick = async (e) => {
      s('.btn-submit-create-account').style.display = 'none';
      s('.create-account-loading').style.display = 'block';
      e.preventDefault();
      await checkEmail();
      await checkUsername();
      await checkPassword();
      await checkRepeatPassword();
      console.log(e);
      console.log('validEmail', validEmail);
      console.log('validUsername', validUsername);
      console.log('validPassword', validPassword);
      console.log('validRepeatPassword', validRepeatPassword);

      const body = JSON.stringify({
        username: s('.create-account-input-username').value,
        email: s('.create-account-input-email').value,
        password: s('.create-account-input-password').value,
        repeat_password: s('.create-account-input-repeat-password').value,
      });
      const headers = {
        // 'Authorization': renderAuthBearer(),
        'Content-Type': 'application/json',
        // 'content-type': 'application/octet-stream'
        //  'content-length': CHUNK.length,
      };
      console.log('.submit-create-account body', body);
      if (validEmail && validUsername && validPassword && validRepeatPassword) {
        const result = await serviceRequest('/api/v1/auth/register', {
          method: 'POST',
          headers,
          body,
          log: true,
        });
        if (result.status === 'error') {
          if (result.data.errors)
            result.data.errors.map((error) => {
              htmls('.create-account-warn-' + error.type, error.result.msg);
            });
          else htmls('.create-account-warn-server', result.data.message);
        }
        renderNotification(result.status, result.data.message);
      } else {
        renderNotification('error', renderLang({ es: 'Campo inválido existente', en: 'Invalid fields' }));
      }
      s('.create-account-loading').style.display = 'none';
      s('.btn-submit-create-account').style.display = 'block';
    };
  });
  return /*html*/ `
    <create-account style='display: none'>
    <sub-content-gui class='in'>
      <form>
      <!--
          autocomplete="new-password"
          autocomplete="username"
      -->
  
          ${renderLang({ es: 'Crear cuenta', en: 'Create Account' })}
        <hr>
        <label class='in create-account-label-username'></label>
        <input type='text' class='create-account-input-username' placeholder='${renderLang({
          es: 'Nombre de usuario',
          en: 'Username',
        })}'>
        <input-warn class='in create-account-warn-username'></input-warn>
      
        <label class='in create-account-label-email'></label>
        <input type='email' class='create-account-input-email' placeholder='${renderLang({
          es: 'Email',
          en: 'Email',
        })}'>
        <input-warn class='in create-account-warn-email'></input-warn>
        <label class='in create-account-label-password'></label>
        <input type='password'  class='create-account-input-password' autocomplete="new-password" placeholder='${renderLang(
          {
            en: 'Password',
            es: 'Contraseña',
          }
        )}'>
        <input-warn class='in create-account-warn-password'></input-warn>
        <label class='in create-account-label-repeat-password'></label>
        <input type='password'  class='create-account-input-repeat-password' autocomplete="new-password" placeholder='${renderLang(
          {
            en: 'Repeat Password',
            es: 'Repetir Contraseña',
          }
        )}'>
        <input-warn class='in create-account-warn-repeat-password'></input-warn>
      
        <div class='in' style='margin-top: 15px;'>
          <button type='submit' class='inl btn-submit-create-account custom-cursor'>
            ${renderLang({ es: 'Registrar', en: 'Register' })}
          </button>
          <div class='in content-loading-btn create-account-loading' style='display: none'>
              ${renderSpinner()}
          </div>
          <input-warn class='in create-account-warn-server'></input-warn>
        </div>
      </form>
    </sub-content-gui>
   </create-account>
    `;
};
