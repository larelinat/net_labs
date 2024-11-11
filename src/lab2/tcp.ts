import net from "node:net";
import { NetMessageService } from "../common/NetMessageService";

export const createServer = () =>
  net.createServer((socket) => {
    socket.write(`HELLO ${socket.remoteAddress ?? "UNKNOWN"}`);
  });

export const createClient = (server_address: string, server_port: number) => ({
  socket: new net.Socket().connect(server_port, server_address),
  messageService: new NetMessageService(server_address, server_port),
});

export const handleData =
  (service: NetMessageService, socket: net.Socket) => (data: Buffer) => {
    service.formatAnswer(data);
    const answer = service.enterMessageDialog();
    socket.write(answer);
    NetMessageService.waitingMessage();
  };

export const handleClose =
  (service: NetMessageService, type: "client" | "server") => () => {
    service.disconnectedMessage();
    if (type === "client") {
      process.exit(0);
    }
  };

export const handleServerConnection = (socket: net.Socket) => {
  const service = new NetMessageService(
    socket.remoteAddress,
    socket.remotePort,
  );
  service.connectedMessage();
  socket.on("data", handleData(service, socket));
  socket.on("close", handleClose(service, "server"));
};
