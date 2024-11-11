import readlineSync from "readline-sync";

export class NetMessageService {
  public readonly address: string = "";
  public readonly port: number = 0;

  constructor(address = "UNKNOWN", port = 0) {
    this.address = address;
    this.port = port;
  }

  public static waitingMessage() {
    this.textWithUpperLine("WAITING MESSAGES...");
  }

  public static errorMessage(error: Error) {
    this.textWithUpperLine("ERROR OCCURRED");
    console.error(error);
  }

  public static initialMessage(type: "client" | "server") {
    NetMessageService.textWithUpperLine(
      `STARTING ${type === "client" ? "CLIENT" : "SERVER"}...`,
    );
  }

  private static textWithUnderline(text: string) {
    console.log(text);
    console.log("-".repeat(35));
  }

  private static textWithUpperLine(text: string) {
    console.log("-".repeat(35));
    console.log(text);
  }

  public connectedMessage() {
    NetMessageService.textWithUnderline(
      `CONNECTED: ${this.address}:${this.port}`,
    );
  }

  public disconnectedMessage() {
    NetMessageService.textWithUpperLine(
      `DISCONNECTED: ${this.address}:${this.port}`,
    );
  }

  public enterMessageDialog() {
    return readlineSync.question(
      `ENTER MESSAGE TO ${this.address}:${this.port}: `,
    );
  }

  public formatAnswer(answer: Buffer) {
    NetMessageService.textWithUpperLine(
      `MESSAGE FROM ${this.address}:${this.port}: `,
    );
    NetMessageService.textWithUnderline(answer.toString());
  }
}
