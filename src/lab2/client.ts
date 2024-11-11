import { SERVER_PORT } from "../common/settings";
import readlineSync from "readline-sync";
import { NetMessageService } from "../common/NetMessageService";
import { createClient, handleClose, handleData } from "./tcp";
import { handleError } from "../common/functions";

NetMessageService.initialMessage("client");

const { socket, messageService } = createClient(
  readlineSync.question("ENTER SERVER ADDRESS: "),
  SERVER_PORT,
);

socket
  .on("data", handleData(messageService, socket))
  .on("close", handleClose(messageService, "client"))
  .on("error", handleError);
