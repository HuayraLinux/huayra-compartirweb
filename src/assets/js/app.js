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
	
	function cuando_se_conecta_un_equipo(nombre, servicio) {
		$scope.amigos.push({nombre: nombre, frame: '????'});
		$scope.$apply();
	}
	
	function cuando_se_desconecta_un_equipo(nombre, servicio) {
		console.log("Se desconectó uno!!!", servicio);
	}

	var servidor = modulo_servidor(cuando_se_conecta_un_equipo, cuando_se_desconecta_un_equipo);
	
	$scope.base = servidor.base;
});

app.controller("PrincipalCtrl", function($scope) {
});

app.controller("PreferenciasCtrl", function($scope) {
	$scope.nombre = $scope.$parent.nombre;
	$scope.frase = $scope.$parent.frase;
	
	$scope.guardar_datos = function() {
		$scope.$parent.nombre = $scope.nombre;
		$scope.$parent.frase = $scope.frase;
	}
});


app.controller("DescargasCtrl", function($scope, Descargas) {
	$scope.Descargas = Descargas;
});

app.controller("NotificacionesCtrl", function($scope) {
});

app.controller("AmigosCtrl", function($scope) {
	$scope.amigos = $scope.$parent.amigos;
});
	
