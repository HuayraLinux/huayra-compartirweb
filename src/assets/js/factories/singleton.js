app.factory("Singleton", function(Menu, AvahiFactory) {
    /* Se encarga de mantener una sola instancia de la
    aplicación abierta */

    var http = require('http');
    var gui = require('nw.gui');
    var port = 33355;

    function mostrar_ventana() {
        var ventana = gui.Window.get();
        ventana.show();
        ventana.restore();
    }

    function iniciar() {

        var server = http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Singleton APP');
            mostrar_ventana();
        }).listen(port, '127.0.0.1', function(){
            //mostrar_ventana();
            Menu.crear();

            // Se re-define por unica vez el evento close. Esto evita que
            // la ventana se pueda cerrar.
            gui.Window.get().on('close', function() {
                this.hide();
            });

      console.log("%cHey, bienvenido al modo desarrollo. Desde acá vas a poder ver y modificar el funcionamiento de la aplicación.", "color: blue");
        });

        server.on('error', function(){
            http.get('http://127.0.0.1:' + port, function() {
                gui.App.quit();
            });
        });

    }

    return {iniciar: iniciar};
});
