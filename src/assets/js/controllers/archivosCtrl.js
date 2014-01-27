app.controller("ArchivosCtrl", function($scope, $http, $routeParams) {
	$scope.esta_en_directorio_raiz = true;
	$scope.archivos = [];
	
	var relative_path = $routeParams.url || "obtener/";
	var base_path = $scope.$parent.base;
	
	function actualizar_listado() {
		var path = base_path + '/' +  relative_path;
		alert(path);
		$http.get(path).success(function(data) {
			$scope.archivos = data.archivos;
		});
	}
	
	$scope.descargar = function(archivo) {
		alert(archivo);
	}
	
	//$scope.$watch('directorio', function() {
	//	$scope.esta_en_directorio_raiz = /\/ls$/.test($scope.directorio);
	//});
	
	$scope.regresar = function() {
		$scope.abrir_directorio('..');
	}
	
	$scope.abrir_directorio = function(directorio) {
		$scope.directorio = path.join($scope.directorio, directorio);
		actualizar_listado();
	}
	
	actualizar_listado();
});
