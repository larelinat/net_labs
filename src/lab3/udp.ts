import type { RemoteInfo } from "node:dgram";
import * as udp from "node:dgram";
import { NetMessageService } from "../common/NetMessageService";

// функция для создания UDP-сокета для клиента или сервера
// определяем перегрузки функции, для клиента:
export function createUdp(
  type: "client",
  address: string,
  port: number,
): { socket: udp.Socket; messageService: NetMessageService };
// для сервера:
export function createUdp(
  type: "server",
  address: string,
  port: number,
): udp.Socket;
// сама фукнция
export function createUdp(
  type: "client" | "server",
  address: string,
  port: number,
): udp.Socket | { socket: udp.Socket; messageService: NetMessageService } {
  if (type === "server") {
    // если сервер, создаем сокет, привязываем к хосту и порту и возвращаем
    return udp.createSocket("udp4").bind(port, address);
  } else {
    // если клиент - создаем сокет и сервис для обработки сообщений и возвращаем
    return {
      socket: udp.createSocket("udp4"),
      messageService: new NetMessageService(address, port),
    };
  }
}
// функция обработки входящего сообщения
export const handleMessage =
  (socket: udp.Socket) => (msg: Buffer, info: RemoteInfo) => {
    // создаем сервис для обработки сообщений
    const messageService = new NetMessageService(info.address, info.port);
    // форматируем сообщение и выводим его
    messageService.formatAnswer(msg);
    // просим ввести ответ
    const answer = messageService.enterMessageDialog();
    // печатаем сообщение ожидания
    NetMessageService.waitingMessage();
    // отправляем ответ
    socket.send(answer, info.port, info.address);
  };
