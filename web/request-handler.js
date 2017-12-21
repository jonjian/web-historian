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
      // if site doesn't exist in file
      // post to file
      // and load "loading.html"
      serveAssets(res, archive.paths.archivedSites + myUrl.path, (data) => {
        
      });
     
    }
  }
  if (req.method === 'POST') {
    var body = [];
    req.on('data', (chunks) => {
      body.push(chunks);
    });
    req.on('end', () => {
      body = Buffer.concat(body).toString().slice(4);
      fs.open(archive.paths.list, 'a', (err, fd) => {
        fs.write(fd, body + '\n', (err, written, string) => {
          fs.close(fd, () => {
            res.writeHead(302, {'Content-Type': 'text/html'});
            res.end();
          });
        });
      });
    });
  }
};
