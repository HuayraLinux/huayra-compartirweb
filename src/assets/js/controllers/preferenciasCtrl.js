
var fs = require('fs');
var http = require('http');

var ruta_preferencias = process.env.HOME + '/.huayra-compartir';

app.controller("PreferenciasCtrl", function($scope, $http) {
    var perfil = new Object();

    $http.get(ruta_preferencias).
        success(function (data, status){
            perfil = data
            $scope.nombre = perfil.nombre;
            $scope.frase = perfil.frase;
        }).
        error(function (){
            perfil.nombre = $scope.$parent.nombre;
            perfil.frase = $scope.$parent.frase;
        });

	$scope.guardar_datos = function() {
        perfil.nombre = $scope.nombre;
        perfil.frase = $scope.frase;

        fs.writeFile(ruta_preferencias, angular.toJson(perfil), function(err){
            if (err) {
                alert("error");
            }
        });

		$scope.$parent.nombre = perfil.nombre;
		$scope.$parent.frase = perfil.frase;
	}
})



