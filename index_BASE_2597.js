'use strict'
/**
 * Module dependencies.
 */

const chalk = require('chalk')
var http = require('http');
/**
 * Create HTTP server.
 */
var { IP_LOCAL } = require('./config')
const url = IP_LOCAL
var port = normalizePort(process.env.PORT || 3000);

var requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!\n');
}

var server = http.createServer(requestListener);
const socket = require('socket.io')(server);
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});


server.listen(port, url)
server.on('listening', onListening)
socket.on('connection', (socket) => {
var led = new five.Led("P1-12");
  socket.emit('Conn', { hello: 'Hello World!' })
  console.log(socket.id);
  socket.on('BLINK_LED', (io) => {
    led.blink(io.time);
  })
  socket.on('OFF_LED', (io) => {
    console.log(io)
    led.stop();
    led.off();
  })
  socket.on('ON_LED', (io) => {
    console.log(io)
    led.on();
  })
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log(`${chalk.green('[raspberry-pi]')} server listening on ${url}:${port}`)
}