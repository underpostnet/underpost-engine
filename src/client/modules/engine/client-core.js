

const uriApi = 'editor';


this.vanilla_js = {

    init: function () {

        return /*html*/`
            <div class='in container'>
                    
                    vanilla js
            
            </div>
        `
    }

};


this.markdown = {
    init: function () {
        const IDS = s4();
        this[IDS] = range(0, maxIdComponent).map(() => 'editor-' + s4());

        // let labelInputs = [1];
        // let inputValueContent = [2];
        // let errorsIdInput = [3];

        setTimeout(() => {
            marked.setOptions();

            this.instance = new SimpleMDE({ element: s('.markdown-editor') });

            s('.' + this[IDS][0]).onclick = () => {
                append(this[IDS][1], /*html*/`
                    <div class='in container'>
                        <div class='in markdown-css' style='background: #d9d9d9'>
                            ${marked.parse(this.instance.value())}
                        </div> 
                    </div>               
                `);
            };
        });
        return /*html*/`
        <${this[IDS][1]}></${this[IDS][1]}>
        <div class='in container' style='background: white'>
            <textarea class='markdown-editor'></textarea>
        </div>
        <div class='in container'>
            <button class='${this[IDS][0]}'>${renderLang({ es: 'Enviar', en: 'Send' })}</button>
        </div>
        `
    }
};

this.editor = {
    init: function () {
        const IDS = s4();
        this[IDS] = range(0, maxIdComponent).map(() => 'editor-' + s4());

        let labelInputs = [1];
        let inputValueContent = [2];
        let errorsIdInput = [3];

        // let url = () => `/api/${uriApi}/create-key`;
        // let method = 'POST';

        const topLabelInput = '35px';
        const botLabelInput = '0px';

        setTimeout(() => {

            const renderMsgInput = (ID, MSG, STATUS) => {
                htmls('.' + this[IDS][ID], (STATUS ? sucessIcon : errorIcon) + MSG);
                fadeIn(s('.' + this[IDS][ID]));
            };

            const checkInput = (i, inputId) => {
                if (s('.' + this[IDS][inputId]).value == '') {
                    s('.' + this[IDS][labelInputs[i]]).style.top = topLabelInput;
                    renderMsgInput(errorsIdInput[i], renderLang({ es: 'Campo vacio', en: 'Empty Field' }));
                    return false;
                }
                s('.' + this[IDS][labelInputs[i]]).style.top = botLabelInput;
                s('.' + this[IDS][errorsIdInput[i]]).style.display = 'none';
                return true;
            };

            const checkAllInput = (setEvent) => inputValueContent.map((inputId, i) => {
                if (setEvent) {
                    s('.' + this[IDS][inputId]).onblur = () =>
                        checkInput(i, inputId);
                    s('.' + this[IDS][inputId]).oninput = () =>
                        checkInput(i, inputId);
                    s('.' + this[IDS][labelInputs[i]]).onclick = () =>
                        s('.' + this[IDS][inputId]).focus();
                    s('.' + this[IDS][inputId]).onclick = () =>
                        s('.' + this[IDS][labelInputs[i]]).style.top = botLabelInput;
                    s('.' + this[IDS][inputId]).onfocus = () =>
                        s('.' + this[IDS][labelInputs[i]]).style.top = botLabelInput;
                    return;
                };
                return s('.' + this[IDS][inputId]).oninput();
            }).filter(x => x == false).length === 0;

            checkAllInput(true);

            tinymce.init({
                selector: 'textarea#my-expressjs-tinymce-app',
                min_height: 400,
                menubar: true,
                plugins: [
                    'advlist',
                    'anchor',
                    'autolink',
                    'autoresize',
                    'autosave',
                    'charmap',
                    'code',
                    'codesample',
                    'directionality',
                    'emoticons',
                    'fullscreen',
                    'help',
                    'image',
                    'importcss',
                    'insertdatetime',
                    'link',
                    'lists',
                    'media',
                    'nonbreaking',
                    'pagebreak',
                    'preview',
                    'quickbars',
                    'save',
                    'searchreplace',
                    'table',
                    'template',
                    'visualblocks',
                    'visualchars',
                    'wordcount'
                ],
                toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help'
            });

            s('.' + this[IDS][0]).onclick = () => {
                append(this[IDS][4], /*html*/`
                <div class='in container'>
                    ${tinymce.activeEditor.getContent()}
                </div>
                `);
                tinyMCE.activeEditor.setContent('');
            }


        });
        return /*html*/`
           <style>
           </style>
           <${this[IDS][4]}></${this[IDS][4]}>
           <div class='in container'>
                <div class='in label ${this[IDS][1]}' style='top: ${topLabelInput};'>
                ${renderLang({ es: 'Titulo', en: 'Title' })}
                </div>
                <input class='in ${this[IDS][2]}' type='text' autocomplete='off'>
                <div class='in error-input ${this[IDS][3]}'></div>
           </div>
           <div class='in container'>
                      <textarea id='my-expressjs-tinymce-app'></textarea>
           </div>
           <div class='in container'>
                <button class='${this[IDS][0]}'>${renderLang({ es: 'Enviar', en: 'Send' })}</button>
           </div>             
        `
    }
};

//  Asymmetric Key Manager
append('body', /*html*/`
        <div class='in container banner' style='${borderChar(1, 'white')}'>
               ${viewMetaData.mainTitle}
        </div>
        <modal></modal>
        <main>
        ${renderComponents()}
        </main>
        <footer>
            <div class='in container' style='text-align: right'>
                Source Code
                <img src='/assets/github.png' class='inl' style='width: 20px; top: 5px'> 
                <a href='https://github.com/underpostnet/underpost-engine'>GitHub</a>
                <br>
                Developed By
                <img src='/assets/underpost.png' class='inl' style='width: 23px; top: 5px; left: 3px'> 
                <a href='https://underpost.net/'>UNDERpost.net</a>
            </div> 
        </footer>
       
        

`);

// external links modules router
setTimeout(() => {
    append('post_menu_container', /*html*/`
            <button onclick='location.href="/en/vanilla-js"' >vanilla-js</button>
    `);
});

