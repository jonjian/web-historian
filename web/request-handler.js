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
      // if site doesn't exist in file, add it to web/sites.txt
        // and load "loading.html"
      // if site exist in web/archives, load the .html
      // post to file
      serveAssets(res, archive.paths.archivedSites + myUrl.path, (data) => {
        if (data !== undefined) {
        //serve assets
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(data);
          res.end();
          //render the html from archives/sites folder

        } else { 
          // console.log(archive.paths.siteAssets);
          serveAssets(res, __dirname + '/public/loading.html', (data) => {
            //render loading.html page
            //write url into sites.text
            //cron will do the work in x minutes later
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
            // add it to the urlList `exports.paths.list`
          });
        }
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
