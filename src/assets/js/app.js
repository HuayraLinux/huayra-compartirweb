/* Botón en la barra superior para recargar toda la aplicación. */
window.actualizar = function() {
	document.location.reload();
}
	
/* Botón en la barra superior para mostrar las herramientas de desarrollo. */
window.mostrar_herramientas_de_desarrollo = function() {
	gui.Window.get().showDevTools();
}

var gui = require('nw.gui');
var modulo_servidor = require('./servidor');
var path = require('path');


var app = angular.module('app', ['ngRoute', 'ngAnimate']);


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
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	}
});

app.controller("MainCtrl", function($scope, Descargas) {
	$scope.nombre = "mi nombre";
	$scope.frase = "una frase...";
	$scope.amigos = [];
	$scope.Descargas = Descargas;
	$scope.notificaciones_sin_ver = 0;
	
	function cuando_se_conecta_un_equipo(nombre, servicio) {
		$scope.amigos.push({nombre: nombre, servicio: servicio});
		$scope.$apply();
	}
	
	function cuando_se_desconecta_un_equipo(nombre, servicio) {
		console.log("Se desconectó uno!!!", servicio);
	}

	var servidor = modulo_servidor(cuando_se_conecta_un_equipo, cuando_se_desconecta_un_equipo);
	
	$scope.base = servidor.base;
});

app.controller("PrincipalCtrl", function($scope) {
	var gui = require('nw.gui');
	var ruta_compartidos = process.env.HOME + '/compartido/';
	
	$scope.abrir_carpeta_compartida = function() {
		gui.Shell.openItem(ruta_compartidos);
	}
});

app.controller("PreferenciasCtrl", function($scope) {
	$scope.nombre = $scope.$parent.nombre;
	$scope.frase = $scope.$parent.frase;
	
	$scope.guardar_datos = function() {
		$scope.$parent.nombre = $scope.nombre;
		$scope.$parent.frase = $scope.frase;
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
	
	console.log("iniciando timer para actualizar progreso de las descargas.");
	actualizar_listado();
	
	$scope.$on("$destroy", function(event) {
		$timeout.cancel(timer);
		console.log("cancelando el timer de actualización");
	});
	
});

app.controller("NotificacionesCtrl", function($scope) {
});

app.controller("AmigosCtrl", function($scope, $location) {
	$scope.amigos = $scope.$parent.amigos;
	
	$scope.abrir_descargas_de = function(amigo) {
		$location.path('/archivos/' + amigo.servicio.address + '/obtener/');
	}
});
	
