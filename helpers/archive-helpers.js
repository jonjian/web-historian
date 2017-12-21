var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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
  // fs.open(exports.paths.list, 'a', (err, fd) => {
  //   callback(url);
  //   fs.close(fd, (err) => {
  //     if (err) {
  //       console.log('addurltolist: Error');
  //     }
  //     console.log('Success');
  //   });
  // });
  exports.isUrlInList(url, (exist) => {
    if (!exist) {
      // fs.appendFile(file, data[, options], callback)
      // file accepts string filename OR file descriptor (fs.open to get fd)
      fs.open(exports.paths.list, 'a', (err, fd) => {
        fs.write(fd, url + '\n', (err, written, string) => {
          fs.close(fd, (err) => {
            if (err) {
              console.log('addurltolist: Error');
            }
            console.log('Success');
            callback();
          });
        });
      });
    }
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
    // require request module, then use get method to grab HTML src, then pass it into writeFile 2nd arg
    fs.writeFile(exports.paths.archivedSites + '/' + url, 'Hello Node.js', (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};














