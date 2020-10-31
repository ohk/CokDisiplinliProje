const io = require("socket.io-client");
const socket = io("http://localhost:8080");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('COM1', { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)
var lastValue = 0
parser.on('data', line => {
  lastValue = line
  console.log("COM Port 1: Alınan Veri" , line)
})

const checkValue = async (name) => {
  socket.on("client", (msg) => {
    if (msg === "checkValue") {
      socket.emit("client", {
        header: "value",
        name: name,
        id: socket.id,
        timeStamp: new Date().toLocaleString(),
        value: lastValue,
      });
    }
  });
};

readline.question("Sera ismini giriniz?\n", (name) => {
  console.log(`Sera İsmi: ${name}! Server ile bağlantı kuruluyor ...`);
  socket.emit("client", {
    header: "setName",
    value: name,
  });
  checkValue(name);
  readline.close();
});
