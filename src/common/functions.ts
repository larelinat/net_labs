import { NetMessageService } from "./NetMessageService";
// Вывод сообщения об ожидании сообщений
export const handleListening = () => {
  NetMessageService.waitingMessage();
};
/// Вывод сообщения об ошибке
export const handleError = (error: Error) => {
  NetMessageService.errorMessage(error);
};
