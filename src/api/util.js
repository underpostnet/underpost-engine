
import dotenv from 'dotenv';

dotenv.config();

const uriUtil = 'util';

const s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

const getHash = () => s4() + s4() +
    '-' + s4() +
    '-' + s4() +
    '-' + s4() +
    '-' + s4() + s4() + s4();

const range = (start, end) => {
    return Array.apply(0, Array(end - start + 1))
        .map((element, index) => index + start);
};

const buildBaseApiUri = () => {
    if (process.env.NODE_ENV == 'development')
        return '';
    return '/' + process.env.BASE_API_URI;
};

const random = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

/*
            
            hexString = yourNumber.toString(16);
            yourNumber = parseInt(hexString, 16);
            
            */
const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

const randomNumberColor = () => parseInt(randomColor().split('#')[1], 16);

const replaceAll = (str, replaceWhat, replaceTo) => {
    replaceWhat = replaceWhat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return str.replace(new RegExp(replaceWhat, 'g'), replaceTo);
};

const renderLang = (langs, req) => {
    const getLang = `${req.acceptsLanguages()[0].split('-')[0]}`.toLowerCase();
    if (Object.keys(langs).includes(getLang)) return langs[getLang];
    return langs['en'];
};

const getRawCsvFromArray = array =>
    array[0] ? Object.keys(array[0]).join(';') +
        '\r\n' + array
            .map((x) => {
                return (
                    Object.keys(x)
                        .map((attr) => x[attr])
                        .join(';') + '\r\n'
                );
            }).join('') : '';

const passwordValidator = (str, req) => {

    let msg = '';
    let validate = true;
    let regex;

    if (str.length < 8) {
        validate = false;
        msg += ` > ${renderLang({ en: '8 char Length', es: '8 caracteres' }, req)}`;
    }

    regex = /^(?=.*[a-z]).+$/;
    if (!regex.test(str)) {
        validate = false;
        msg += ` > ${renderLang({ en: 'lowercase', es: 'una minuscula' }, req)}`;
    }

    regex = /^(?=.*[A-Z]).+$/;
    if (!regex.test(str)) {
        validate = false;
        msg += ` > ${renderLang({ en: 'uppercase', es: 'una mayuscula' }, req)}`;
    }

    regex = /^(?=.*[0-9_\W]).+$/;
    if (!regex.test(str)) {
        validate = false;
        msg += ` > ${renderLang({ en: 'number or special', es: 'numero o caracter especial' }, req)}`;
    }

    return {
        msg,
        validate
    }
};


const emailValidator = (str, req) => {

    const validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(str);
    return {
        msg: validate ? '' : ` > ${renderLang({ en: 'invalid email', es: 'email invalido' }, req)}`,
        validate
    }
};

const newInstance = obj => JSON.parse(JSON.stringify(obj));

const cap = str => str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const uniqueArray = arr =>
    arr.filter((item, pos) => arr.indexOf(item) == pos);


const orderArrayFromAttrInt = (arr, attr, type) =>
    // type -> true asc
    // type -> false desc
    type === 'asc' ?
        arr.sort((a, b) => a[attr] - b[attr]) :
        arr.sort((a, b) => b[attr] - a[attr]);


const clearSubUri = path => {
    let _path = path.slice(1).split('/');
    _path.shift();
    return `/${_path.join('/')}`
};

const clearURI = uri => uri.split('#')[0].split('?')[0];

const getYouTubeID = url => {
    const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) return url.match(p)[1]
    return false;
};

const timer = ms => new Promise(res => setTimeout(res, ms));

const commonFunctions = () => `
    const getHash = ${getHash};
    const s4 = ${s4};
    const range = ${range};
    const random = ${random};
    const randomColor = ${randomColor};
    const randomNumberColor = ${randomNumberColor};
    const passwordValidator = ${passwordValidator};
    const emailValidator = ${emailValidator};
    const newInstance = ${newInstance};
    const cap = ${cap};
    const uniqueArray = ${uniqueArray};
    const clearSubUri = ${clearSubUri};
    const _clearURI = ${clearURI};
    const getRawCsvFromArray = ${getRawCsvFromArray};
    const orderArrayFromAttrInt = ${orderArrayFromAttrInt};
    // encodeURIComponent
    // decodeURIComponent
    const clearURI = uri => decodeURIComponent(_clearURI(uri));
    const getYouTubeID = ${getYouTubeID};
    const timer = ${timer};
`;

const buildURL = (viewMetaData, subDomain) => {
    if (process.argv[2] == 'build' && process.env.NODE_ENV == 'development')
        return `http://localhost:${process.env.BUILD_DEV_PORT}`;
    if (process.env.NODE_ENV == 'development')
        return `http://localhost:${process.env.PORT}`;
    if (process.env.SSL == 'true')
        return `https://${subDomain ? subDomain + '.' : viewMetaData.subDomain ? viewMetaData.subDomain + '.' : ''}${viewMetaData.host}`;
    return `http://${subDomain ? subDomain + '.' : viewMetaData.subDomain ? viewMetaData.subDomain + '.' : ''}${viewMetaData.host}`;
};

const buildBaseUri = view => {
    if (process.env.NODE_ENV == 'development' && process.argv[2] != 'build')
        return view.path;
    return clearSubUri(view.path);
};

const baseStaticUri = viewMetaData =>
    process.env.NODE_ENV != 'development' ? '/' + viewMetaData.clientID : '';

const baseStaticClient = viewMetaData =>
    process.env.NODE_ENV == 'development' && process.argv[2] != 'build' ? '/' + viewMetaData.clientID : '';

// const banWords = ['boards', 'login', 'register', 'markdown', 'js-editor', 'editor', 'admin', 'mod'];
const banChars = ['/', '\\', '.', ' '];
const isInvalidChar = (str) =>
    // banWords.includes(str.toLowerCase())
    // ||
    range(0, str.length - 1)
        .filter(x => banChars.includes(str[x])).length > 0;

const apiUtil = app => {

    app.get('/online', (req, res) => res.status(200).send('online'));

    app.get(`${buildBaseApiUri()}/api/${uriUtil}/getHash`, (req, res) =>
        res.status(200).json(getHash()));
    app.get(`${buildBaseApiUri()}/api/${uriUtil}/randomColor`, (req, res) =>
        res.status(200).json(randomColor()));
    app.get(`${buildBaseApiUri()}/api/${uriUtil}/emailValidator`, (req, res) =>
        res.status(200).json(emailValidator(req.query.email)));
    app.get(`${buildBaseApiUri()}/api/${uriUtil}/getYouTubeID`, (req, res) =>
        res.status(200).end(getYouTubeID(req.query.url)));

};

class ImportError extends Error { }

const loadModule = async (modulePath) => {
    try {
        return await import(modulePath)
    } catch (e) {
        throw new ImportError(`Unable to import module ${modulePath}`)
    }
}

/* import exampple:
async function main() {
    // import myDefault, {foo, bar} from '/modules/my-module.js'
    const { default: myDefault, foo, bar } = await loadModule('/modules/my-module.js')
}
*/

export {
    uriUtil,
    loadModule,
    apiUtil,
    commonFunctions,
    s4,
    getHash,
    range,
    random,
    randomColor,
    randomNumberColor,
    replaceAll,
    passwordValidator,
    emailValidator,
    renderLang,
    newInstance,
    cap,
    buildURL,
    buildBaseApiUri,
    buildBaseUri,
    uniqueArray,
    baseStaticUri,
    baseStaticClient,
    clearSubUri,
    orderArrayFromAttrInt,
    getYouTubeID,
    isInvalidChar,
    timer,
    getRawCsvFromArray
};