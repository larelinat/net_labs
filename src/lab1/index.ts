import { execSync } from "child_process";
import os from "os";
import dns from "node:dns";
import * as net from "node:net";
import { Traceroute } from "nodejs-traceroute/lib/traceroute";
import type { Hop } from "nodejs-traceroute/lib/process";

type NetworkSettings = {
  name: string;
  address: string;
  gateway: string;
  dns: string[];
};

const formatNetworkSettings = (settings: NetworkSettings[]) => {
  return settings
    .map((setting) => {
      return `Имя интерфейса: ${setting.name}\nАдрес: ${setting.address}\nШлюз: ${setting.gateway}\nDNS: ${setting.dns.join(", ")}\n`;
    })
    .join("\n");
};

const getNetworkSettings = (): NetworkSettings[] => {
  const interfaces = os.networkInterfaces();
  const settings = [];

  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (netInterface) {
      for (const net of netInterface) {
        if (net.family === "IPv4" && !net.internal) {
          settings.push({
            name,
            address: net.address,
            gateway: execSync(
              `route -n get default | grep 'gateway' | awk '{print $2}'`,
            )
              .toString()
              .trim(),
            dns: dns.getServers(),
          });
        }
      }
    }
  }

  return settings;
};

const formatTcpPorts = (ports: string[]) => {
  return `Используемые TCP порты:\n${ports.join(", ")}`;
};

const getUsedTcpPorts = (): string[] => {
  const ports = execSync(
    "lsof -iTCP -sTCP:LISTEN -n -P | awk 'NR>1 {print $9}'",
  )
    .toString()
    .trim()
    .split("\n")
    .map((port) => port.split(":").pop())
    .filter((port): port is string => port !== undefined);

  return Array.from(new Set(ports));
};

const checkServerAvailability = (host: string) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);

    socket.on("connect", () => {
      resolve(true);
      socket.destroy();
    });

    socket.on("timeout", () => {
      resolve(false);
      socket.destroy();
    });

    socket.on("error", () => {
      resolve(false);
    });

    socket.connect(80, host);
  });
};

const traceRoute = (host: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const tracer = new Traceroute();
      const hops: Hop[] = [];

      tracer
        .on("hop", (hop: Hop) => {
          hops.push(hop);
          const rtt1 = hop.rtt1 ? hop.rtt1 : "N/A";
          const rtt2 = hop.rtt2 !== undefined ? `| ${hop.rtt2}` : "";
          const rtt3 = hop.rtt3 !== undefined ? `| ${hop.rtt3}` : "";
          console.log(`Hop ${hop.hop}: ${hop.ip} | ${rtt1} ${rtt2} ${rtt3}`);
        })
        .on("close", () => {
          resolve();
        })
        .on("error", (err: Error) => {
          reject(
            new Error(`Ошибка при выполнении трассировки: ${err.message}`),
          );
        });

      tracer.trace(host);
    } catch (err) {
      if (err instanceof Error) {
        reject(new Error(`Ошибка при выполнении трассировки: ${err.message}`));
      } else {
        reject(new Error("Неизвестная ошибка при выполнении трассировки"));
      }
    }
  });
};

const getDnsServers = (domain: string) => {
  return new Promise((resolve, reject) => {
    dns.resolveNs(domain, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses);
      }
    });
  });
};

(async () => {
  console.log("-".repeat(35));
  const networkSettings = getNetworkSettings();
  console.log("Сетевые настройки:");
  console.log(formatNetworkSettings(networkSettings));
  console.log("-".repeat(35));
  const usedTcpPorts = getUsedTcpPorts();
  console.log(formatTcpPorts(usedTcpPorts));
  console.log("-".repeat(35));
  const servers = ["www.vvsu.ru", "www.mail.ru"];
  for (const server of servers) {
    const isAvailable = await checkServerAvailability(server);
    console.log(`Сервер ${server} доступен:`, isAvailable);
    if (isAvailable === true) {
      await traceRoute(server);
      console.log(`Маршрут до сервера ${server}:\n`);
      console.log("-".repeat(35));
    }
  }

  const dnsServers = await getDnsServers("mail.ru");
  console.log("DNS сервера для mail.ru:", dnsServers);
})();
