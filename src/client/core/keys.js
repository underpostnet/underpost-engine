const startListenKey = obj =>
    setInterval(() => window.KEYS[obj.key] ? obj.onKey() : null, obj.vel);

const stopListenKey = obj =>
    clearInterval(obj);

window.KEYS = {};

window.addEventListener('keydown', e => {
    // console.log('keydown', e.key, e.keyCode);
    window.KEYS[e.key] = true;
}, true);

window.addEventListener('keyup', e => {
    // console.log('keyup', e.key, e.keyCode);
    window.KEYS[e.key] = false;
}, true);

document.onkeydown = () => {
    console.log('onkeydown', window.event.keyCode, window.event.key);
    // switch (window.event.keyCode) {
    //     case 13:
    //         // alert();
    //         break;
    //     default:
    // }
    switch (window.event.key) {
        case 'q':
            // alert();
            break;
        default:
    }
};
