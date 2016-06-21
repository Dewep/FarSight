(function () {

    'use strict';

    var angular = require("angular");
    var remote = require('electron').remote;
    var win = remote.getCurrentWindow();

    angular.module('app').run(['$rootScope', '$location', '$routeParams', function($rootScope, $location, $routeParams) {
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            console.info('Route:', $location.path(), $routeParams);
        });
    }]);

    angular.module('app').controller('HeaderCtrl', ['$scope', function ($scope) {
        $scope.alwaysOnTop = win.isAlwaysOnTop();

        $scope.toogleAlwaysOnTop = function toogleAlwaysOnTop() {
            $scope.alwaysOnTop = !win.isAlwaysOnTop();
            win.setAlwaysOnTop($scope.alwaysOnTop);
        };

        $scope.closeWindow = function closeWindow() {
            win.close();
        };
    }]);

})();
