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
  });
  return /*html*/ `
        <account style='display: none'>
            <sub-content-gui class='in'>

                    <div class='in title-section'>${renderLang({ es: 'Cuenta', en: 'Account' })}</div>

                    <label class='in session-account-label-email'></label>
                    <input type='email' disabled class='session-account-input-email' placeholder='${renderLang({
                      es: 'Email',
                      en: 'Email',
                      placeholder: '.session-account-input-email',
                    })}'>                        
                    <div class='in footer-account-section'>
                        <button class='inl btn-account-section custom-cursor'>
                            ${renderLang({ es: 'Cambiar Email', en: 'Change Email' })}
                        </button>
                        <button class='inl btn-account-section custom-cursor'>
                            ${renderLang({ es: 'Confirmar Email', en: 'Confirm Email' })}
                        </button>
                        <input-warn class='in session-account-warn-email'></input-warn> 
                    </div>
                    

            </sub-content-gui>
        </account>
    `;
};
