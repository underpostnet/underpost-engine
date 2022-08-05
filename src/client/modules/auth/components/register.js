

this.register = {
    init: function () {



        const IDS = s4();
        this[IDS] = range(0, maxIdComponent).map(() => 'register-' + s4());



        let inputsData = [
            {
                model: 'email',
                matrix: [0, 1, 2],
                displayName: renderLang({ es: 'email', en: 'email' }),
                options: {
                    type: 'email',
                    autocomplete: 'new-password'
                },
                validator: () => true,
                getValue: () => s(`.${this[IDS][1]}`).value
            },
            {
                model: 'pass',
                matrix: [3, 4, 5],
                displayName: renderLang({ es: 'contraseña', en: 'password' }),
                options: {
                    type: 'password',
                    autocomplete: 'new-password'
                },
                validator: (inputId, labelId) => {
                    if (s('.' + this[IDS][inputId]).value == s('.' + this[IDS][7]).value) {
                        s('.' + this[IDS][8]).style.display = 'none';
                    }
                    return true;
                },
                getValue: () => s(`.${this[IDS][4]}`).value
            },
            {
                model: 'repeat_pass',
                matrix: [6, 7, 8],
                displayName: renderLang({ es: 'repetir contraseña', en: 'repeat password' }),
                options: {
                    type: 'password',
                    autocomplete: 'new-password'
                },
                validator: (inputId, labelId) => {
                    if (s('.' + this[IDS][inputId]).value != s('.' + this[IDS][4]).value) {
                        htmls('.' + this[IDS][labelId], errorIcon + ' invalid match password');
                        fadeIn(s('.' + this[IDS][labelId]));
                        return false;
                    }
                    return true;
                },
                getValue: () => s(`.${this[IDS][7]}`).value
            },

        ];

        setTimeout(() => {
            s('.' + this[IDS][9]).onclick = e => {
                e.preventDefault();

                [1, 4, 7].map(x => s('.' + this[IDS][x]).oninput());

                if ([2, 5, 8].filter(x => s('.' + this[IDS][x]).style.display == 'block').length > 0) {
                    console.error('invalid form');
                    return;
                };

                let body = {};

                inputsData.map(inputsData =>
                    body[inputsData.model] = inputsData.getValue());

                console.log('Auth Obj body', body);

                const url = () => `/api/${uriAuth}`;
                const method = 'POST';
                const headers = {
                    'Content-Type': 'application/json',
                    // 'content-type': 'application/octet-stream'
                    //  'content-length': CHUNK.length,
                };

                console.log('init fetch body:', body);

                (async () => {
                    s('.' + this[IDS][11]).style.display = 'none';
                    fadeIn(s('.' + this[IDS][10]));
                    const requestResult = await serviceRequest(url, {
                        method,
                        headers,
                        body: JSON.stringify(body), // : method == 'GET' ? undefined : JSON.stringify(body)
                    });
                    console.log('end fetch requestResult:', requestResult);
                    s('.' + this[IDS][10]).style.display = 'none';
                    fadeIn(s('.' + this[IDS][11]));
                })();

            };
        });

        return /*html*/`
                <form class='in container ${this[IDS][11]}'>

                    ${inputsData.map(dataInput => renderInput(
            this[IDS],
            dataInput.displayName,
            dataInput.matrix,
            dataInput.validator,
            dataInput.options
        )).join('')}

        
        <button class='${this[IDS][9]}'>
            ${renderLang({ es: 'Iniciar Sesion', en: 'Log In' })}
        </button>                        
                </form> 
                ${renderSpinner(this[IDS][10])}
        `
    }
};