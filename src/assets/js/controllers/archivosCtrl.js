var fs = require('fs');

app.controller("ArchivosCtrl", function($scope, $http, $routeParams, $location, Descargas) {
	$scope.esta_en_directorio_raiz = true;
	$scope.archivos = [];
	$scope.Descargas = Descargas;
	var path = "";
	
	var ruta_descargas = process.env.HOME + '/Descargas/';
	
	// Genera el directorio descargas si no existe.
	if (! fs.existsSync(ruta_descargas))
		fs.mkdir(ruta_descargas);
	
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
		var objeto_descarga = archivo;
		objeto_descarga.transmitido = 0;
		$scope.Descargas.push(objeto_descarga);
		$scope.$parent.descargas_sin_ver += 1;
		
		archivo.bajando = true;
		
		
		var http = require('http');
		var fs = require('fs');

		var file = fs.createWriteStream(ruta_descargas + archivo.name);

http.get(archivo.url, function(res) {
	
  res.on('data', function(chunk) {
    file.write(chunk);
		objeto_descarga.transmitido += chunk.length;
		console.log(objeto_descarga.transmitido);
  });
	
  res.on('end', function() {
		objeto_descarga.transmitido = objeto_descarga.size;
    //file.close();
  });
	
	res.on('error', function() {
		console.log("Error!!!");
	});
	
});
		
		
		
		
		/*
		
		
var fs = require('fs');
var request = require('request');
var progress = require('request-progress');

// Note that the options argument is optional
progress(request(archivo.url), {
    throttle: 2000,  // Throttle the progress event to 2000ms, defaults to 1000ms
    delay: 1000      // Only start to emit after 1000ms delay, defaults to 0ms
})
.on('progress', function (state) {
    console.log('received size in bytes', state.received);
	console.log(state);
    // The properties bellow can be null if response does not contain
    // the content-length header
    console.log('total size in bytes', state.total);
    console.log('percent', state.percent);
		objeto_descarga.progreso = state.percent / 100;
		console.log(objeto_descarga);
		$scope.$apply();
})
.on('error', function (err) {
    // Do something with err
})
.pipe(fs.createWriteStream('/tmp/doodle.png'))
.on('error', function (err) {
    // Do something with err
})
.on('close', function (err) {
    // Saved to doogle.png!
})
		
		*/
		
	}
	
	$scope.abrir = function(archivo) {
		var ruta_con_dominio = archivo.url.replace('http://', '');
		$location.path('/archivos/' + ruta_con_dominio);
	}
	
	//$scope.$watch('directorio', function() {
	//	$scope.esta_en_directorio_raiz = /\/ls$/.test($scope.directorio);
	//});
	
	$scope.regresar = function() {
		history.back();
	}
	
	
	actualizar_listado();
});
