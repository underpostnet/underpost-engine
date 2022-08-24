this.router = options => {
    console.log('INIT ROUTER', options);
    let valid = false;
    let testEvalPath;
    try {
        testEvalPath = options.newPath;
        // -----------------------------------------------------------------------
        // params uri validator --------------------------------------------------
        const uriParam = testEvalPath.split('/').pop().split(':').pop();
        if (localStorage.getItem(uriParam)) {
            testEvalPath = testEvalPath.replace(`:${uriParam}`, localStorage.getItem(uriParam));
        }
        // -----------------------------------------------------------------------
        // -----------------------------------------------------------------------
    } catch (error) {
        testEvalPath = view.path;
    }
    if (testEvalPath == '') testEvalPath = '/';
    viewPaths.map((path, i) => {

        // -----------------------------------------------------------------------
        // params uri validator --------------------------------------------------
        // clear uri
        // getURI -> .split('?')[0].split('#')[0]

        if (path.path.split('/').pop()[0] == ':') {
            const uriParam = path.path.split('/').pop().split(':').pop();

            // console.log(uriParam == testEvalPath.split('/').pop().split(':').pop());
            // console.log(testEvalPath.split('/').pop() == localStorage.getItem(uriParam));
            // console.log(uriParam == getURI().split('/').pop().split(':').pop());
            // console.log(getURI().split('/').pop() == localStorage.getItem(uriParam));

            if (
                localStorage.getItem(uriParam)
                &&
                (
                    getURI().split('/').pop() == localStorage.getItem(uriParam)
                    ||
                    testEvalPath.split('/').pop() == localStorage.getItem(uriParam)
                )
            ) {
                console.error('ROUTER: fix param path');
                const paramPath = path.path.replace(`:${uriParam}`, localStorage.getItem(uriParam));
                testEvalPath = paramPath;
                path.path = paramPath;
            } else {
                // se esta buscando un usuario publico verificar contenido publico
                // de lo contrario dedirect to 404
                console.error('ROUTER: public user dashboard?');
            }
        }
        // -----------------------------------------------------------------------
        // -----------------------------------------------------------------------

        const testIncludesHome = path.homePaths.includes(testEvalPath);
        const validPath = path.path == testEvalPath;
        // console.log('-------------------------------------');
        // console.warn('valid path', validPath);
        // console.log(testEvalPath, path.path, getURI());
        if (validPath) {
            valid = true;
            if (testEvalPath != getURI()) {
                // console.warn('set uri', testEvalPath);
                setURI(testEvalPath);
                htmls('title', (renderLang(path.title) == '' ? '' : renderLang(path.title) + ' - ')
                    + viewMetaData.mainTitle);
            };
            GLOBAL['currentComponent'] = path.component;
        };
        // if (validPath && (testEvalPath != view.path)) setURI(testEvalPath);
        if (validPath
            || (path.home && testIncludesHome)
            || (path.nohome && (!testIncludesHome))
        ) {
            if (path.display && validateSessionDisplayComponent(path)) {
                fadeIn(s(path.component));
                if (GLOBAL[path.component] && GLOBAL[path.component].routerDisplay) GLOBAL[path.component].routerDisplay();
            };
        } else {
            s(path.component).style.display = 'none';
        }
    });
    if (!valid) location.href = testEvalPath; // console.error('redirect', testEvalPath)
};

const buildBaseUri = () => dev ? `/${viewMetaData.clientID}` : '';

this.router();

// Browser and App
// navigator button controller
window.onpopstate = e =>
    this.router({ newPath: getURI() });