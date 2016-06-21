(function () {

    var remote = require('electron').remote;
    var win = remote.getCurrentWindow();

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
