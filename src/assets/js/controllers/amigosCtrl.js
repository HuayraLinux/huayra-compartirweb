var app = angular.module('app');

app.controller("AmigosCtrl", function($scope, $location, $modal) {
    $scope.amigos = $scope.$parent.amigos;

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
