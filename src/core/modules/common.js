const s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

const getHash = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

const range = (start, end) => {
  return Array.apply(0, Array(end - start + 1)).map((element, index) => index + start);
};

const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
};

const renderLang = (langs, req) => {
  if (req) {
    const getLang = `${req.acceptsLanguages()[0].split('-')[0]}`.toLowerCase();
    if (Object.keys(langs).includes(getLang)) return langs[getLang];
    return langs['en'];
  }
  if (langs[s('html').lang]) return langs[s('html').lang];
  return langs['en'];
};

const getRawCsvFromArray = (array) =>
  array[0]
    ? Object.keys(array[0]).join(';') +
      '\r\n' +
      array
        .map((x) => {
          return (
            Object.keys(x)
              .map((attr) => x[attr])
              .join(';') + '\r\n'
          );
        })
        .join('')
    : '';

const passwordValidator = (str, req) => {
  let msg = '';
  let validate = true;
  let regex;

  if (str === '') {
    return {
      msg: renderLang({ en: 'Empty field', es: 'Campo vacío' }, req),
      validate: false,
    };
  }

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
    validate,
  };
};

const emailValidator = (str, req) => {
  if (str === '') {
    return {
      msg: renderLang({ en: 'Empty field', es: 'Campo vacío' }, req),
      validate: false,
    };
  }
  const validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(str);
  return {
    msg: validate ? '' : ` > ${renderLang({ en: 'invalid email', es: 'email invalido' }, req)}`,
    validate,
  };
};

const usernameValidator = (str, req) => {
  if (str === '') {
    return {
      msg: renderLang({ en: 'Empty field', es: 'Campo vacío' }, req),
      validate: false,
    };
  }
  const minChars = 4;
  const validate = str.length >= minChars;
  return {
    msg: validate ? '' : ` > ${renderLang({ en: minChars + ' char Length', es: minChars + ' caracteres' }, req)}`,
    validate,
  };
};

const passwordMatchValidator = (str1, str2, req) => {
  if (str2 === '') {
    return {
      msg: renderLang({ en: 'Empty field', es: 'Campo vacío' }, req),
      validate: false,
    };
  }
  const validate = str1 === str2;
  return {
    msg: validate ? '' : ` > ${renderLang({ en: 'Password does not match', es: 'Las contraseñas no coinciden' }, req)}`,
    validate,
  };
};

// s('html').lang = 'en';

const newInstance = (obj) => JSON.parse(JSON.stringify(obj));

const cap = (str) =>
  str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const capFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const uniqueArray = (arr) => arr.filter((item, pos) => arr.indexOf(item) == pos);

const orderArrayFromAttrInt = (arr, attr, type) =>
  // type -> true asc
  // type -> false desc
  type === 'asc' ? arr.sort((a, b) => a[attr] - b[attr]) : arr.sort((a, b) => b[attr] - a[attr]);

const getRandomPoint = (suffix, pointsArray) => {
  const point = pointsArray[random(0, pointsArray.length - 1)];
  const returnPoint = {};
  returnPoint['x' + suffix] = point[0];
  returnPoint['y' + suffix] = point[1];
  return returnPoint;
};

const getYouTubeID = (url) => {
  const p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) return url.match(p)[1];
  return false;
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const logDataManage = (arg, html) => {
  const rawLog = JSON.stringify(typeof arg == 'function' ? arg() : arg, null, 4);
  if (html) return `<pre>${rawLog}</pre>`;
  else console.log(rawLog);
};

const arrayInstanceLog = (arr) => arr.map((x) => console.log(`${x}`));

const reOrderIntArray = (array) => {
  /* shuffle */
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const orderAbc = (arr, attr) =>
  arr.sort((a, b) => {
    if (attr) {
      if (a[attr] < b[attr]) {
        return -1;
      }
      if (a[attr] > b[attr]) {
        return 1;
      }
    } else {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
    }
    return 0;
  });

const getDirection = (x1, y1, x2, y2) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  //Check for all the 8 directions that a point can move
  let direction, arrow, htmlArrow;

  if (deltaX > 0 && deltaY > 0) direction = 'South East';
  else if (deltaX > 0 && deltaY === 0) direction = 'East';
  else if (deltaX > 0 && deltaY < 0) direction = 'North East';
  else if (deltaX === 0 && deltaY > 0) direction = 'South';
  else if (deltaX === 0 && deltaY < 0) direction = 'North';
  else if (deltaX < 0 && deltaY > 0) direction = 'South West';
  else if (deltaX < 0 && deltaY === 0) direction = 'West';
  else if (deltaX < 0 && deltaY < 0) direction = 'North West';

  switch (direction) {
    case 'South East':
      arrow = '↘';
      htmlArrow = '&#8600;';
      break;
    case 'East':
      arrow = '→';
      htmlArrow = '&#8594;';
      break;
    case 'North East':
      arrow = '↗';
      htmlArrow = '&#8599;';
      break;
    case 'South':
      arrow = '↓';
      htmlArrow = '&#8595;';
      break;
    case 'North':
      arrow = '↑';
      htmlArrow = '&#8593;';
      break;
    case 'South West':
      arrow = '↙';
      htmlArrow = '&#8601;';
      break;
    case 'West':
      arrow = '←';
      htmlArrow = '&#8592;';
      break;
    case 'North West':
      arrow = '↖';
      htmlArrow = '&#8598;';
      break;
  }
  return {
    direction,
    arrow,
    htmlArrow,
  };
};

