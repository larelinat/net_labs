import type { RemoteInfo } from "node:dgram";
import * as udp from "node:dgram";
import { NetMessageService } from "../common/NetMessageService";

export function createUdp(
  type: "client",
  address: string,
  port: number,
): { socket: udp.Socket; messageService: NetMessageService };
export function createUdp(
  type: "server",
  address: string,
  port: number,
): udp.Socket;
export function createUdp(
  type: "client" | "server",
  address: string,
  port: number,
): udp.Socket | { socket: udp.Socket; messageService: NetMessageService } {
  if (type === "server") {
    return udp.createSocket("udp4").bind(port, address);
  } else {
    return {
      socket: udp.createSocket("udp4"),
      messageService: new NetMessageService(address, port),
    };
  }
}

export const handleMessage =
  (socket: udp.Socket) => (msg: Buffer, info: RemoteInfo) => {
    const messageService = new NetMessageService(info.address, info.port);
    messageService.formatAnswer(msg);
    const answer = messageService.enterMessageDialog();
    NetMessageService.waitingMessage();
    socket.send(answer, info.port, info.address);
  };
