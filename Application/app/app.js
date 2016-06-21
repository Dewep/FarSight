(function () {

    var angular = require("angular");

    angular.module('app', [
        require('angular-route')
    ]).config(['$routeProvider', function($routeProvider) {
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
