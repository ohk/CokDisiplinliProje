const SerialPort = require('serialport')
SerialPort.list().then(ports => {
    ports.forEach(function(port) {
        console.log(port.path)
    })
})