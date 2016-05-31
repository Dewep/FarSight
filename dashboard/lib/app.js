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
        $routeProvider/*.when('/', {
            templateUrl: 'lib/home/home.html',
            controller: 'HomeCtrl'
        }).when('/my_decks/', {
            templateUrl: 'lib/my_decks/list.html',
            controller: 'MydecksCtrl'
        }).when('/my_decks/new/', {
            templateUrl: 'lib/my_decks/new.html',
            controller: 'MydecksCtrl'
        }).when('/my_decks/:id/', {
            templateUrl: 'lib/my_decks/detail.ht ml',
            controller: 'MydecksCtrl'
        })*/.when('/in_game/', {
            templateUrl: 'lib/ingame/ingame.html',
            controller: 'IngameCtrl'
        }).otherwise({
            //redirectTo: '/'
            redirectTo: '/in_game/'
        });
    }]);

})();
