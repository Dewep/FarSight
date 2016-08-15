(function () {

    var remote = require('electron').remote; // Module to interact with the window
    var win = remote.getCurrentWindow();

    // Angular Header Controller: always on top option, or close the window
    angular.module('app').controller('HeaderCtrl', ['$scope', function ($scope) {
        $scope.alwaysOnTop = win.isAlwaysOnTop();

        // Toogle the option 'always on top' (Window always on top, even if another window has the focus)
        $scope.toogleAlwaysOnTop = function toogleAlwaysOnTop() {
            $scope.alwaysOnTop = !win.isAlwaysOnTop();
            win.setAlwaysOnTop($scope.alwaysOnTop);
        };

        // Close the window/program
        $scope.closeWindow = function closeWindow() {
            win.close();
        };
    }]);

})();
