var app = angular.module('app');

app.factory('PreferenciasFactory', function() {
  var obj = {};
  obj.nombre = "";
  obj.frase = "";

  return obj;
});
