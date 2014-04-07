/* Botón en la barra superior para recargar toda la aplicación. */
window.actualizar = function() {
    document.location.reload();
}

/* Botón en la barra superior para mostrar las herramientas de desarrollo. */
window.mostrar_herramientas_de_desarrollo = function() {
    gui.Window.get().showDevTools();
}

window.guardar_preferencias = function(preferencias) {
    var ruta_preferencias = process.env.HOME + '/.huayra-compartir';

    fs.writeFile(ruta_preferencias, angular.toJson(preferencias), function(err){
        if (err) {
            alert("error");
        }
    });
}



var gui = require('nw.gui');
var path = require('path');
var uuid = require('node-uuid');
var events = require('events');

var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) { $routeProvider.
          when('/principal', {
            controller: 'PrincipalCtrl',
            templateUrl: 'partials/principal.html'
          }).
          when('/preferencias', {
            controller: 'PreferenciasCtrl',
            templateUrl: 'partials/preferencias.html'
          }).
          when('/notificaciones', {
            controller: 'NotificacionesCtrl',
            templateUrl: 'partials/notificaciones.html'
          }).
          when('/amigos', {
            controller: 'AmigosCtrl',
            templateUrl: 'partials/amigos.html'
          }).
          when('/descargas', {
            controller: 'DescargasCtrl',
            templateUrl: 'partials/descargas.html'
          }).
          when('/archivos', {
            controller: 'ArchivosCtrl',
            templateUrl: 'partials/archivos.html'
          }).
          when('/archivos/:url*', {
            controller: 'ArchivosCtrl',
            templateUrl: 'partials/archivos.html'
          }).
          otherwise({redirectTo:'/principal'});
}]);



app.controller("MainCtrl", function($scope, $location, $http, Singleton, Servidor, Descargas, Eventos, $timeout) {
    var ruta_preferencias = process.env.HOME + '/.huayra-compartir';
    var data_preferencias = {};
    $scope.notificaciones = [];

    Singleton.iniciar();

    $scope.getClass = function(path) {

        if ($location.path().substr(0, "/archivos".length) == "/archivos") {
            var es_mi_equipo = ($location.path().indexOf($scope.mi_ip) > 1);

            // Muestra la seccion archivos.
            if (path == '/archivos' && (es_mi_equipo || $location.path() === "/archivos"))
                return "active";

            // Muestra la seccion amigos.
            if (path == '/amigos' && !es_mi_equipo && $location.path() !== "/archivos")
                return "active";


        } else {
            // Si no es una seccion especial, usa la URL y el path
            // para indicar si la sección está activa o no.
            if ($location.path().substr(0, path.length) == path)
                return "active";
            else
                return "";
        }
    }

    Eventos.on('inicia', function(data) {
          $scope.notificaciones.push(data);
          $scope.$apply();
    });

    Eventos.on('finaliza', function(data) {
          for (var index in $scope.notificaciones) {
            if ($scope.notificaciones[index].id === data.id) {
              $scope.notificaciones[index].texto = data.texto;
              $scope.notificaciones[index].estado = data.estado;
              $scope.$apply();
              return;
             }
           }
    });


    function agregar_amigo(servicio) {
        for (var key in $scope.amigos) {
            if (servicio.id === $scope.amigos[key].id) {
                $scope.amigos[key].nombre = servicio.nombre;
                $scope.amigos[key].frase = servicio.frase;
                return;
            }
        }

        // En caso de no encontrarlo en la lista de amigos, lo agrega.
        var tmp_url = "http://" + servicio.ip + ":" + servicio.port;

        $http.get(tmp_url).success(function(data) {
            servicio.data = data;
        });

        $scope.amigos.push(servicio);
    }

    $http.get(ruta_preferencias).
        success(function (data, status){
            $scope.nombre = data.nombre;
            $scope.frase = data.frase;
            $scope.id = data.id;
            data_preferencias = data;
        }).
        error(function (){
            $scope.nombre = "mi nombre";
            $scope.frase = "una frase...";
            $scope.id = uuid.v1();
            data_preferencias = {
                nombre: $scope.nombre,
                frase: $scope.frase,
                id: $scope.id
            };

            guardar_preferencias(data_preferencias);

        }).finally(function(data) {
          $scope.amigos = [];
          $scope.Descargas = Descargas;
          $scope.notificaciones_sin_ver = 0;

          function cuando_se_conecta_un_equipo(nombre, servicio) {
            //console.log({evento: "up", servicio: servicio});

            // si el servicio es "huayra-compartir" copiamos el dict a nuestra lista de amigos
              if (servicio.name === "huayra-compartir") {

                if (servicio.ip === Servidor.mi_ip || servicio.ip === 'localhost')
                   return; // Evita mostrar en la vista de amigos mi propio equipo.

                agregar_amigo(servicio);


                $scope.$apply();
            }
          }

          function cuando_se_desconecta_un_equipo(nombre, servicio) {
            //console.log({evento: "down", servicio: servicio});

                for (var key in $scope.amigos) {
                 if (servicio.id === $scope.amigos[key].id)
                 $scope.amigos.splice(key, 1);
             }

            $scope.$apply();
          }


          Servidor.inyectar_dependencias(Eventos, data_preferencias, cuando_se_conecta_un_equipo, cuando_se_desconecta_un_equipo);
          Servidor.iniciar();

          // Realiza consultas sobre la red para informar
          // si se queda sin conexión.
          var timer = null;
          var modo_offline_anterior = (Servidor.obtener_ip() === "localhost");

          function actualizar_notificador_modo_offline() {
              timer = $timeout(actualizar_notificador_modo_offline, 3000);
              $scope.offline = (Servidor.obtener_ip() === "localhost");

              if ($scope.offline != modo_offline_anterior) {

                if (! $scope.offline) {
                  Servidor.reiniciar_polo();
                }
              }

              modo_offline_anterior = $scope.offline;
          }

          $scope.$on("$destroy", function(event) {
              $timeout.cancel(timer);
          });

          actualizar_notificador_modo_offline();
          $scope.base = Servidor.base;
          $scope.mi_ip = Servidor.mi_ip;
        });

});

app.controller("PrincipalCtrl", function($scope) {
    var gui = require('nw.gui');
    var ruta_compartidos = process.env.HOME + '/Compartido/';

    $scope.abrir_carpeta_compartida = function() {
        gui.Shell.openItem(ruta_compartidos);
    }
});
