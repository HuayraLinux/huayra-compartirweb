import Ember from 'ember';

const ESTADO_TERMINADO = "ok";
const ESTADO_ESPERANDO = "esperando";
const ESTADO_ERROR = "error";

export default Ember.Service.extend({
  items: [],

  iniciar: Ember.on('init', function() {

    this.agregar_descarga("falll 123.png", "http://localhost:9919/deasdadsasdscargar/Ceferino/fondos/123.png");
    this.agregar_descarga("123.png", "http://localhost:9919/descargar/Ceferino/fondos/123.png");
    this.agregar_descarga("archivo.iso", "http://localhost:9919/descargar/windows 8.iso");
    this.agregar_descarga("123.png", "http://localhost:9919/descargar/Ceferino/fondos/123.png");

    this.procesar();
  }),

  /*
   * Busca si existe algún item pendiente para iniciar la descarga.
   */
  procesar() {

    setTimeout(() => {

      var items = this.get('items');

      for (var i=0; i<items.length; i++) {
        if (items[i].activo === false && items[i].estado === ESTADO_ESPERANDO) {
          this.iniciar_descarga(i);
          return;
        }
      }

      console.log("No hay descargas para procesar ...");

    }, 200);

  },

  /*
   * Inicia la descarga de un archivo dado el indice en la lista de items.
   */
  iniciar_descarga(indice) {
    var item = this.get('items')[indice];

    Ember.set(item, "activo", true);
    Ember.set(item, "estado", "descargando");

    var http = nodeRequire('http');
    var fs = nodeRequire('fs');

    var file = null;
    var len = 0;

    http.get(item.ruta, (res) => {

      if (res.statusCode === 200) {
        file = fs.createWriteStream('dest');
        len = 0;

        file.on('close', () => {
          Ember.set(item, "activo", false);
          Ember.set(item, "estado", ESTADO_TERMINADO);
        });
      }

      res.on('data', function(chunk) {

        if (file) {
          file.write(chunk);
          len += chunk.length;

          var porcentaje = Math.trunc((len / res.headers['content-length']) * 100);
          Ember.set(item, "progreso", porcentaje);

          //if (porcentaje > 20) {
          //  res.destroy();
          //}
        }

      });

      res.on('end', () => {

        if (res.statusCode != 200) {
          Ember.set(item, "activo", false);
          Ember.set(item, "estado", ESTADO_ERROR);
          this.procesar();
        } else {
          file.close();
          this.procesar();
        }

      });


    });

  },

  agregar_descarga(nombre, ruta) {
    this.get("items").pushObject({
      id: Math.random(),
      nombre: nombre,
      estado: ESTADO_ESPERANDO,
      progreso: 0,
      activo: false,
      ruta: ruta
    });
  }
});
