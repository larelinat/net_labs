import { NetMessageService } from "../common/NetMessageService";
import { createUdp, handleMessage } from "./udp";
import { handleError } from "../common/functions";
import readlineSync from "readline-sync";
import { SERVER_PORT } from "../common/settings";
// приветствие
NetMessageService.initialMessage("client");
// ввод адреса сервера
const address = readlineSync.question("ENTER SERVER ADDRESS: ");
// создаем сокет для подключения
const { socket, messageService } = createUdp("client", address, SERVER_PORT);
// настраиваем обработчики
socket
  // подписываемся на входящие сообщения
  .on("message", handleMessage(socket))
  // подписываемся на ошибки
  .on("error", handleError)
  // запрашиваем сообщение для отправки на сервер
  .send(messageService.enterMessageDialog(), SERVER_PORT, address);
// ожидаем сообщения
NetMessageService.waitingMessage();
