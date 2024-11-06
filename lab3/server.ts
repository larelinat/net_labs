import * as udp from "node:dgram";
import {SERVER_HOST, SERVER_PORT} from "../common/settings";
import {askMessage, formatAnswer, textWithDoubleLine, textWithUpperLine} from "../common/functions";

textWithDoubleLine('STARTING SERVER...');

const server = udp.createSocket('udp4');

server.on('listening', () => {
   textWithUpperLine('WAITING MESSAGES...');
});

server.on('message', (msg, info) => {
    formatAnswer(info.address, info.port, msg);
    askMessage(`ENTER MESSAGE TO ${info.address}:${info.port}: `)
        .then((message) => {
            server.send(message, info.port, info.address);
            textWithUpperLine('WAITING MESSAGES...')
        });
});

server.bind(SERVER_PORT, SERVER_HOST);
