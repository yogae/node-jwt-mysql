/**
 * Module dependencies.
 */
const env = require('dotenv');
const cron = require('node-cron');
// env.config({ path: '/home/hosting_users/whaler/apps/whaler_whaler/.env' });
env.config({ path: `${__dirname}${process.env.NODE_ENV === 'local' ? '/.env.local' : '/.env'}`});
const db = require('./models');
const app = require('./app');
const http = require('http');
const lowdb = require('./lowdb');
const fs = require('fs');
const ftp = require('./lib/ftp');
const { fork } = require('child_process');
/**
 * Get port from environment and store in Express.
 */
const dbVersionFilePath = process.env.DB_VERSION_FILE_PATH || 'version/db';

var port = normalizePort(process.env.PORT || '8001');
app.set('port', port);

const utfDBPath = 'data/utfDB.json';

if (fs.existsSync(utfDBPath)) {
  lowdb.changeDb();
} else {
  ftp.getObjOnce(ftpdbFilePath, 'euc-kr')
    .then((productDoc) => {
        return fs.writeFileSync(utfDBPath, JSON.stringify(productDoc));
    })
    .then(() => {
      lowdb.changeDb();
    });
}

// 10분 마다 child process를 실행합니다.
cron.schedule('*/10 * * * * *', () => {
  console.log('child process start');
  // dbUpdateTask.js 실행
  const cp = fork(__dirname + '/dbUpdateTask.js');
  // dbUpdateTask.js를 실행한 process가 종료 되었을때 발생하는 event 등록
  cp.on('message', function (data) {
    if (data) {
      lowdb.changeDb();
      fs.writeFileSync(dbVersionFilePath, data);
      console.log('db version update');
    }
  })
  cp.on('exit', function (code) {
    console.log(`child process exit code:${code}`);
  });
});


/**
 * Create HTTP server.
 */
// http 서버 생성
const server = http.createServer(app);
// db 연결
db.connect()
  // db 연결 성공 시 server 시작
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
