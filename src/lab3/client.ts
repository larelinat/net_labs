import { NetMessageService } from "../common/NetMessageService";
import { createUdp, handleMessage } from "./udp";
import { handleError } from "../common/functions";
import readlineSync from "readline-sync";
import { SERVER_PORT } from "../common/settings";

NetMessageService.initialMessage("client");

const address = readlineSync.question("ENTER SERVER ADDRESS: ");
const { socket, messageService } = createUdp("client", address, SERVER_PORT);
socket
  .on("message", handleMessage(socket))
  .on("error", handleError)
  .send(messageService.enterMessageDialog(), SERVER_PORT, address);
NetMessageService.waitingMessage();
