const io = require("socket.io-client");
const socket = io("http://localhost:8080");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
/*
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const port = new SerialPort("COM1", { baudRate: 9600 });

const parser = new Readline();
port.pipe(parser);

parser.on("data", (line) => {
  lastValue = line;
  console.log("COM Port 1: Alınan Veri", line);
});
*/

var lastValue = 0;
var maxDegree = 35;
var name = "sera 101";

const checkValue = async () => {
  socket.on("client", (message) => {
    switch (message.header) {
      case "check":
        socket.emit("client", {
          header: "value",
          name: name,
          id: socket.id,
          timeStamp: new Date().toLocaleString(),
          value: Math.floor(Math.random() * (500 - 0 + 1)),
          maxDegree: maxDegree,
        });
        break;
      case "degree":
        maxDegree = message.value;
        //port.write(`${message.value}`);
        break;
      default:
        break;
    }
  });
};

readline.question("Sera ismini giriniz?\n>", (answer1) => {
  name = answer1;
  readline.question("Maximum sıcaklığı giriniz?\n>", (answer2) => {
    maxDegree = answer2;
    console.log(`Sera İsmi: ${answer1}!\nMaximum Sıcaklık:${answer2}.`);
    checkValue();
    readline.close();
  });
});
