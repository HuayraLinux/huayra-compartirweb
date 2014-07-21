var app = angular.module('app');
var fs = require('fs');

app.factory('VersionFactory', function() {
  var obj = {};
  obj.version = "(imposible obtener versión)";


  obj.obtener_version = function() {
    return obj.version;
  }

  fs.readFile('../debian/changelog', function(err, data) {

    if (err) {
      obj.version = "(imposible obtener versión)";
    } else {
      var changelog = data.toString();

      obj.version = changelog.slice(0, changelog.indexOf(')') + 1);
      console.log(obj);
    }

  })

  return obj;
});
