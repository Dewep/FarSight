(function () {

    'use strict';

    var angular = require("angular");

    angular.module('app').run(['$rootScope', '$location', '$routeParams', function($rootScope, $location, $routeParams) {
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            console.info('Route:', $location.path(), $routeParams);
        });
    }]);

})();
