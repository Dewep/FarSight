(function () {

    'use strict';

    var my_decks = require("data/my_decks");

    angular.module('app').controller('DecksCtrl', ['$scope', function ($scope) {

        $scope.decks = my_decks.getAll();

        console.log($scope.decks);

    }]);

})();
