import readlineSync from "readline-sync";

// Класс для вывода сообщений в консоль
export class NetMessageService {
  public readonly address: string = "";
  public readonly port: number = 0;

  constructor(address = "UNKNOWN", port = 0) {
    this.address = address;
    this.port = port;
  }

  // Статический метод для вывода сообщения ожидания
  public static waitingMessage() {
    this.textWithUpperLine("WAITING MESSAGES...");
  }
  // Статический метод для вывода сообщения об ошибке
  public static errorMessage(error: Error) {
    this.textWithUpperLine("ERROR OCCURRED");
    console.error(error);
  }
  // Статический метод для вывода сообщения о начале работы клиента или сервера
  public static initialMessage(type: "client" | "server") {
    NetMessageService.textWithUpperLine(
      `STARTING ${type === "client" ? "CLIENT" : "SERVER"}...`,
    );
  }
  // Статический метод для текста с верхним подчеркиванием
  private static textWithUnderline(text: string) {
    console.log(text);
    console.log("-".repeat(35));
  }
  // Статический метод для текста с нижним подчеркиванием
  private static textWithUpperLine(text: string) {
    console.log("-".repeat(35));
    console.log(text);
  }

  public connectedMessage() {
    NetMessageService.textWithUnderline(
      `CONNECTED: ${this.address}:${this.port}`,
    );
  }
  // Сообщение об отключении
  public disconnectedMessage() {
    NetMessageService.textWithUpperLine(
      `DISCONNECTED: ${this.address}:${this.port}`,
    );
  }
  // Запрос текста для сообщения
  public enterMessageDialog() {
    return readlineSync.question(
      `ENTER MESSAGE TO ${this.address}:${this.port}: `,
    );
  }
  // Форматирование ответа
  public formatAnswer(answer: Buffer) {
    NetMessageService.textWithUpperLine(
      `MESSAGE FROM ${this.address}:${this.port}: `,
    );
    NetMessageService.textWithUnderline(answer.toString());
  }
}
