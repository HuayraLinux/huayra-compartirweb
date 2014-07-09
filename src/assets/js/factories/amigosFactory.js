var app = angular.module('app');

app.factory('AmigosFactory', function($http) {
  var obj = {};

  obj.amigos = [];
  obj.id = "";

  /*
   * Define el identificador que usará la aplicación
   * para identificarse en la red.
   */
  obj.definir_preferencia_id = function(id) {
    obj.id = id;
  }

  /*
   * Retorna true si encuentra un amigo con
   * el 'id' indicado por parámetro.
   */
  obj.existe_referencia = function(id) {
    for (var i in obj.amigos) {
      var item = obj.amigos[i];

      if (item.id === id)
        return true;
    }

    return false;
  }

  
  /*
   * Intenta agregar un nuevo registro a la lista de amigos.
   */
  obj.agregar_amigo = function(amigo) {

    /* Evita agregarse a si mismo */
    if (amigo.id === obj.id) {
      return;
    }

    if (obj.existe_referencia(amigo.id)) {
    }

    // En caso de no encontrarlo en la lista de amigos, lo agrega.
    var tmp_url = "http://" + amigo.ip + ":" + amigo.port;

    $http.get(tmp_url).success(function(data) {
      amigo.data = data;
      obj.amigos.push(amigo);
    });

  }

  /*
   * Busca y desconecta un amigo usando el id indicado.
   */
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
