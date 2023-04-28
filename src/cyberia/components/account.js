const account = () => {
  setTimeout(() => {
    let validEmail = false;
    const checkEmail = async () => {
      const value = s('.session-account-input-email').value;
      const result = emailValidator(value);
      console.log('checkEmail', result);
      if (!result.validate) {
        htmls('.session-account-warn-email', result.msg);
        validEmail = false;
      } else {
        htmls('.session-account-warn-email', '');
        validEmail = true;
      }
      if (value !== '') htmls('.session-account-label-email', 'Email');
      else htmls('.session-account-label-email', '');
      // if (validEmail === true) {
      //   const result = await serviceRequest(API_BASE + '/auth/validate/email/' + value);
      //   if (result.status === 'error' && result.data.errors) {
      //     validEmail = false;
      //     result.data.errors.map((error) => {
      //       htmls('.session-account-warn-' + error.type, error.result.msg);
      //     });
      //   }
      // }
    };
    s('.session-account-input-email').onblur = checkEmail;
    s('.session-account-input-email').oninput = checkEmail;

    s('.btn-account-confirm-email').onclick = async () => {
      htmls('.session-account-warn-email', ``);
      if (!localStorage.getItem('_b')) return;

      s('.account-email-btns').style.display = 'none';
      s('.session-account-input-email').style.display = 'none';
      s('.session-account-warn-email').style.display = 'none';
      s('.account-email-loading').style.display = 'block';

      const body = JSON.stringify({});
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('_b')}`,
        'Content-Type': 'application/json',
        // 'content-type': 'application/octet-stream'
        //  'content-length': CHUNK.length,
      };
      const result = await serviceRequest(API_BASE + '/auth/confirm/email', {
        method: 'POST',
        headers,
        body,
        log: true,
      });

      s('.account-email-loading').style.display = 'none';
      s('.account-email-btns').style.display = 'block';
      s('.session-account-input-email').style.display = 'block';
      s('.session-account-warn-email').style.display = 'block';

      const msg = renderLang({
        es: 'Email de confirmacion enviado',
        en: 'Confirmation email has been sent to your inbox',
      });
      // renderNotification('success', msg);
      htmls('.session-account-warn-email', `<span style='color: green'>${msg}</span>`);
    };
  });
  return /*html*/ `
        <account style='display: none'>
            <sub-content-gui class='in'>

                    <div class='in title-section'>${renderLang({ es: 'Cuenta', en: 'Account' })}</div>
                    <div class='in account-section'>
                        <label class='in session-account-label-email'></label>
                        <input type='email' disabled class='session-account-input-email' placeholder='${renderLang({
                          es: 'Email',
                          en: 'Email',
                          placeholder: '.session-account-input-email',
                        })}'>                       
                        <div class='in account-email-btns'>
                            <button class='inl btn-account-section custom-cursor'>
                                ${renderLang({ es: 'Cambiar Email', en: 'Change Email' })}
                            </button>
                            <button class='inl btn-account-section custom-cursor btn-account-confirm-email'>
                                ${renderLang({ es: 'Confirmar Email', en: 'Confirm Email' })}
                            </button>
                        </div>
                        <div class='in account-email-loading' style='display: none'>
                             <div class='abs center' style='top: 60%'>${renderSpinner()}</div>
                        </div>
                        <input-warn class='in session-account-warn-email'></input-warn> 
                    </div>
                    

            </sub-content-gui>
        </account>
    `;
};
