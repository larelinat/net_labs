import * as dgram from "node:dgram";
import readlineSync from "readline-sync";
import { printOpenedPorts, validatePortInput } from "./functions";
// в начале стоит отметить, что, технически, просто отправить любое сообщение на UDP порт и ждать ответа - не является корректным способом сканирования
// необходимо определять конкретную полезную нагрузку для каждого порта, либо прогонять набор из возможных полезных нагрузок по каждому порту
// например, для порта 53 (DNS) можно отправить запрос с некорректным доменом и если порт открыт, то сервер вернет ответ
// отправка же невалидной нагрузки на порт в большинстве случаев не даст никакой информации о том, открыт порт или нет
// поскольку сервер может просто не ответить, если пустая нагрузка не подходит для данного порта

// создаем функцию сканирования портов
const scanPort = (
  host: string,
  port: number,
  timeout = 2000,
): Promise<boolean> =>
  // возвращаем промис, который резолвится в зависимости от того, открыт порт или нет
  new Promise((resolve) => {
    // создаем сокет
    const client = dgram.createSocket("udp4");
    // определяем переменную для отслеживания состояния порта
    let isOpen = false;

    client.on("message", () => {
      // если сокет получил сообщение, значит порт открыт
      isOpen = true;
      client.close();
    });

    client.on("error", () => {
      // если сокет получил ошибку, значит порт закрыт
      client.close();
    });

    client.on("close", () => {
      // после закрытия сокета резолвим промис
      resolve(isOpen);
    });

    client.send("", port, host, (err) => {
      // пробуем отправить сообщение на порт
      if (err) {
        // если ошибка - закрываем сокет
        client.close();
      }
    });

    setTimeout(() => {
      // устанавливаем таймаут на сканирование порта
      // если по истечению времени ответ не пришел, считаем порт закрытым, закрываем сокет
      client.close();
    }, timeout);
  });

// определяем функцию сканирования диапазона портов
export const scanUdpPorts = async (
  host: string,
  startPort: number,
  endPort: number,
) => {
  const openPorts: number[] = [];
  // проходим по всем портам в диапазоне
  for (let port = startPort; port <= endPort; port++) {
    // выводим сообщение о сканировании порта
    process.stdout.write(`Scanning port ${port}`);
    const interval = setInterval(() => {
      // выводим точки для красоты в процессе сканирования
      process.stdout.write(".");
    }, 501);
    // сканируем порт
    const isOpen = await scanPort(host, port);
    // останавливаем вывод точек
    clearInterval(interval);
    // выводим результат сканирования
    process.stdout.write(` ${isOpen ? "Open" : "Closed"}\n`);
    // если порт открыт, добавляем его в список открытых портов
    if (isOpen) {
      openPorts.push(port);
    }
  }
  // возвращаем список открытых портов
  return openPorts;
};
// запрашиваем у пользователя IP адрес и диапазон портов
const target = readlineSync.question("Enter target IP: ");
const startPort = validatePortInput(
  "Enter start port (> 0): ",
  1,
  65535,
  "Invalid port. Please enter a port number >= 0.",
);

const endPort = validatePortInput(
  "Enter end port (<= 65535): ",
  startPort,
  65535,
  "Invalid port. Please enter a port number <= 65535.",
);
// запускаем сканирование портов
scanUdpPorts(target, startPort, endPort)
  .then((r) => {
    printOpenedPorts(r);
  })
  .catch((e: unknown) => {
    console.error(e);
  });
