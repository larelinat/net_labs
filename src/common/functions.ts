import { NetMessageService } from "./NetMessageService";

export const handleListening = () => {
  NetMessageService.waitingMessage();
};

export const handleError = (error: Error) => {
  NetMessageService.errorMessage(error);
};
