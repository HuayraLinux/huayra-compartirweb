var app = angular.module('app');

app.factory('AmigosFactory', function() {
  var obj = {};

  obj.amigos = [];
  obj.id = "";

  obj.definir_preferencia_id = function(id) {
    obj.id = id;
  }
  
  obj.agregar_amigo = function(amigo) {

    /* Evita agregarse a si mismo */
    if (amigo.id === obj.id) {
      return;
    }

    obj.amigos.push(amigo);
  }

  obj.desconectar_amigo = function(id) {
    var pos = -1;

    for (var i in obj.amigos) {
      var item = obj.amigos[i];

      if (item.id === id)
        pos = i;
    }

    if (pos != -1)
      obj.amigos.splice(pos, 1);
  }

  return obj;
});
