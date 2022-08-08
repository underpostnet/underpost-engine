this.main_menu = {
    init: function () {
        const IDS = s4();
        this[IDS] = range(0, maxIdComponent).map(() => 'main_menu-' + s4());

        const validatorMenuBtn = path => {
            if (!validateSessionDisplayComponent(path)) {
                return false;
            }
            if ((path.component == 'register' || path.component == 'login') && validateSession()) {
                if (path.component == 'login') {
                    return false;
                }
                setTimeout(() => {
                    append('post_menu_container', /*html*/`
                        <button class='${this[IDS][viewPaths.length + 3]}'>
                            ${renderLang({ es: 'Cerrar Sessión', en: 'Log Out' })}
                        </button>
                    `);
                    s('.' + this[IDS][viewPaths.length + 3]).onclick = () => {
                        localStorage.removeItem('username');
                        localStorage.removeItem('email');
                        localStorage.removeItem('_b');
                        htmls('main_menu', this.init());
                        htmls('session-top-bar', this.renderSessionToBar());
                        closeSessionComponents();
                    };
                });
                return false;
            }
            return true;
        };

        const renderMmenubtn = (path, i) => /*html*/`   
        <button class='${this[IDS][i]}'>${renderLang(path.title)}</button>          
        `;

        setTimeout(() => {

            if (viewPaths[0].menu) prepend('.' + this[IDS][viewPaths.length], renderMmenubtn(viewPaths[0], 0));

            viewPaths.map((path, i) => {

                if (s('.' + this[IDS][i])) s('.' + this[IDS][i]).onclick = () => {
                    console.log('main_menu onclick', path);
                    return GLOBAL.router({ newPath: path.path });
                }

            });

        });
        return /*html*/`
                <session-top-bar>
                    ${this.renderSessionToBar()}
                </session-top-bar> 
                <div class='in container ${this[IDS][viewPaths.length]}'>

                    <pre_menu_container></pre_menu_container>
                    ${viewPaths.map((path, i) => path.menu && i != 0 && validatorMenuBtn(path) ?/*html*/renderMmenubtn(path, i) : '').join('')}
                    <post_menu_container></post_menu_container>
                </div>
                <div class='in container ${this[IDS][viewPaths.length + 1]}' style='display: none'>
                        <button class='${this[IDS][viewPaths.length + 2]}'>${renderLang({ es: 'Menu', en: 'Menu' })}</button> 
                </div>
        `
    },
    renderSessionToBar: () => {
        if (!validateSession()) return '';
        return /*html*/`
        <div class='in container'>
            ${renderLang({ es: 'Hola, ', en: 'Hi, ' })} ${strCap(localStorage.getItem('username').replaceAll('-', ' '))}
        </div>  
        `
    }
};