
var fs = require('fs');
var resizer = require('resizer');
var http = require('http');
var domain = require('domain');

var ruta_preferencias = process.env.HOME + '/.huayra-compartir';
var ruta_avatar = process.env.HOME + '/.huayra-compartir_avatar';

app.controller("PreferenciasCtrl", function($scope, $http) {
    var preferencias = new Object();
    $scope.url_avatar = $scope.base + '/avatar';
    
    
    $scope.cambiar_imagen_de_perfil = function() {
        var el = document.getElementById('fileDialog');
				var path_seleccionado = el.value;
        
        el.addEventListener("change", function(evt) {
					
					function capturar_errores(error) {
						console.log("Error al generar el avatar:", {error: error});
					}
					
					var d = domain.create(); 
					
    			d.on('error', capturar_errores); 
					
    			d.run(function() { 
						var inputImage = fs.createReadStream(path_seleccionado);
						var outputImage = fs.createWriteStream(ruta_avatar);
						var stream = resizer.contain({height: 100, width:100});
						var conversion = inputImage.pipe(stream).pipe(outputImage);
						
						function cuando_termina_conversion() {
							var imagen_avatar = document.getElementById('imagen_avatar');
							imagen_avatar.src = ruta_avatar + '?' + new Date()
						}
						
						conversion.on('end', cuando_termina_conversion);
    			}); 
					
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