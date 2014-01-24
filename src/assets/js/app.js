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
	
app.controller("ArchivosCtrl", function($scope) {
});