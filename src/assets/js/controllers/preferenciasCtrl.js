
var fs = require('fs');
var http = require('http');

var ruta_preferencias = process.env.HOME + '/.huayra-compartir';

app.controller("PreferenciasCtrl", function($scope, $http) {
    var preferencias = new Object();
    $scope.url_avatar = $scope.base + '/avatar';
    
    
    $scope.cambiar_imagen_de_perfil = function() {
        var el = document.getElementById('fileDialog');
        
        el.addEventListener("change", function(evt) {
      		console.log(this.value);
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
		}
});