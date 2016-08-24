// Description: Angular MyDecksCtrl controller (Management of user decks)
// Author: Julien

(function () {

    // CONTROLLER.
    angular.module('app').controller('MyDecksCtrl', ['$scope', 'CardsService', 'MyDecksService', function ($scope, CardsService, MyDecksService) {

        // Fetch decks
        $scope.decks = MyDecksService.getAll();

        // Assign methods to the $scope
        $scope.dialogAutocompleteSubmit = dialogAutocompleteSubmit;
        $scope.dialogDeleteCard = dialogDeleteCard;
        $scope.dialogCreateDeck = dialogCreateDeck;
        $scope.openCreateDeckPopup = openCreateDeckPopup;
        $scope.dialogInit = dialogInit;
        $scope.cloneDeck = cloneDeck;
        $scope.removeDeck = removeDeck;

        // Watch
        $scope.$watch('dialogNewDeck.cards', function(newValue) {
            $scope.dialogNewDeck.totalCards = newValue.reduce(function(a, b) {
                return a + b.count;
            }, 0);
        }, true);

        $scope.dialogInit();

        // --
        // Methods.
        // --

        // When 'New Deck' clicked
        function openCreateDeckPopup() {
            $scope.dialogInit();
        }

        // Restore new Deck popup to default fields
        function dialogInit() {
            $scope.creatingDeck = false;
            $scope.dialogNewCard = { name: '' };
            $scope.dialogNewDeck = { name: '', hero: '', cards: [], totalCards: 0};
        }

        // When 'CLONE' clicked
        // Duplicates a Deck and allows user to edit the clone
        // with the deck creation popup
        function cloneDeck(deck) {
            // Set the fields of deck creation pupop
            $scope.dialogNewCard = { name: '' };
            $scope.dialogNewDeck = { name: deck.name, hero: deck.hero, cards: [], totalCards: 0};

            // Set the deck content with the content of the one cloned
            for (var key in deck.cards) {
                console.log(deck.cards[key]);
                var card = CardsService.searchCardOfId(deck.cards[key]);
                var idx = $scope.dialogNewDeck.cards.indexOf(card);
                if (idx == -1) {
                    $scope.dialogNewDeck.cards.push(card);
                    idx = $scope.dialogNewDeck.cards.indexOf(card);
                    $scope.dialogNewDeck.cards[idx].count = 1;
                } else {
                    $scope.dialogNewDeck.cards[idx].count = 2;
                }
            }
            // Finally Display the popup
            $scope.creatingDeck = true;
        }

        // When '❌' cliked - Remove a deck
        function removeDeck(deck) {
            MyDecksService.remove(deck);
        }

        // METHODS OF NEW DECK DIALOG

        // When (in dialog) in the 'Add card' field, the user press the 'enter' Key
        // Add the card he wants to the new deck
        function dialogAutocompleteSubmit() {
            // $scope.dialogNewCard.name is the user entry
            var card = CardsService.searchCardOfName($scope.dialogNewCard.name);
            if (card === null)
                return;
            // Add card to the user newDeck if found
            var idx = $scope.dialogNewDeck.cards.indexOf(card);

            if (idx == -1) { // If card is not in the deck
                card.count = 1;
                $scope.dialogNewDeck.cards.push(card);
            } else if ($scope.dialogNewDeck.cards[idx].count == 1) {
                $scope.dialogNewDeck.cards[idx].count = 2;
                $scope.dialogNewCard = { name: '' }; // Empty the user entry
            }
        }

        // When (in dialog) '❌' clicked - user remove a card from its deck
        function dialogDeleteCard(card) {
            var idx = $scope.dialogNewDeck.cards.indexOf(card);
            if ($scope.dialogNewDeck.cards[idx].count == 2)
                $scope.dialogNewDeck.cards[idx].count = 1;
            else
                $scope.dialogNewDeck.cards.splice(idx, 1);
        }

        // When (in dialog) 'Create deck' clicked
        // Adds the freshly created deck to the deck list
        function dialogCreateDeck() {
            // If missing properties, refuse to validate the deck
            if ($scope.dialogNewDeck.hero === '' || $scope.dialogNewDeck.name === '')
                return;
            // Duplicate cards with count = 2
            var doubles = [];
            for (var key in $scope.dialogNewDeck.cards) {
                if ($scope.dialogNewDeck.cards[key].count === 2) // Duplicate card
                    doubles.push($scope.dialogNewDeck.cards[key].id);
                doubles.push($scope.dialogNewDeck.cards[key].id);
            }
            $scope.dialogNewDeck.cards = doubles;
            // Add the deck to list
            MyDecksService.add($scope.dialogNewDeck);
            // Reset popup
            $scope.dialogInit();
        }
    }]);

})();
