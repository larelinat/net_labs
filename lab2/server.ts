import net from 'node:net';
import {SERVER_HOST, SERVER_PORT} from "../common/settings";
import {askMessage, formatAnswer, textWithDoubleLine, textWithUnderline, textWithUpperLine} from "../common/functions";

textWithDoubleLine('STARTING SERVER...')

const server = net.createServer((socket) => {
    socket.write(`HELLO ${socket.remoteAddress}`);
});

server.listen(SERVER_PORT, SERVER_HOST);

server.on('listening', () => {
    textWithUnderline('WAITING MESSAGES...');
})

server.on('connection', (socket) => {
    console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
    socket.on('data', (data) => {
        formatAnswer(socket.remoteAddress, socket.remotePort, data);
        askMessage(`ENTER MESSAGE TO ${socket.remoteAddress + ':' + socket.remotePort}: `)
            .then((message) => {
                socket.write(message);
                textWithUpperLine('WAITING MESSAGES...')
            });

    });

    socket.on('close', () => {
        textWithUpperLine('DISCONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
    });
});
