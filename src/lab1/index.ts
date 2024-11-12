import { execSync, spawn } from "child_process";
import { networkInterfaces } from "os";
import dns from "node:dns";
import * as net from "node:net";
import * as process from "node:process";

const getGatewayAddress = (): string => {
  try {
    let command = "";
    if (process.platform === "win32") {
      command = 'route print | findstr /R /C:"0.0.0.0"';
    } else if (process.platform === "darwin") {
      command = "netstat -rn | grep 'default'";
    } else if (process.platform === "linux") {
      command = "ip route | grep default";
    } else {
      throw new Error("Unsupported OS");
    }

    const output = execSync(command).toString().trim();
    return output.split(/\s+/)[1];
  } catch (err) {
    console.error("Ошибка при получении адреса шлюза:", err);
    return "Неизвестно";
  }
};

const getNetworkSettings = () => {
  const interfaces = networkInterfaces();
  const settings = [];

  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (netInterface) {
      for (const net of netInterface) {
        if (net.family === "IPv4" && !net.internal) {
          settings.push({
            name,
            address: net.address,
            gateway: getGatewayAddress(),
            dns: dns.getServers(),
          });
        }
      }
    }
  }

  return settings
    .map((setting) => {
      return `Интерфейс: ${setting.name}\nIP адрес: ${setting.address}\nШлюз: ${setting.gateway}\nDNS сервера: ${setting.dns.join(
        ", ",
      )}`;
    })
    .join("\n\n");
};

const getUsedTcpPorts = (): string => {
  let command = "";

  if (process.platform === "win32") {
    command = 'netstat -an | find "LISTEN"';
  } else if (process.platform === "darwin" || process.platform === "linux") {
    command = "lsof -iTCP -sTCP:LISTEN -n -P";
  } else {
    throw new Error("Unsupported OS");
  }

  const ports = Array.from(
    new Set(
      execSync(command)
        .toString()
        .trim()
        .split("\n")
        .map((line) => {
          if (process.platform === "win32") {
            return line.split(/\s+/).pop()?.split(":").pop();
          } else {
            return line.split(/\s+/)[8]?.split(":").pop();
          }
        })
        .filter((port): port is string => port !== undefined),
    ),
  );

  return `Используемые TCP порты:\n${ports.join(", ")}`;
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

const traceRoute = (host: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    let command = "";
    let args: string[] = [];

    if (process.platform === "win32") {
      command = "tracert";
      args = ["-d", "-h", "10", "-w", "1000", host];
    } else if (process.platform === "darwin" || process.platform === "linux") {
      command = "traceroute";
      args = ["-m", "10", "-w", "1", host];
    } else {
      reject(new Error("Unsupported OS"));
      return;
    }

    const proc = spawn(command, args);
    const output: string[] = [];

    proc.stdout.on("data", (data: Buffer) => {
      output.push(data.toString());
    });

    proc.stderr.on("data", (data: Buffer) => {
      const errorLine = data.toString().trim();
      if (errorLine && !errorLine.startsWith("traceroute: Warning")) {
        console.error(`stderr: ${errorLine}`);
      }
    });

    proc.on("close", (code: number | null) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Процесс завершился с кодом ${code ?? "неизвестно"}`));
      }
    });
  });
};

const getDnsServers = (domain: string) => {
  return new Promise((resolve, reject) => {
    dns.resolveNs(domain, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses.join(", "));
      }
    });
  });
};

const printDivider = () => {
  console.log("-".repeat(35));
};

const formatRoute = (route: string[]): string[] => {
  const formatted: string[] = [];
  let currentHop = "";

  route.forEach((line) => {
    const match = /^\s*(\d+)\s+(.*)$/.exec(line);
    if (match) {
      if (currentHop) {
        formatted.push(currentHop);
      }
      currentHop = `${match[1]} ${match[2]}`;
    } else {
      currentHop += ` ${line.trim()}`;
    }
  });

  if (currentHop) {
    formatted.push(currentHop);
  }

  return formatted;
};

const main = async () => {
  const servers = ["www.vvsu.ru", "www.mail.ru"];
  printDivider();
  console.log(getNetworkSettings());
  printDivider();
  console.log(getUsedTcpPorts());
  printDivider();
  const dnsServers = await getDnsServers("mail.ru");
  console.log("DNS сервера для mail.ru:", dnsServers);
  printDivider();

  for (const server of servers) {
    const isAvailable = await checkServerAvailability(server);
    console.log(`Сервер ${server} доступен:`, isAvailable);
    if (isAvailable === true) {
      console.log(`Маршрут до сервера ${server}:\n`);
      const route = await traceRoute(server);
      const formattedRoute = formatRoute(route);
      console.log(formattedRoute.join("\n"));
      console.log("-".repeat(35));
    }
  }
};

void main();
