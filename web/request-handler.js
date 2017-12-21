var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var url = require('url');
var serveAssets = require('./http-helpers').serveAssets; 

exports.handleRequest = function (req, res) {
  var myUrl = url.parse(req.url);
  if (req.method === 'GET') {
    if (myUrl.path === '/') {
      serveAssets(res, __dirname + '/public/index.html', (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
    } else {
      serveAssets(res, __dirname + '/archives/sites' + myUrl.path);
      // console(myUrl);
      // console.log(myUrl.path);
      // path.isUrlInList()
      // fs.readFile('../archives' + myUrl.path, function (err, data) {
      //   if (err) {
      //     throw err;
      //   }
      //   res.writeHead(200, {'Content-Type': 'text/html'});
      //   res.write(data);
      //   res.end(archive.paths.list);
      // });
    }
  }
  if (req.method === 'POST') {
    console.log(myUrl);
    var body = [];
    req.on('data', (chunks) => {
      body.push(chunks);
    });
    req.on('end', () => {
      body = Buffer.concat(body).toString().slice(4);
      fs.open(archive.paths.list, 'a', (err, fd) => {
        fs.write(fd, body + '\n', (err, written, string) => {
          fs.close(fd, () => {
            console.log('Write successful!');
            res.writeHead(302, {'Content-Type': 'text/html'});
            res.end();
          });
        });
      });
    });
  }
};
