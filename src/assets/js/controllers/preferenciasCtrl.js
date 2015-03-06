var fs = require('fs');
var http = require('http');
var domain = require('domain');
var exec = require('child_process').exec;
var ruta_preferencias = process.env.HOME + '/.huayra-compartir';
var ruta_avatar = process.env.HOME + '/.huayra-compartir_avatar';

app.controller("PreferenciasCtrl", function($scope, $http, AvahiFactory, PreferenciasFactory, VersionFactory) {
    var preferencias = new Object();

    $scope.url_avatar = 'http://localhost:' + $scope.puerto + '/avatar';
    $scope.puede_guardar = true;
    $scope.version = VersionFactory.obtener_version;

    $scope.cambiar_imagen_de_perfil = function() {
        var el = document.getElementById('fileDialog');

        el.addEventListener("change", function(evt) {
            var path_seleccionado = el.value;
            var comando = "convert '" + path_seleccionado + "' -thumbnail '100x100^' -gravity center -extent 100x100 png:" + ruta_avatar;

            function cuando_termina_conversion() {
                var imagen_avatar = document.getElementById('imagen_avatar');
                imagen_avatar.src = ruta_avatar + '?' + new Date()
            }

            exec(comando, function(error, stdout, stderror) {
                console.log({error: error,
                             stdout: stdout,
                             stderr: stderror});

                $scope.puede_guardar = true;
                cuando_termina_conversion();
            });

        }, false);

        el.click();
    }

    $http.get(ruta_preferencias).
        success(function (data, status){
            preferencias = data
            $scope.nombre = preferencias.nombre;
            $scope.frase = preferencias.frase;
            $scope.puede_guardar = false;
        }).
        error(function (){
            preferencias.nombre = $scope.$parent.nombre;
            preferencias.frase = $scope.$parent.frase;
            $scope.puede_guardar = false;
        });

    function permitir_guardado() {
      $scope.puede_guardar = true;
    }

    $scope.publicar = function() {
      AvahiFactory.reiniciar_servicio_publicado();
    }

    $scope.scan = function() {
      AvahiFactory.reiniciar_servicio_descubrimiento();
    }

    $scope.$watch('nombre', permitir_guardado);
    $scope.$watch('frase', permitir_guardado);

    $scope.guardar_datos = function() {
        preferencias.nombre = $scope.nombre;
        preferencias.frase = $scope.frase;
        window.guardar_preferencias(preferencias);
        $scope.$parent.nombre = preferencias.nombre;
        $scope.$parent.frase = preferencias.frase;

        $scope.puede_guardar = false;

        PreferenciasFactory.nombre = $scope.nombre;
        PreferenciasFactory.frase = $scope.frase;
    };


    $scope.crear_red_adhoc = function() {

        if (window.win !== undefined) {
            window.win.focus();
        } else {

            var win = gui.Window.open('app://src/ayuda.html', {
              width: 650,
              height: 700,
              toolbar: false,
            });

            win.on('close', function() {
                win.close(true);
                delete window.win;
            });

            window.win = win;

            setTimeout(function() {win.focus();}, 10);
        }

    };
});
