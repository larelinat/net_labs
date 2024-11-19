import { NetMessageService } from "../common/NetMessageService";
import { createUdp, handleMessage } from "./udp";
import { SERVER_HOST, SERVER_PORT } from "../common/settings";
import { handleError, handleListening } from "../common/functions";
// приветствие
NetMessageService.initialMessage("server");
// создаем сервер
const server = createUdp("server", SERVER_HOST, SERVER_PORT);
// подписываемся на события
server
  // обработка события запуска сервера
  .on("listening", handleListening)
  // обработка события сообщения
  .on("message", handleMessage(server))
  // обработка ошибок
  .on("error", handleError);
