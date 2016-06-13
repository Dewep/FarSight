(function () {

    'use strict';

    var fs = require('fs');
    var cards = require("./data/cards.json");

    angular.module('app').service('CardsService', function () {

        var cardsList = cards;

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

        this.searchCardOfId = function (cardId) {
            for (var key in cardsList)
                if (cardsList[key].collectible === true &&
                    cardsList[key].id == cardId)
                    return cardsList[key];
            return null;
        };
    });

})();
