'use strict';

var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    Q = require('q');

function download(url, filepath) {
    var fileStream = fs.createWriteStream(filepath),
        deferred = Q.defer();

      fileStream.on('open', function () {
            http.get(url, function (res) {
                    res.on('error', function (err) {
                              deferred.reject(err);
                    });

                    res.pipe(fileStream);
                    });
              }).on('error', function (err) {
                deferred.reject(err);
              }).on('finish', function () {
                    deferred.resolve(filepath);
                      });

        return deferred.promise;
}

download('http://localhost:8080/descargar', 'ejemplo.avi');
