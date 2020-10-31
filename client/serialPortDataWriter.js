const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('COM1', { baudRate: 9600 })
const port2 = new SerialPort('COM2', { baudRate: 9600 })
const port3 = new SerialPort('COM3', { baudRate: 9600 })

setInterval(function () {
    const data = `${Math.floor(Math.random() * (500 - 0 + 1))}\n`
    console.log("COM Port 1: Yazılan Veri" , data)
    port.write(data)
  }, 5000);

  setInterval(function () {
    const data = `${Math.floor(Math.random() * (500 - 0 + 1))}\n`
    console.log("COM Port 2: Yazılan Veri" , data)
    port2.write(data)
  }, 5000);

  setInterval(function () {
    const data = `${Math.floor(Math.random() * (500 - 0 + 1))}\n`
    console.log("COM Port 3: Yazılan Veri" , data)
    port3.write(data)
  }, 5000);
