import { NetMessageService } from "../common/NetMessageService";
import { createUdp, handleMessage } from "./udp";
import { SERVER_HOST, SERVER_PORT } from "../common/settings";
import { handleError, handleListening } from "../common/functions";

NetMessageService.initialMessage("server");

const server = createUdp("server", SERVER_HOST, SERVER_PORT);
server
  .on("listening", handleListening)
  .on("message", handleMessage(server))
  .on("error", handleError);
