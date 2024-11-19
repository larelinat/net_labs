import { SERVER_PORT } from "../common/settings";
import readlineSync from "readline-sync";
import { NetMessageService } from "../common/NetMessageService";
import { createClient, handleClose, handleData } from "./tcp";
import { handleError } from "../common/functions";
// Выводим приветствие
NetMessageService.initialMessage("client");
// Создаем клиент с адресом сервера
const { socket, messageService } = createClient(
  readlineSync.question("ENTER SERVER ADDRESS: "),
  SERVER_PORT,
);

socket
  // Подписываемся на событие прихода сообщения и запускаем функцию обработки
  .on("data", handleData(messageService, socket))
  // Подписываемся на событие закрытия подключения
  .on("close", handleClose(messageService, "client"))
  // Подписываемся на ошибки
  .on("error", handleError);
