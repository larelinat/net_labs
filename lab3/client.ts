import * as udp from "node:dgram";
import {askMessage, formatAnswer, textWithDoubleLine, textWithUpperLine} from "../common/functions";
import {SERVER_PORT} from "../common/settings";

textWithDoubleLine('STARTING CLIENT...');

const client = udp.createSocket('udp4');

const messageToServer = (address: string, port = SERVER_PORT) => {
    askMessage('ENTER MESSAGE: ')
        .then(message => {
            client.send(message, port, address);
            textWithUpperLine('WAITING MESSAGES...')
        });
}

client.on('message', (msg, info) => {
    formatAnswer(info.address, info.port, msg);
    messageToServer(info.address, info.port);
});

askMessage('ENTER SERVER ADDRESS: ')
    .then(address => {
        messageToServer(address);
    });
