const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('COM1', { baudRate: 9600 })

setInterval(function () {
    const data = `${Math.floor(Math.random() * (500 - 0 + 1))}\n`
    port.write(data)
  }, 1000);
