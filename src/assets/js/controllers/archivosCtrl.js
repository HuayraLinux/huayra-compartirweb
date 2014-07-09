var fs = require('fs');
var http = require('http');

app.controller("ArchivosCtrl", function($scope, $http, $routeParams, $location, Descargas) {
    $scope.esta_en_directorio_raiz = true;
    $scope.archivos = [];
    $scope.Descargas = Descargas;
    $scope.filtro = '';
    $scope.mi_ip = $scope.$parent.mi_ip;
    $scope.es_vista_mis_archivos = true;

    var path = "";

    var ruta_descargas = process.env.HOME + '/Descargas/';

    // Genera el directorio descargas si no existe.
    if (! fs.existsSync(ruta_descargas))
        fs.mkdir(ruta_descargas);

    if ($routeParams.url === undefined) {
        var base_path = $scope.$parent.base;
        var relative_path = "obtener/";
        var path = base_path + '/' +  relative_path;
        $scope.path = '/';
    }
    else {
        var relative_path = $routeParams.url;
        var path = 'http://' +  relative_path;
        $scope.path = relative_path.split('obtener/')[1];

        if (! $scope.path) {
          $scope.path = '/';
        }
    }



    function actualizar_listado() {
        if ($routeParams.url) {
            var host_a_visitar = $routeParams.url.split(':')[0];
            $scope.es_vista_mis_archivos = (host_a_visitar === $scope.mi_ip);
        }

        $scope.en_curso = true;

        setTimeout(function() {
            $http.get(path).success(function(data) {
                $scope.en_curso = false;
                $scope.archivos = data.archivos;
            });
        }, 500);
    }

    $scope.actualizar = function() {
      actualizar_listado();
    }

    $scope.descargar = function(archivo) {
        var objeto_descarga = archivo;
        objeto_descarga.transmitido = 0;
        $scope.Descargas.push(objeto_descarga);
        $scope.$parent.descargas_sin_ver += 1;

        archivo.bajando = true;

        var file = fs.createWriteStream(ruta_descargas + archivo.name);

        http.get(archivo.url, function(res) {

            res.on('data', function(chunk) {
                file.write(chunk);
                objeto_descarga.transmitido += chunk.length;
            });

            res.on('end', function() {
                objeto_descarga.transmitido = objeto_descarga.size;
                objeto_descarga.bajando = false;
                objeto_descarga.estado = 'success';
                //file.close(); // produce un bug porque cierra el archivo mientras que está copiando. El archivo queda truncado.
            });

            res.on('close', function (){
                // Cuando se corta la conexión;
                objeto_descarga.estado = 'error';
                fs.unlink(ruta_descargas + archivo.name);
            });
        }).on('error', function(){
            // Cuando se cae el servidor antes de iniciar el request;
            objeto_descarga.estado = 'error';
            fs.unlink(ruta_descargas + archivo.name);
        });

    }

    $scope.abrir = function(archivo) {
        var ruta_con_dominio = archivo.url.replace('http://', '');
        $location.path('/archivos/' + ruta_con_dominio);
        $scope.filtro = '';
    }

    //$scope.$watch('directorio', function() {
    //    $scope.esta_en_directorio_raiz = /\/ls$/.test($scope.directorio);
    //});

    $scope.regresar = function() {
        history.back();
    }

    var gui = require('nw.gui');
    var ruta_compartidos = process.env.HOME + '/Compartido/';

    $scope.abrir_carpeta_compartida = function() {
        gui.Shell.openItem(ruta_compartidos);
    }

    actualizar_listado();
});
