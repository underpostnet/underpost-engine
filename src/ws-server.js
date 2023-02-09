


import dotenv from 'dotenv'
import { Server } from 'socket.io'
// import { createServer } from 'http'

dotenv.config()

const wsServer = () => {
    const io = new Server(process.env.IO_PORT, { cors: { origins: ['http://localhost:5500'] } })
    const clients = [];
    io.on("connection", (socket) => {

        console.log(`socket.io | connect ${socket.id}`);
        clients.push(socket);
        console.log(`socket.io | currents clients: ${clients.length}`);

        socket.on("message", (...args) => {
            console.log(`socket.io | message ${socket.id} due to data: ${args}`);
        });

        socket.on("disconnect", (reason) => {
            console.log(`socket.io | disconnect ${socket.id} due to reason: ${reason}`);
            clients.splice(clients.indexOf(socket), 1);
            console.log(`socket.io | currents clients: ${clients.length}`);
        });
    });

    console.log(`Io Server is running on port ${process.env.IO_PORT}`)

    return { io, clients };
};

export { wsServer };


