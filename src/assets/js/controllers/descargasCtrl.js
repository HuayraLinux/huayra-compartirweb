var gui = require('nw.gui');

app.controller("DescargasCtrl", function($scope, Descargas, $timeout) {
    var ruta_descargas = process.env.HOME + '/Descargas/';

    $scope.$parent.descargas_sin_ver = 0;

    $scope.Descargas = Descargas;
    var timer = null;

    function actualizar_listado() {
        timer = $timeout(actualizar_listado, 1000);
    }

    $scope.abrir_directorio = function() {
        gui.Shell.openItem(ruta_descargas);
    };

    $scope.abrir_item = function(item) {
        gui.Shell.openItem(ruta_descargas + item.name);
    };

    $scope.limpiar_completados = function() {
        var lista_limpia = [], i;

        for (i=0; i<$scope.Descargas.length; i++) {
            if (Descargas[i].bajando) {
                lista_limpia.push(Descargas[i]);
            }
        }

        while ($scope.Descargas.length > 0) {
            Descargas.pop();
        }

        for (i=0; i<lista_limpia.length; i++) {
            $scope.Descargas.push(lista_limpia[i]);
        }
    };

    console.log("iniciando timer para actualizar progreso de las descargas.");
    actualizar_listado();

    $scope.$on("$destroy", function(event) {
        $timeout.cancel(timer);
        console.log("cancelando el timer de actualización");
    });
});
