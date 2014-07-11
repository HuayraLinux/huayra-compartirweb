var app = angular.module('app');
var os = require('os');

app.factory('RedFactory', function() {
  var obj = {};

  obj.obtener_ip = function() {
    var ip = 'localhost';
    var interfaces = os.networkInterfaces();

    for (var nombre in interfaces) {

      for (var i=0; i<interfaces[nombre].length; i++) {
        var elemento = interfaces[nombre][i];

        if (elemento.family == 'IPv4' && elemento.internal == false)
          ip = elemento.address;
      }

    }

    return ip;
  }

  return obj;
});
