/* Botón en la barra superior para recargar toda la aplicación. */
window.actualizar = function() {
	document.location.reload();
}
	
/* Botón en la barra superior para mostrar las herramientas de desarrollo. */
window.mostrar_herramientas_de_desarrollo = function() {
	gui.Window.get().showDevTools();
}

var gui = require('nw.gui');
var servidor = require('./servidor');
var path = require('path');

servidor.iniciar();

var app = angular.module('app', ['ngRoute']);

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
          when('/archivos', {
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

app.controller("MainCtrl", function($scope) {
	$scope.nombre = "mi nombre";
	$scope.frase = "una frase...";
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



app.controller("NotificacionesCtrl", function($scope) {
});

app.controller("AmigosCtrl", function($scope) {
});
	
app.controller("ArchivosCtrl", function($scope, $http) {
	$scope.esta_en_directorio_raiz = true;
	$scope.directorio = servidor.url + '/ls';
	$scope.archivos = [];
	
	function actualizar_listado() {
		$http.get($scope.directorio).success(function(data) {
			$scope.archivos = data.archivos;
		});
	}
	
	$scope.descargar = function(archivo) {
		alert(archivo);
	}
	
	$scope.$watch('directorio', function() {
		console.log($scope.directorio);
		console.log(servidor.url + '/ls');
		console.log("");
		
		$scope.esta_en_directorio_raiz = /\/ls$/.test($scope.directorio);
	});
	
	$scope.regresar = function() {
		$scope.abrir_directorio('..');
	}
	
	$scope.abrir_directorio = function(directorio) {
		$scope.directorio = path.join($scope.directorio, directorio);
		actualizar_listado();
	}
	
	actualizar_listado();
});
