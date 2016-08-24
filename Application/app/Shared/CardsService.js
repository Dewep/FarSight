// Description: Angular CardsService service
// allow to search a card in the global list of Hearthstone cards
// Author: Julien

(function () {

    var fs = require('fs');
    var cards = require("data/cards.json");

    angular.module('app').service('CardsService', function () {

        var cardsList = cards;

        // Get the Hearthstone card which the name match cardName
        this.searchCardOfName = function (cardName) {
            if (cardName.length === 0)
                return null;

            var result = null;

            for (var key in cardsList) {
                if (cardsList[key].collectible === true &&
                    cardsList[key].name.toLocaleLowerCase() == cardName.toLocaleLowerCase())
                    return cardsList[key];

                if (!result &&
                    cardsList[key].collectible === true &&
                    cardsList[key].name.toLocaleLowerCase().substring(0, cardName.length) ==
                    cardName.toLocaleLowerCase().substring(0, cardName.length))
                    result = cardsList[key];
            }

            return result;
        };

        // Get the Hearthstone card which the id match cardId
        this.searchCardOfId = function (cardId) {
            for (var key in cardsList)
                if (cardsList[key].collectible === true &&
                    cardsList[key].id == cardId)
                    return cardsList[key];
            return null;
        };
    });

})();
