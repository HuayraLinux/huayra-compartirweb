var app = angular.module('app');

app.factory('AvahiFactory', function(AmigosFactory) {
  var obj = {};
  var proceso = null;  // proceso browse, para descubrir equipos en la red.
  var cliente = null;  // proceso para publicar el servicio en la red.

  obj.iniciar = function() {
      proceso = spawn('avahi-browse', ['-a', '-r', '-p'])
      var last = '';

      proceso.stderr.on('data', function(data) {
        console.log("stderr", data.toString());
      });

      proceso.stdout.on('data', function(chunk) {
        var lines, i;

        lines = (last+chunk).split("\n");

        for (i=0; i<lines.length-1; i++) {
          var mensaje = lines[i].split(';');

          var tipo = mensaje[0];
          var nombre = mensaje[3];
          var id = '';
          var puerto = '';
          var ip = '';


          if (/huayracompartir/.test(nombre)) {
            console.log(mensaje);

            id = nombre.split('_')[1].split('_')[0];

            if (tipo == '+') {
              var servicio = {
                id: id,
                name: 'huayra-compartir',
                nombre: "...",
                frase: "...",
              };
            }


            if (tipo == '-') {
              AmigosFactory.desconectar_amigo(id);
            }

            if (tipo == '=') {
              puerto = mensaje[8];
              ip = mensaje[9].replace('ip=', '').replace('"', '').replace('"', '');

              var servicio = {
                id: id,
                name: 'huayra-compartir',
                nombre: "...",
                frase: "...",
                ip: ip,
                port: puerto
              };

              AmigosFactory.agregar_amigo(servicio);
            }

          }
        }

        last = lines[i];
      });

      proceso.on('error', function(codigo) {
        console.error("ERROR: no se puede ejecutar avahi-browse", codigo);
      });

      proceso.on('exit', function(codigo) {
        console.log("Error, el comando retorno: " + codigo);
      })
  }

  obj.reiniciar_servicio_publicado = function() {
    if (cliente)
      cliente.kill('SIGTERM');

    obj.publicar_servicio_en_la_red(obj.id, obj.ip, obj.puerto);
  }

  obj.publicar_servicio_en_la_red = function(id, ip, puerto) {
    obj.id = id;
    obj.ip = ip;
    obj.puerto = puerto;

    console.log("Publicando el servicio en avahi!");

    cliente = spawn('avahi-publish-service',
        [
        '-s',
        'huayracompartir_' + id + '_' + (Math.random() * 100),
        '_http._tcp', puerto,
        'ip=' + ip
        ]
        );

    cliente.stdout.on('data', function(data) {
      console.log("stderr", data.toString());
    });

    cliente.on('error', function(codigo) {
      console.error("ERROR: no se puede ejecutar avahi-publish-service", codigo);
    });

    cliente.on('exit', function(codigo) {
      if (codigo)
        console.log("Error, el comando retorno: " + codigo);
      else
        console.log("ha finalizado el comando avahi-publish-service");
    })

  }

  /*
   * Finaliza los dos procesos de avahi activos.
   */
  obj.terminar = function() {

    if (cliente) {
      cliente.kill('SIGTERM');
      cliente = null;
    }

    if (proceso) {
      proceso.kill('SIGHUP');
      proceso = null;
    }

  }

  return obj;
});
