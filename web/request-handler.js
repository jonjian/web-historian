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
      serveAssets(res, archive.paths.archivedSites + myUrl.path, (data) => {
        if (data !== undefined) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(data);
        } else {
          res.writeHead(404, {'Content-Type': 'text/html'});
        }
        res.end();
      });
    }
  } else if (req.method === 'POST') {
    var body = [];

    req.on('data', (chunks) => {
      body.push(chunks);
    });

    req.on('end', () => {
      body = Buffer.concat(body).toString().slice(4);
      archive.addUrlToList(body, () => {});
      res.writeHead(302, {'Content-Type': 'text/html'});
      res.end();
      // serveAssets(res, archive.paths.archivedSites + '/' + body, (data) => {
      //   if (data !== undefined) {
      //     //serve assets if data (html) is found
      //     console.log(data.toString());
      //     res.writeHead(200, {'Content-Type': 'text/html'});
      //     res.write(data);
      //     res.end();
      //   } else { 
      //     // server loading.html asset if not found
      //     serveAssets(res, __dirname + '/public/loading.html', (data) => {
      //       //write url into sites.text
      //       // exports.addUrlToList(????, cb)
      //       //cron will do the work in x minutes later
      //       res.writeHead(302, {'Content-Type': 'text/html'});
      //       res.write(data);
      //       res.end();
      //     });
      //   }
      // });
    });
  }
};
