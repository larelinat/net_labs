import * as net from "node:net";
import readlineSync from "readline-sync";
import { printOpenedPorts, validatePortInput } from "./functions";
// определяем функцию для сканирования портов, таймаут по умолчанию 2000 мс
const scanPort = (
  host: string,
  port: number,
  timeout = 2000,
): Promise<boolean> =>
  // пробуем подключиться к порту
  new Promise((resolve) => {
    // создаем сокет для подключения
    const socket = new net.Socket();
    // по умолчанию считаем порт закрытым
    let isOpen = false;
    // устанавливаем таймаут подключения
    socket.setTimeout(timeout);
    // если подключились к порту
    socket.on("connect", () => {
      // указываем что порт открыт
      isOpen = true;
      // закрываем сокет
      socket.destroy();
    });

    socket.on("timeout", () => {
      // если ответа нет, то считаем порт закрытым, закрываем сокет
      socket.destroy();
    });

    socket.on("error", () => {
      // если ошибка, то считаем порт закрытым, закрываем сокет
      socket.destroy();
    });

    socket.on("close", () => {
      // после закрытия сокета возвращаем результат
      resolve(isOpen);
    });
    // подключаемся к порту
    socket.connect(port, host);
  });

// определяем функцию для сканирования диапазона портов
export const scanTcpPorts = async (
  host: string,
  startPort: number,
  endPort: number,
) => {
  // будем хранить список открытых портов
  const openPorts: number[] = [];
  // проходим по всем портам
  for (let port = startPort; port <= endPort; port++) {
    // сканируем порт
    const isOpen = await scanPort(host, port);
    // если порт открыт, то добавляем его в список, выводим сообщение
    if (isOpen) {
      console.log(`Port ${port} is open`);
      openPorts.push(port);
    }
  }
  // возвращаем список открытых портов
  return openPorts;
};
// запрашиваем у пользователя IP-адрес и диапазон портов
const target = readlineSync.question("Enter target IP: ");
const startPort = validatePortInput(
  "Enter start port (>= 0): ",
  0,
  65535,
  "Invalid port. Please enter a port number >= 0.",
);

const endPort = validatePortInput(
  "Enter end port (< 65535): ",
  startPort,
  65535,
  "Invalid port. Please enter a port number <= 65535.",
);
// запускаем сканирование портов
scanTcpPorts(target, startPort, endPort)
  // после того как просканировали порты выводим результат
  .then((r) => {
    printOpenedPorts(r);
  })
  // если ошибка - выводим ее
  .catch((e: unknown) => {
    console.error(e);
  });
