(function () {

    'use strict';

    var my_decks = require("data/my_decks");

    angular.module('app').controller('DecksCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        $scope.decks = my_decks.getAll();

        console.log($scope.decks);

    }]);

})();
