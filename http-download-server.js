var url = require('url');
var http = require('http');
var shell = require('child_process');
var querystring = require('querystring');

const httpTimeout = 5000;


// catch exceptions
process.on('uncaughtException', function (err) {
  console.error(`uncaughtException.\nmessage: ${err.message}\nstack: ${err.stack}`);
});


// http server defination
var server = http.createServer()
.on('request', function(req, res) {
  var info = url.parse('http://' + req.headers.host + req.url);

  switch (info.pathname) {
    case '/':
      var querys = querystring.parse(info.query);
      var downloadUrl = querys['url'];
      var outFile = querys['out'];
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');

      if (downloadUrl) {
        var command = '';
        if (process.platform === 'win32') {
          command = `downloader.bat "${downloadUrl}" "${outFile}"`;
        } else {
          command = `./downloader.sh "${downloadUrl}" "${outFile}"`;
        }

        shell.exec(command, function(err, stdout, stderr) {
          console.log(command);
          console.log(stdout.trim());
        });
      }

      break;

    default:
      res.writeHead(404, 'Not found');
      res.end();
  }
})
.listen(9999, '0.0.0.0', function() {
  var { address, port }  = this.address();
  console.log(`Http Download Server on ${address}:${port}`);
});


// important, set inactivity http timeout
server.timeout = httpTimeout;
