(function () {

    'use strict';

    // Loads Angular lib
    var angular = require("angular");

    // Creates the app module and defines the routes
    angular
        .module('app', [require('angular-route')])
        .config(['$routeProvider', function($routeProvider) {
            // /in_game/ URL loads ingame.html with its controller IngameCtrl
            $routeProvider.when('/in_game/', {
                templateUrl: 'lib/ingame/ingame.html',
                controller: 'IngameCtrl'
            }).otherwise({  // By default goes to /in_game/
                redirectTo: '/in_game/'
            });
        }]);
})();
