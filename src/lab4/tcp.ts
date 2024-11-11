import * as net from "node:net";
import readlineSync from "readline-sync";
import { printOpenedPorts, validatePortInput } from "./functions";

const scanPort = (
  host: string,
  port: number,
  timeout = 2000,
): Promise<boolean> =>
  new Promise((resolve) => {
    const socket = new net.Socket();
    let isOpen = false;

    socket.setTimeout(timeout);
    socket.on("connect", () => {
      isOpen = true;
      socket.destroy();
    });

    socket.on("timeout", () => {
      socket.destroy();
    });

    socket.on("error", () => {
      socket.destroy();
    });

    socket.on("close", () => {
      resolve(isOpen);
    });

    socket.connect(port, host);
  });

export const scanTcpPorts = async (
  host: string,
  startPort: number,
  endPort: number,
) => {
  const openPorts: number[] = [];
  for (let port = startPort; port <= endPort; port++) {
    const isOpen = await scanPort(host, port);
    if (isOpen) {
      console.log(`Port ${port} is open`);
      openPorts.push(port);
    }
  }
  return openPorts;
};

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

scanTcpPorts(target, startPort, endPort)
  .then((r) => {
    printOpenedPorts(r);
  })
  .catch((e) => {
    console.error(e);
  });
