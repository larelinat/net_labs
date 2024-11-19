import { createServer, handleClose, handleServerConnection } from "./tcp";
import { SERVER_HOST, SERVER_PORT } from "../common/settings";
import { NetMessageService } from "../common/NetMessageService";
import { handleError, handleListening } from "../common/functions";
// Приветстенное сообщение
NetMessageService.initialMessage("server");
// создаем сервер
createServer()
  // подписываемся на событие запуска сервера
  .on("listening", handleListening)
  // подписываемся на событие подключения к серверу
  .on("connection", handleServerConnection)
  // подписываемся на ошибки
  .on("error", handleError)
  // подписываемся на закрытие подключений
  .on("close", handleClose)
  // запускаем сервер
  .listen(SERVER_PORT, SERVER_HOST);
