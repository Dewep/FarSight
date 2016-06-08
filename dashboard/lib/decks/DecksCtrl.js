(function () {

    'use strict';

    // CONTROLLER.
    angular.module('app').controller('DecksCtrl', ['$scope', 'CardsService', 'MyDecksService', function ($scope, CardsService, MyDecksService) {

        $scope.decks = MyDecksService.getAll();

        $scope.submit = function() {
            var card = CardsService.searchCardOfName($scope.newCard.name);
            if (card === null)
                return;
            var idx = $scope.newDeck.cards.indexOf(card);
            if (idx == -1) {
                card.count = 1;
                $scope.newDeck.cards.push(card);
            } else if ($scope.newDeck.cards[idx].count == 1) {
                $scope.newDeck.cards[idx].count = 2;
                $scope.newCard = { name: '' };
            }
        };

        $scope.delete = function(card) {
            var idx = $scope.newDeck.cards.indexOf(card);
            if ($scope.newDeck.cards[idx].count == 2)
                $scope.newDeck.cards[idx].count = 1;
            else
                $scope.newDeck.cards.splice(idx, 1);
        };

        $scope.addDeck = function() {
            if ($scope.newDeck.hero === '' || $scope.newDeck.name === '')
                return;
            var doubles = [];
            for (var key in $scope.newDeck.cards) {
                if ($scope.newDeck.cards[key].count === 2) // Duplicate card
                    doubles.push($scope.newDeck.cards[key].id);
                doubles.push($scope.newDeck.cards[key].id);
            }
            $scope.newDeck.cards = doubles;
            MyDecksService.addDeck($scope.newDeck);
            $scope.initDialog();
        };

        $scope.initDialog = function() {
            $scope.createDeck = false;
            $scope.newCard = { name: '' };
            $scope.newDeck = { name: '', hero: '', cards: []};
        };

        $scope.initDialog();
    }]);

    // FILTER.
    angular.module('app').filter('fitlerCardsByName', ['CardsService', function (CardsService) {

        return function(cardName) {
            var result = CardsService.searchCardOfName(cardName);
            return result === null ? '' : result.name;
        };
    }]);

})();
