(function () {

    'use strict';

    var angular = require("angular");

    angular.module('app.directive', []);

    angular.module('app.service', []);

    angular.module('app.filter', []);

    angular.module('app.templates', []);

    angular.module('app', [
        require('angular-route'),

        'app.directive',
        'app.service',
        'app.filter',
        'app.templates'
    ]).config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'lib/ingame/ingame.html',
            controller: 'IngameCtrl'
        }).otherwise({
            redirectTo: '/'
        });
    }]);

})();