const JSONmatrix = (matrix) =>
  `[\r\n${matrix.map((x, i) => `   ` + JSON.stringify(x) + (i === matrix.length - 1 ? '' : ',') + '\r\n').join('')}]`;

function merge(target) {
  for (let i = 1; i < arguments.length; ++i) {
    let from = arguments[i];
    if (typeof from !== 'object') continue;
    for (let j in from) {
      if (from.hasOwnProperty(j)) {
        target[j] = typeof from[j] === 'object' ? merge({}, target[j], from[j]) : from[j];
      }
    }
  }
  return target;
}

const getDistance = (x1, y1, x2, y2) => {
  const disX = Math.abs(x2 - x1);
  const disY = Math.abs(y2 - y1);
  return Math.sqrt(disX * disX + disY * disY);
};

/**
 * Ajuste decimal de un número.
 *
 * @param {String}  tipo  El tipo de ajuste.
 * @param {Number}  valor El numero.
 * @param {Integer} exp   El exponente (el logaritmo 10 del ajuste base).
 * @returns {Number} El valor ajustado.
 */
const decimalAdjust = (type, value, exp) => {
  // Si el exp no está definido o es cero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // Si el valor no es un número o el exp no es un entero...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));

  // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Math/round
};

// Decimal round

const round10 = (value, exp) => {
  return decimalAdjust('round', value, exp);
};

// Decimal floor

const floor10 = (value, exp) => {
  return decimalAdjust('floor', value, exp);
};

// Decimal ceil

const ceil10 = (value, exp) => {
  return decimalAdjust('ceil', value, exp);
};

// // Round
// round10(55.55, -1);   // 55.6
// round10(55.549, -1);  // 55.5
// round10(55, 1);       // 60
// round10(54.9, 1);     // 50
// round10(-55.55, -1);  // -55.5
// round10(-55.551, -1); // -55.6
// round10(-55, 1);      // -50
// round10(-55.1, 1);    // -60
// round10(1.005, -2);   // 1.01 -- compare this with round(1.005*100)/100 above
// // Floor
// floor10(55.59, -1);   // 55.5
// floor10(59, 1);       // 50
// floor10(-55.51, -1);  // -55.6
// floor10(-51, 1);      // -60
// // Ceil
// ceil10(55.51, -1);    // 55.6
// ceil10(51, 1);        // 60
// ceil10(-55.59, -1);   // -55.5
// ceil10(-59, 1);       // -50

const JSONweb = (data) => 'JSON.parse(`' + JSON.stringify(data) + '`)';

function objectEquals(x, y) {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every((key) => objectEquals(x[key], y[key]))
    : x === y;
}

const commonFunctions = () => `
    const getHash = ${getHash};
    const s4 = ${s4};
    const range = ${range};
    const random = ${random};
    const passwordValidator = ${passwordValidator};
    const emailValidator = ${emailValidator};
    const newInstance = ${newInstance};
    const cap = ${cap};
    const uniqueArray = ${uniqueArray};
    const getRawCsvFromArray = ${getRawCsvFromArray};
    const orderArrayFromAttrInt = ${orderArrayFromAttrInt};
    const reOrderIntArray = ${reOrderIntArray};
    // encodeURIComponent
    // decodeURIComponent
    const getYouTubeID = ${getYouTubeID};
    const timer = ${timer};
    const logDataManage = ${logDataManage};
    const capFirst = ${capFirst};
    const orderAbc = ${orderAbc};
    const getDirection = ${getDirection};
    const getDistance = ${getDistance};
    const arrayInstanceLog = ${arrayInstanceLog};
    const decimalAdjust= ${decimalAdjust};
    const round10 = ${round10};
    const floor10 = ${floor10};
    const ceil10 = ${ceil10};
    const JSONmatrix = ${JSONmatrix};
    const getRandomPoint = ${getRandomPoint};
    const usernameValidator = ${usernameValidator};
    const renderLang = ${renderLang};
    const passwordMatchValidator = ${passwordMatchValidator};
    const JSONweb = ${JSONweb};
    ${merge};
    ${objectEquals};
`;

export {
  commonFunctions,
  s4,
  getHash,
  range,
  random,
  passwordValidator,
  emailValidator,
  newInstance,
  cap,
  uniqueArray,
  orderArrayFromAttrInt,
  getYouTubeID,
  timer,
  getRawCsvFromArray,
  logDataManage,
  reOrderIntArray,
  capFirst,
  orderAbc,
  getDirection,
  getDistance,
  arrayInstanceLog,
  decimalAdjust,
  round10,
  floor10,
  ceil10,
  JSONmatrix,
  getRandomPoint,
  usernameValidator,
  merge,
  passwordMatchValidator,
  renderLang,
  JSONweb,
  objectEquals,
};
