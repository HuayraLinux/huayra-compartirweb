var app = angular.module('app');

app.factory('AvahiFactory', function(AmigosFactory) {
  var obj = {};
  var proceso = null;  // proceso browse, para descubrir equipos en la red.
  var cliente = null;  // proceso para publicar el servicio en la red.

  obj.iniciar = function() {
      proceso = spawn('avahi-browse', ['-a', '-r', '-p'])
      var last = '';

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

          //console.log(lines[i]);

          if (/huayracompartir/.test(nombre)) {
            id = nombre.split('_')[1];

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

      proceso.on('exit', function(codigo) {
        console.log("Error, el comando retorno: " + codigo);
      })
  }

  obj.reiniciar_servicio_publicado = function() {
    if (cliente)
      cliente.kill('SIGHUP');

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
        'huayracompartir_' + id,
        '_http._tcp', puerto, 
        'ip=' + ip
        ]
        );

    cliente.stdout.on('data', function(data) {
      console.log(data);
    });

    cliente.on('exit', function(codigo) {
      if (codigo)
        console.log("Error, el comando retorno: " + codigo);
      else
        console.log("ha finalizado el comando avahi-publish-service");
    })

    console.log("listo!!!!");
  }

  return obj;
});
