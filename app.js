var
  port = 8080,
  http = require('http'),
  fs = require('fs');
var
  postLog = function(entry) {
    fs.appendFileSync('./requests.log', new Date().toUTCString() + ' - Request from: ' + entry + '\n');
  };
var
  getLog = function(n) {
    var ret = '';
    var file = fs.readFileSync('./requests.log', 'utf8').split('\n');
    for (i = file.length - 1; i >= file.length - (n + 1) && i >= 0; i--) {
        ret += file[i] + '\n';
    }
    return ret;
  };
var
  getUserInfo = function(req) {
    var ret = "";
    if (req.headers['x-forwarded-for']) {
        ret += req.headers['x-forwarded-for'].split(',')[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ret += req.connection.remoteAddress;
    } else {
        ret += req.ip;
    }
    if(ret.substr(0, 7) == '::ffff:') {
      ret = ret.substr(7);
    }
    return ret;
  };
var
  server = http.createServer(function (req, res) {
    if (req.url === '/') {
      postLog(getUserInfo(req));
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Information from last 30 requests:\n' + getLog(30));
    res.end();
  });

server.listen(port);

console.log('Server running at port: ' + port);
