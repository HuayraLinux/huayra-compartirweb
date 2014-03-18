app.factory("Descargas", function() {
    var descargas = [
    ];

    return descargas;
});


app.factory('Eventos', function() {
  console.log("Creando el emisor de eventos!");
  var eventos = new events.EventEmitter();
  return eventos;
});



app.factory("Singleton", function() {
    /* Se encarga de mantener una sola instancia de la
    aplicación abierta */

    var http = require('http');
    var gui = require('nw.gui');
    var port = 33355;

    function mostrar_ventana() {
        var ventana = gui.Window.get();
        ventana.show();
    }

    function iniciar() {

        var server = http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Singleton APP');
            mostrar_ventana();
        }).listen(port, '127.0.0.1', function(){
            mostrar_ventana();
        });

        server.on('error', function(){
            http.get('http://127.0.0.1:' + port, function() {
                alert("Soy la segunda instancia, terminando y haciendo request para re-abrir...");
                gui.App.quit();
            });
        });

    }

    return {iniciar: iniciar};
});
