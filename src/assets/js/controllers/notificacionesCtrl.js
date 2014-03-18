app.controller("NotificacionesCtrl", function($scope, Eventos) {
    $scope.notificaciones = $scope.$parent.notificaciones;

    $scope.$parent.$watch('notificaciones', function() {
        console.log("Cambiaron las notificaciones");
    });

    $scope.limpiar = function() {
        $scope.$parent.notificaciones = [];
        $scope.notificaciones = [];
    }
});


