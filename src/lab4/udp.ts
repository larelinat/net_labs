import * as dgram from "node:dgram";
import readlineSync from "readline-sync";
import { printOpenedPorts, validatePortInput } from "./functions";

const scanPort = (
  host: string,
  port: number,
  timeout = 2000,
): Promise<boolean> =>
  new Promise((resolve) => {
    const client = dgram.createSocket("udp4");
    let isOpen = false;
    let isClosed = false;

    client.on("message", () => {
      isOpen = true;
      if (!isClosed) {
        isClosed = true;
        client.close();
      }
    });

    client.on("error", () => {
      if (!isClosed) {
        isClosed = true;
        client.close();
      }
    });

    client.on("close", () => {
      resolve(isOpen);
    });

    client.send("", port, host, (err) => {
      if (err && !isClosed) {
        isClosed = true;
        client.close();
      }
    });

    setTimeout(() => {
      if (!isClosed) {
        isClosed = true;
        client.close();
      }
    }, timeout);
  });

export const scanUdpPorts = async (
  host: string,
  startPort: number,
  endPort: number,
) => {
  const openPorts: number[] = [];
  for (let port = startPort; port <= endPort; port++) {
    process.stdout.write(`Scanning port ${port}`);
    const interval = setInterval(() => {
      process.stdout.write(".");
    }, 501);

    const isOpen = await scanPort(host, port);
    clearInterval(interval);
    process.stdout.write(` ${isOpen ? "Open" : "Closed"}\n`);

    if (isOpen) {
      openPorts.push(port);
    }
  }
  return openPorts;
};

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

scanUdpPorts(target, startPort, endPort)
  .then((r) => {
    printOpenedPorts(r);
  })
  .catch((e) => {
    console.error(e);
  });
