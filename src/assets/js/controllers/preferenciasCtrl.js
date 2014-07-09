var fs = require('fs');
var http = require('http');
var domain = require('domain');
var exec = require('child_process').exec;
var ruta_preferencias = process.env.HOME + '/.huayra-compartir';
var ruta_avatar = process.env.HOME + '/.huayra-compartir_avatar';

app.controller("PreferenciasCtrl", function($scope, $http, AvahiFactory) {
    var preferencias = new Object();
    $scope.url_avatar = 'http://localhost:' + $scope.puerto + '/avatar';

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
        }).
        error(function (){
            preferencias.nombre = $scope.$parent.nombre;
            preferencias.frase = $scope.$parent.frase;
        });

    $scope.guardar_datos = function() {
        preferencias.nombre = $scope.nombre;
        preferencias.frase = $scope.frase;
        window.guardar_preferencias(preferencias);
        $scope.$parent.nombre = preferencias.nombre;
        $scope.$parent.frase = preferencias.frase;

        AvahiFactory.reiniciar_servicio_publicado();
    }
});
