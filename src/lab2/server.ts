import { createServer, handleClose, handleServerConnection } from "./tcp";
import { SERVER_HOST, SERVER_PORT } from "../common/settings";
import { NetMessageService } from "../common/NetMessageService";
import { handleError, handleListening } from "../common/functions";

NetMessageService.initialMessage("server");

createServer()
  .on("listening", handleListening)
  .on("connection", handleServerConnection)
  .on("error", handleError)
  .on("close", handleClose)
  .listen(SERVER_PORT, SERVER_HOST);
