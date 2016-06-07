(function () {

    'use strict';

    var cards = require("./data/cards.json");

    angular.module('app').service('DeckService', function () {

        var cardsList = cards;

        this.searchCardOfName = function (cardName) {
            if (cardName.length === 0)
                return null;

            for (var key in cardsList)
                if (cardsList[key].collectible === true &&
                    cardsList[key].name.toLocaleLowerCase().substring(0, cardName.length) ==
                    cardName.toLocaleLowerCase().substring(0, cardName.length))
                    return cardsList[key];

            return null;
        };
    });

})();
