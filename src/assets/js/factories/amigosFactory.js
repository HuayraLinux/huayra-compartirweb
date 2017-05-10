var app = angular.module('app');

app.factory('AmigosFactory', function($http) {
  var obj = {};

  obj.amigos = [];
  obj.id = "";
  obj.ip = "";
  obj.url_pendientes = [];

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
      /* Voy a hacer una IIFE (inmediately invoked function expression)
       * ¿Por qué? Para poder capturar el valor de `i` que cambia en cada
       *           vuelta del for
       * ¿Qué conseguís con eso? Evitar algunos bugs de timing que ocurren
       *                         cuando una request termina antes de lo esperado
       * Esto es horrible.
       * Si tenés quejas mandame un mail (iglosiggio en gmail.com)
       *
       * También es así como se hacen los polyfill de let en JS moderno
       */
       (function() {
         var amigo = obj.amigos[i];
         var tmp_url = "http://" + amigo.ip + ":" + amigo.port;

        $http.get(tmp_url).success(function(data) {
          amigo.data = data;
          console.log("responde", data);
        });
       })();
    }

  }

  /*
   * Intenta agregar un nuevo registro a la lista de amigos.
   */
  obj.agregar_amigo = function(amigo) {

    /* Evita agregarse a si mismo */
    if (amigo.id === obj.id || amigo.ip === obj.id)
      return;

    /* Evita duplicados */
    if (obj.existe_referencia(amigo.id))
      return

    // En caso de no encontrarlo en la lista de amigos, lo agrega.
    var tmp_url = "http://" + amigo.ip + ":" + amigo.port;

    if (obj.url_pendientes.indexOf(tmp_url) > -1)
      return;
    else
      obj.url_pendientes.push(tmp_url);

    $http.get(tmp_url).success(function(data) {
      amigo.data = data;
      obj.amigos.push(amigo);

      var index = obj.url_pendientes.indexOf(tmp_url);

      if (index > -1)
        obj.url_pendientes.splice(index, 1);
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
