app.controller("ArchivosCtrl", function($scope, $http, $routeParams, $location) {
	$scope.esta_en_directorio_raiz = true;
	$scope.archivos = [];
	var path = "";
	
	if ($routeParams.url === undefined) {
		var base_path = $scope.$parent.base;
		var relative_path = "obtener/";
		var path = base_path + '/' +  relative_path;
	}
	else {
		var relative_path = $routeParams.url;
		var path = 'http://' +  relative_path;
	}
	
	function actualizar_listado() {
		$http.get(path).success(function(data) {
			$scope.archivos = data.archivos;
		});
	}
	
	$scope.descargar = function(archivo) {
	}
	
	$scope.abrir = function(archivo) {
		var ruta_con_dominio = archivo.url.replace('http://', '');
		$location.path('/archivos/' + ruta_con_dominio);
	}
	
	//$scope.$watch('directorio', function() {
	//	$scope.esta_en_directorio_raiz = /\/ls$/.test($scope.directorio);
	//});
	
	$scope.regresar = function() {
		$scope.abrir_directorio('..');
	}
	
	
	actualizar_listado();
});
