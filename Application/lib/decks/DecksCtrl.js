(function () {

    // CONTROLLER.
    angular.module('app').controller('DecksCtrl', ['$scope', 'CardsService', 'MyDecksService', function ($scope, CardsService, MyDecksService) {

        $scope.totalCards = 0;

        $scope.decks = MyDecksService.getAll();

        $scope.dialogAutocompleteSubmit = dialogAutocompleteSubmit;
        $scope.dialogDeleteCard = dialogDeleteCard;
        $scope.dialogCreateDeck = dialogCreateDeck;
        $scope.dialogInit = dialogInit;
        $scope.editDeck = editDeck;
        $scope.removeDeck = removeDeck;

        $scope.dialogInit();

        $scope.$watch('newDeck', function(newValue) {
            $scope.totalCards = newValue.cards.reduce(function(a, b) {
                return a + b.count;
            }, 0);
        }, true);

        // --
        // Methods.
        // --

        function dialogAutocompleteSubmit() {
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
        }

        function dialogDeleteCard(card) {
            var idx = $scope.newDeck.cards.indexOf(card);
            if ($scope.newDeck.cards[idx].count == 2)
                $scope.newDeck.cards[idx].count = 1;
            else
                $scope.newDeck.cards.splice(idx, 1);
        }

        function dialogCreateDeck() {
            if ($scope.newDeck.hero === '' || $scope.newDeck.name === '')
                return;
            var doubles = [];
            for (var key in $scope.newDeck.cards) {
                if ($scope.newDeck.cards[key].count === 2) // Duplicate card
                    doubles.push($scope.newDeck.cards[key].id);
                doubles.push($scope.newDeck.cards[key].id);
            }
            $scope.newDeck.cards = doubles;
            MyDecksService.add($scope.newDeck);
            $scope.dialogInit();
        }

        function dialogInit() {
            $scope.createDeck = false;
            $scope.newCard = { name: '' };
            $scope.newDeck = { name: '', hero: '', cards: []};
        }

        function editDeck(deck) {
            $scope.newCard = { name: '' };
            $scope.newDeck = { name: deck.name, hero: deck.hero, cards: []};
            $scope.createDeck = true;

            for (var key in deck.cards) {
                var card = CardsService.searchCardOfId(deck.cards[key]);
                var idx = $scope.newDeck.cards.indexOf(card);
                if (idx == -1) {
                    $scope.newDeck.cards.push(card);
                }
                idx = $scope.newDeck.cards.indexOf(card);
                $scope.newDeck.cards[idx].count = (idx == -1 ? 1 : 2);
            }
        }

        function removeDeck(deck) {
            MyDecksService.remove(deck);
        }
    }]);

    // FILTER.
    angular.module('app').filter('fitlerCardsByName', ['CardsService', function (CardsService) {

        return function(cardName) {
            var result = CardsService.searchCardOfName(cardName);
            return result === null ? '' : result.name;
        };
    }]);

})();
