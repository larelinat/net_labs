import net from "node:net";
import { NetMessageService } from "../common/NetMessageService";

// создаем сервер
export const createServer = () =>
  net.createServer((socket) => {
    // приветственное сообщение для клиента
    socket.write(`HELLO ${socket.remoteAddress ?? "UNKNOWN"}`);
  });
// создаем клиента
export const createClient = (server_address: string, server_port: number) => ({
  socket: new net.Socket().connect(server_port, server_address),
  messageService: new NetMessageService(server_address, server_port),
});
// функция для обработки входящих данных
export const handleData =
  (service: NetMessageService, socket: net.Socket) => (data: Buffer) => {
    // форматируем входящее сообщение и выводим
    service.formatAnswer(data);
    // просим ввести ответ на сообщение
    const answer = service.enterMessageDialog();
    // отправляем ответ
    socket.write(answer);
    // выводим сообщение ожидания
    NetMessageService.waitingMessage();
  };
// функция для обработки закрытия соединения
export const handleClose =
  (service: NetMessageService, type: "client" | "server") => () => {
    // выводим сообщение об отключении
    service.disconnectedMessage();
    // завершаем работу если это клиент
    if (type === "client") {
      process.exit(0);
    }
  };
// функция для обработки подключения клиентов к серверу
export const handleServerConnection = (socket: net.Socket) => {
  // создаем сервис для обработки сообщений
  const service = new NetMessageService(
    socket.remoteAddress,
    socket.remotePort,
  );
  // выводим сообщение о подключении
  service.connectedMessage();
  // подписываемся на событие обработки данных
  socket.on("data", handleData(service, socket));
  // подписываемся на событие закрытия соединения
  socket.on("close", handleClose(service, "server"));
};
