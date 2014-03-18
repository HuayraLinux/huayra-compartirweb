app.directive("progreso", function() {

    function link(scope, element, attrs) {
        scope.$watch(function() {
            var porcentaje = scope.model.transmitido / scope.model.size * 100;
            element.children(0).css('width', Math.floor(porcentaje) + "%");
        });
    }

    return {
        restrict: 'E',
        replace: true,
        template: '<div>' +
                  '<div style="background-color: green; height: 2px;"></div>' +
                  '{{model.transmitido / model.size * 100 | number:0}} %' +
                  '</div>',
        scope: {
            model: '=',
            porcentaje: '='
        },
        link: link
    }
});
