


append('body', /*html*/`
    <style>
        ${/*css*/`
            html {
                background: black;
                color: white;
            }
        `}
    </style>
`)

append('body', 'Hello World! <br> URI:' + getURI());

const socket = io('ws://localhost:5501');

socket.on("connect", () => {
    console.log(`socket.io event: connect | session id: ${socket.id}`);
    socket.emit('message', 'test');
});

socket.on("connect_error", (err) => {
    console.log(`socket.io event: connect_error | reason: ${err.message}`);
});

socket.on("disconnect", (reason) => {
    console.log(`socket.io event: disconnect | reason: ${reason}`);
});

socket.on("message", (...args) => {
    console.log(`socket.io event: message | reason: ${args}}`);
});

socket.onAny((event, ...args) => {
    console.log(`socket.io onAny event: ${event} | arguments: ${args}`);
});