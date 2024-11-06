import net from 'node:net';
import * as process from "node:process";
import {SERVER_PORT} from "../common/settings";
import {askMessage, formatAnswer, textWithDoubleLine, textWithUpperLine} from "../common/functions";

textWithDoubleLine('STARTING CLIENT...');

const client = new net.Socket();

askMessage('ENTER SERVER ADDRESS: ').
    then(address => {
        client.connect(SERVER_PORT, address);

        client.on('data', (data) => {
            formatAnswer(address, SERVER_PORT, data);
            askMessage(`ENTER MESSAGE TO ${address}:${SERVER_PORT}: `)
                .then((message) => {
                    client.write(message);
                    textWithUpperLine('WAITING ANSWER...');
                });
        });

        client.on('close', () => {
            console.log('\r\n');
            textWithUpperLine('CONNECTION CLOSED');
            process.exit(0);
        });
})
