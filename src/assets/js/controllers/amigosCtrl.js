var app = angular.module('app');

app.controller("AmigosCtrl", function($scope, $location, $modal, $timeout) {
    $scope.amigos = $scope.$parent.amigos;
    $scope.actualizar_deshabilitado = false;

    $scope.actualizar = function() {
      $scope.actualizar_deshabilitado = true;

      $timeout(function() {
        $scope.actualizar_deshabilitado = false;
        console.log($scope.amigos);

        $scope.$parent.$apply();
        $scope.amigos = $scope.$parent.amigos;
        $scope.$apply();
      }, 1000);

    }

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
