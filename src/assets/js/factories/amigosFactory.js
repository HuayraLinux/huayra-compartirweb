var app = angular.module('app');

app.factory('AmigosFactory', function($http) {
  var obj = {};

  obj.amigos = [];
  obj.id = "";
  obj.ip = "";

  /*
   * Define el identificador que usará la aplicación
   * para identificarse en la red.
   */
  obj.definir_preferencias = function(id, ip) {
    obj.id = id;
    obj.id = ip;
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
   * Vuelve a consultar los metadatos de cada uno de los amigos.
   */
  obj.forzar_actualizado = function() {
    console.log('forzando actualizado');

    for (var i in obj.amigos) {
      var amigo = obj.amigos[i];

      var tmp_url = "http://" + amigo.ip + ":" + amigo.port;
      console.log(tmp_url);

      $http.get(tmp_url).success(function(data) {
        amigo.data = data;
        console.log("responde", data);
        //obj.amigos.push(amigo);
      });

    }

  }

  /*
   * Intenta agregar un nuevo registro a la lista de amigos.
   */
  obj.agregar_amigo = function(amigo) {

    /* Evita agregarse a si mismo */
    if (amigo.id === obj.id || amigo.ip === obj.ip)
      return;


    /* Evita duplicados */
    if (obj.existe_referencia(amigo.id))
      return

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
