(function () {

    'use strict';

    // Load libs
    var angular = require("angular");

    // Creates the Angular module & Load lib angular-route inside
    var appModule = angular.module('app', [require('angular-route')]);

    // routeProvider is used to configure routes in angular-route module
    appModule.config(function($routeProvider) {
        // /in_game/ url loads ingame.html and attach it IngameCtrl
        $routeProvider.when('/in_game/', {
            templateUrl: 'lib/ingame/ingameView.html',
            controller: 'IngameCtrl'
        }).otherwise({  // By default goes to /in_game/
            redirectTo: '/in_game/'
        });
    });

})();
