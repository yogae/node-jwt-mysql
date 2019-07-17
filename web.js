/**
 * Module dependencies.
 */
const env = require('dotenv');
const cron = require('node-cron');
// env.config({ path: '/home/hosting_users/whaler/apps/whaler_whaler/.env' });
env.config({ path: __dirname + '/.env' });
const db = require('./models');
const app = require('./app');
const http = require('http');
const { fork } = require('child_process');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8001');
app.set('port', port);

cron.schedule('*/10 * * * * *', () => {
  console.log('child process start');
  const cp = fork(__dirname + '/dbUpdateTask.js');
  cp.on('exit', function (code) {
    console.log(`child process exit code:${code}`);
  });
});


/**
 * Create HTTP server.
 */
const server = http.createServer(app);
db.connect()
  .then(() => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch((error) => {
    console.error(error);
  })



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

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

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
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log(`Listening on bind ${bind}`);
}