(function () {

    'use strict';

    var my_decks = require("data/my_decks");

    // CONTROLLER.
    angular.module('app').controller('DecksCtrl', ['$scope', 'DeckService', function ($scope, DeckService) {

        $scope.decks = my_decks.getAll();

        $scope.submit = function() {
            var card = DeckService.searchCardOfName($scope.newCard.name);
            var idx = $scope.newDeckCards.indexOf(card);
            if (idx == -1) {
                card.count = 1;
                $scope.newDeckCards.push(card);
            } else if ($scope.newDeckCards[idx].count == 1) {
                $scope.newDeckCards[idx].count = 2;
            }
        };

        $scope.addDeck = function() {
            $scope.initDialog();
        };

        $scope.initDialog = function() {
            $scope.createDeck = false;
            $scope.newDeckCards = [];
            $scope.newCard = { name: '' };
        };

        $scope.initDialog();
    }]);

    // FILTER.
    angular.module('app').filter('fitlerCardsByName', ['DeckService', function (DeckService) {

        return function(cardName) {
            var result = DeckService.searchCardOfName(cardName);
            return result === null ? '' : result.name;
        };
    }]);

})();
