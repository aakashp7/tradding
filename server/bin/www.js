#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('server:server');
var http = require('http');
var https = require('https');
var socketNotif = require('../others/socket');
const fs = require('fs');

global.socketIO = require('socket.io');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '');
app.set('port', port);

/*
 * Create HTTP server.
 */
 const options = {
  key: fs.readFileSync(''),
  cert: fs.readFileSync('')
};


var server = https.createServer(options,app); 

const ioSocketss = socketIO(server);
app.set('io', ioSocketss);
ioSocketss.on('connection', (socket) => {
  socketNotif.socketIoConnection(ioSocketss);
  socket.on('disconnect', () => {
      console.log('user disconnected. ####################################################### ', socket.id);
  });
  // socket.emit("testing", { abc: "qwerty" });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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
     // console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
     // console.error(bind + ' is already in use');
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
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
