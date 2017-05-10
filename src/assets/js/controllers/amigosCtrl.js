var app = angular.module('app');

app.controller("AmigosCtrl", function($scope, $location, $modal, $timeout, AmigosFactory) {
    $scope.data = {};
    $scope.amigos = $scope.$parent.amigos;
    $scope.actualizar_deshabilitado = false;

    $scope.data.amigos = AmigosFactory.amigos;

    $scope.actualizar = function() {
      $scope.actualizar_deshabilitado = true;
      AmigosFactory.forzar_actualizado();

      $timeout(function() {
        $scope.actualizar_deshabilitado = false;
        $scope.now = Math.random();
      }, 1000);

    }

    $scope.now = Math.random();

    var ModalAgregarCtrl = function($scope, $modalInstance, test) {
        $scope.ip_valida = false;

        $scope.cancelar = function() {
            $modalInstance.close();
        }

    }

    $scope.agregar = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_agregar.html',
            controller: ModalAgregarCtrl,
            resolve: {
                test: "si"
            }
        });
    }

    $scope.abrir_descargas_de = function(amigo) {
        $location.path('/archivos/' + amigo.ip + ':' + amigo.port + '/obtener/');
    }
});
