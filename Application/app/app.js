(function () {

    var angular = require("angular");

    // Angular main definition
    angular.module('app', [
        // Dependencies

        require('angular-route') // Router library

    ]).config(['$routeProvider', function($routeProvider) {

        // Definitions of the routes
        $routeProvider.when('/my_decks/', {
            templateUrl: 'app/MyDecks/list.html',
            controller: 'MyDecksCtrl'
        }).when('/in_game/', {
            templateUrl: 'app/InGame/view.html',
            controller: 'InGameCtrl'
        }).otherwise({
            redirectTo: '/in_game/'
        });

    }]);

})();
