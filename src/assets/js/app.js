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
var modulo_servidor = require('./servidor');
var path = require('path');
var uuid = require('node-uuid');
var events = require('events');

var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.directive("progreso", function() {

    function link(scope, element, attrs) {
        scope.$watch(function() {
            var porcentaje = scope.model.transmitido / scope.model.size * 100;
            element.children(0).css('width', Math.floor(porcentaje) + "%");
        });
    }

    return {
        restrict: 'E',
        replace: true,
        template: '<div>' +
                  '<div style="background-color: green; height: 2px;"></div>' +
                  '{{model.transmitido / model.size * 100 | number:0}} %' +
                  '</div>',
        scope: {
            model: '=',
            porcentaje: '='
        },
        link: link
    }
});

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


app.filter('bytes', function() {
    return function(bytes, precision) {
        if (bytes==0) return '...';
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});

app.controller("MainCtrl", function($scope, $location, $http, Descargas, Eventos) {
    var ruta_preferencias = process.env.HOME + '/.huayra-compartir';
    var data_preferencias = {};
    $scope.notificaciones = [];

    $scope.getClass = function(path) {
        if ($location.path().substr(0, path.length) == path)
          return "active";
      else
          return "";
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

                if (servicio.ip === servidor.mi_ip)
                   return; // Evita mostrar en la vista de amigos mi propio equipo.


              var tmp_url = "http://" + servicio.ip + ":" + servicio.port;

              $http.get(tmp_url).success(function(data) {
                  console.log(data);
                servicio.data = data;
              });

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

          var servidor = modulo_servidor(Eventos, data_preferencias, cuando_se_conecta_un_equipo, cuando_se_desconecta_un_equipo);

          $scope.base = servidor.base;
          $scope.mi_ip = servidor.mi_ip;

            });

});

app.controller("PrincipalCtrl", function($scope) {
    var gui = require('nw.gui');
    var ruta_compartidos = process.env.HOME + '/Compartido/';

    $scope.abrir_carpeta_compartida = function() {
        gui.Shell.openItem(ruta_compartidos);
    }
});

app.controller("DescargasCtrl", function($scope, Descargas, $timeout) {
    var gui = require('nw.gui');
    var ruta_descargas = process.env.HOME + '/Descargas/';

    $scope.$parent.descargas_sin_ver = 0;

    $scope.Descargas = Descargas;
    var timer = null;

    function actualizar_listado() {
        timer = $timeout(actualizar_listado, 1000);
    }

     $scope.abrir_directorio = function() {
        gui.Shell.openItem(ruta_descargas);
    }

     $scope.abrir_item = function(item) {
         gui.Shell.openItem(ruta_descargas + item.name);
     }


     $scope.limpiar_completados = function() {
         var lista_limpia = [];

         for (var i=0; i<$scope.Descargas.length; i++) {
             if (Descargas[i].bajando)
                 lista_limpia.push(Descargas[i]);
         }

         while ($scope.Descargas.length > 0) {
        Descargas.pop();
         }

         for (var i=0; i<lista_limpia.length; i++) {
             $scope.Descargas.push(lista_limpia[i]);
         }
     }

    console.log("iniciando timer para actualizar progreso de las descargas.");
    actualizar_listado();

    $scope.$on("$destroy", function(event) {
        $timeout.cancel(timer);
        console.log("cancelando el timer de actualización");
    });

});

app.controller("NotificacionesCtrl", function($scope, Eventos) {
  $scope.notificaciones = $scope.$parent.notificaciones;

  $scope.$parent.$watch('notificaciones', function() {
      console.log("Cambiaron las notificaciones");
  });


    $scope.limpiar = function() {
        $scope.$parent.notificaciones = [];
        $scope.notificaciones = [];
    }
});


