var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, (err, data) => { 
    callback(data.toString().split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((data) => {
    callback(data.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.open(exports.paths.list, 'a', (err, fd) => {
    fs.write(fd, url + '\n', (err, written, string) => {
      fs.close(fd, (err) => {
        if (err) {
          console.log('addurltolist: Error');
        }
        callback();
      });
    });
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile(exports.paths.archivedSites + '/' + url, (err, data) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach((url) => {
    if (!url.length) {
      return;
    }
    exports.isUrlArchived(url, (exists) => {
      if (!exists) {
        request('http://' + url, (error, response, body) => {
          fs.writeFile(exports.paths.archivedSites + '/' + url, body, (error) => {
            if (error) {
              console.log(error, 'error');
            }
          });
        });
      }
    });
  });
};














