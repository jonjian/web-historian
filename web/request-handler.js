var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
var serveAssets = require('./http-helpers').serveAssets;
var fetcher = require('../workers/htmlfetcher').fetcher;

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
          res.end();
        } else {
          serveAssets(res, __dirname + '/public/loading.html', (data) => {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
          });
        }    
      });
    }
  } else if (req.method === 'POST') {
    var body = [];

    req.on('data', (chunks) => {
      body.push(chunks);
    });

    req.on('end', () => {
      body = Buffer.concat(body).toString().slice(4);
      archive.isUrlInList(body, (exists) => {
        if (!exists) {
          archive.addUrlToList(body, () => {});
          serveAssets(res, __dirname + '/public/loading.html', (data) => {
            res.writeHead(302, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
          });
        } else {
          archive.isUrlArchived(body, (exists) => {
            if (exists) {
              console.log(archive.paths.archivedSites + '/', 'yoo');
              serveAssets(res, archive.paths.archivedSites + '/' + body, (data) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
              });
            }
          });
        } 
      });
    });
  }
};