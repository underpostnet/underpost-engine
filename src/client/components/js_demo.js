this.js_demo = {
    init: function (options) {
        // https://prismjs.com/download.html
        const IDS = s4();
        this.IDS = IDS;
        this[IDS] = range(0, maxIdComponent).map(() => 'js_demo-' + s4());
        this.idDemo = `demo-${s4()}`;


        setTimeout(() => {




            const liveJS = () => {
                const contentEval = s('.' + this[IDS][0]).value.replaceAll(`'body'`, `'${this.idDemo}'`);
                const displayJS = contentEval.replaceAll(`'${this.idDemo}'`, `'body'`);

                setTimeout(() => {
                    try {
                        eval(contentEval);
                        s('.' + this[IDS][2]).style.display = 'none';
                    } catch (error) {
                        htmls('.' + this[IDS][2], errorIcon + error.message);
                        fadeIn(s('.' + this[IDS][2]));
                    }
                });

                /*
                   type='application/javascript' src='./vanilla.js'
                     <pre><code class="language-html">
                    ${Prism.highlight(`
                    <link rel='stylesheet' href='./base.css'>
                    `, 
                    Prism.languages.html, 'html')}
                     </code></pre>
                     `\n    import '/vanilla.js';\n\n`
                */
                htmls(this.idDemo, '');
                htmls('.' + this[IDS][1], /*html*/`<code>${Prism.highlight(displayJS, Prism.languages.javascript, 'javascript')}</code>`);
                s('.' + this[IDS][8]).onclick = async () => {
                    await copyData(displayJS);
                    append('body', renderFixModal({
                        id: 'mini-modal-' + s4(),
                        icon: sucessIcon,
                        color: 'green',
                        content: renderLang({ es: 'Contenido Copiado al Portapapeles', en: 'Copy to Clipboard' })
                    }));
                };
            };

            s('.' + this[IDS][0]).onblur = () =>
                liveJS();
            s('.' + this[IDS][0]).oninput = () =>
                liveJS();

            s('.' + this[IDS][0]).addEventListener('keydown', function (e) {
                if (e.key == 'Tab') {
                    e.preventDefault();
                    const start = this.selectionStart;
                    const end = this.selectionEnd;

                    // set textarea value to: text before caret + tab + text after caret
                    this.value = this.value.substring(0, start) +
                        "\t" + this.value.substring(end);

                    // put caret at right position again
                    this.selectionStart =
                        this.selectionEnd = start + 1;
                    liveJS();
                }
            });


            s('.' + this[IDS][6]).onclick = () => {


                if (validateSubmitInput(this[IDS][4], this[IDS][5])) return;
                // append(this[IDS][4], /*html*/`
                // <div class='in container'>
                //     ${tinymce.activeEditor.getContent()}
                // </div>
                // `);


                if (s('.' + this[IDS][2]).style.display != 'none')
                    return fadeIn(s('.' + this[IDS][2]));



                let body = new FormData();


                body.append(s4(), new File([new Blob([s('.' + this[IDS][0]).value])], 'f' + s4() + '.js'));


                const url = () => `${buildBaseApiUri()}/api/${apiUploader}`;
                const method = 'POST';
                const headers = {
                    'Authorization': renderAuthBearer()
                    // 'Content-Type': 'application/json',
                    // 'content-type': 'application/octet-stream'
                    //  'content-length': CHUNK.length,
                };
                body.append('indexFolder', '2');
                body.append('title', s('.' + this[IDS][4]).value);
                body.append('public', s('.' + this[IDS][7]).checked);

                if (this.update) {
                    body.append('update', JSON.stringify(this.update));
                }


                (async () => {

                    const requestResult = await serviceRequest(url, {
                        method,
                        headers,
                        body, // : method == 'GET' ? undefined : JSON.stringify(body)
                    });

                    console.log('request', requestResult);

                    if (requestResult.status == 'success') {
                        s('.' + this[IDS][0]).value = '';
                        clearInput(this[IDS], [3, 4, 5]);
                        append('body', renderFixModal({
                            id: 'mini-modal-' + s4(),
                            icon: sucessIcon,
                            color: 'green',
                            content: renderLang({ es: 'Contenido Enviado', en: 'Saved Content' })
                        }));
                        GLOBAL['current-view-content'] = requestResult.data;
                        if (this.update.username) GLOBAL['current-view-content'].username = newInstance(this.update.username);
                        this.update = false;
                        GLOBAL.router({ newPath: buildBaseUri() + '/view-content' });
                    } else {
                        append('body', renderFixModal({
                            id: 'mini-modal-' + s4(),
                            icon: errorIcon,
                            color: 'red',
                            content: requestResult.data
                        }));
                    }

                })();
            }

        });
        return /*html*/`
        <style>
            .js_demo_code_content {
                min-height: 200px;
            }
            .js_demo_textarea {
                min-width: 100%;
                max-width: 100%;
                top: 0%;
                left: 0%;
                background: none;
                font-size: 18px;
                color: transparent;
                caret-color: ${mainColor};
                height: 100%;
                overflow: hidden;
            }
            .js_demo_cell {
                overflow: auto;
            }
            .container-demo {
                min-height: 200px;
                overflow: auto;
            }
            .code-display {
                overflow: auto;
                margin: 0;
                background: none;
                max-width: 100%;
            }
        </style>
        ${renderMediaQuery([
            {
                limit: 0,
                css: /*css*/`
                .js_demo_cell {
                    width: 100%;
                }
            `},
            {
                limit: 1000,
                css: /*css*/`
                .js_demo_cell {
                    width: 50%;
                }
            `}
        ])}
            <div class='in container' style='${options && options.mode == 'home_example' ? 'display: none' : ''}'>
                ${renderInput(this[IDS], renderLang({ es: 'Titulo', en: 'Title' }), [3, 4, 5])}
            </div>
            <div class='in container'>    
                <div class='fl'>
                    <div class='in' style='overflow: hidden !important'>
                        <div class='in container title'>
                            CODE
                        </div>
                        <div class='in container'>
                            <button class='${this[IDS][8]}'> 
                                <i class='fa fa-clone' aria-hidden='true'></i> 
                                ${renderLang({ es: 'Copiar', en: 'Copy' })}
                            </button>
                        </div>
                        <div class='in container js_demo_code_content'>
                            <pre  class='in code-display ${this[IDS][1]}' style='overflow: hidden'></pre>
                            <textarea class='abs js_demo_textarea ${this[IDS][0]}' spellcheck='false'></textarea>
                        </div>
                        <div class='in error-input ${this[IDS][2]}'></div>
                    </div>
                    <div class='in'>
                        <div class='in container title'>
                            DEMO
                        </div>
                        <div class='in container container-demo'>
                            <${this.idDemo}></${this.idDemo}>
                        </div>
                    </div>
                </div>
            </div>
            <!--
            <div class='in container title'>
                LIVE CODE
            </div>
            <div class='in container'>
                <textarea class='in js_demo_textarea ${this[IDS][0]}' placeholder='Code...'></textarea>
            </div>
            -->
            <div class='in container' style='${options && options.mode == 'home_example' ? 'display: none' : ''}'>
                <button class='${this[IDS][6]}'>${renderLang({ es: 'Enviar', en: 'Send' })}</button>
                ${renderToggleSwitch({
            id: this[IDS][7], label: [
                renderLang({ es: `Privado`, en: `Private` }),
                renderLang({ es: `Publico`, en: `Public` })
            ]
        })}
            </div>   
        `
    },
    renderView: function (dataFile, rawContent, timeOutDelay) {
        const idDemo = `demo-${s4()}`;
        const contentEval = rawContent.replaceAll(`'body'`, `'${idDemo}'`);
        const displayJS = contentEval.replaceAll(`'${idDemo}'`, `'body'`);
        const idCopy = 'x' + s4();
        setTimeout(() => {
            try {
                eval(contentEval);
            } catch (error) {
                console.warn('eval js renderView', error);
            }
            if (s('.' + idCopy)) s('.' + idCopy).onclick = async () => {
                await copyData(displayJS);
                append('body', renderFixModal({
                    id: 'mini-modal-' + s4(),
                    icon: sucessIcon,
                    color: 'green',
                    content: renderLang({ es: 'Contenido Copiado al Portapapeles', en: 'Copy to Clipboard' })
                }));
            };
        }, timeOutDelay);
        return /*html*/`
            <div class='in container container-demo'>
                <${idDemo}></${idDemo}>
            </div>
            <div class='in'>
                <button class='${idCopy}'> 
                    <i class='fa fa-clone' aria-hidden='true'></i> 
                    ${renderLang({ es: 'Copiar', en: 'Copy' })}
                </button>
            </div>
            <pre  class='in code-display'><code>${Prism.highlight(displayJS, Prism.languages.javascript, 'javascript')}</code></pre>            
        `;
    },
    routerDisplay: function () {
        if (GLOBAL['current-edit-content']) {
            setValueInput(this[this.IDS], [3, 4, 5], GLOBAL['current-edit-content'].title);
            s('.' + this[this.IDS][0]).value = GLOBAL['current-edit-content'].raw;
            s('.' + this[this.IDS][0]).oninput();
            this.update = newInstance(GLOBAL['current-edit-content']);
            setTimeout(() => GLOBAL['current-edit-content'] = undefined);
        } else {
            try {
                clearInput(this[this.IDS], [3, 4, 5]);
                s('.' + this[this.IDS][0]).value = '';
                s('.' + this[this.IDS][0]).oninput();
                this.update = false;
                if (JSON.parse(s(`.${this[this.IDS][7]}`).checked))
                    s(`.ts-container-${this[this.IDS][7]}`).click();
            } catch (error) { console.warn(error) }
        }
        if (GLOBAL['current-edit-content'] &&
            JSON.parse(s(`.${this[this.IDS][7]}`).checked) != GLOBAL['current-edit-content'].public)
            s(`.ts-container-${this[this.IDS][7]}`).click();
    }
};


