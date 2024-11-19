import readlineSync from "readline-sync";
// функция для валидации ввода порта, указываем допустимые минимум и максимум, просим ввести диапазон портов пока не введут корректно
export const validatePortInput = (
  message: string,
  min: number,
  max: number,
  errorMessage: string,
): number => {
  let port: number;
  do {
    port = readlineSync.questionInt(message);
    if (port < min || port >= max) {
      console.log(errorMessage);
    }
  } while (port < min || port >= max);
  return port;
};
// функция для вывода открытых портов
export const printOpenedPorts = (ports: number[]) => {
  console.log("-".repeat(35));
  console.log("Opened ports:");
  ports.forEach((port) => {
    console.log(port);
  });
};
