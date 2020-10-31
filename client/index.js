const io = require("socket.io-client");
const socket = io("http://localhost:8080");

const checkValue = async (name) => {
  socket.on("client", (msg) => {
    if (msg === "checkValue") {
      socket.emit("client", {
        header: "value",
        name: name,
        id: socket.id,
        timeStamp: new Date().toLocaleString(),
        value: Math.floor(Math.random() * (500 - 0 + 1)),
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
