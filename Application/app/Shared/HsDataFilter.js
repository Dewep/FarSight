// Description: Angular hsData filter (get information of a card)
// Usage: {{ card_id | hsData: "name" }} {{ card_id | hsData: "cost" }} ...
// Author: Aurelien

(function () {

    var cards = require("data/cards.json"); // All cards definitions

    // Angular filter
    angular.module('app').filter('hsData', [function(){
        return function(card_id, key) {
            if (cards[card_id] !== undefined && cards[card_id][key] !== undefined) {
                return cards[card_id][key];
            }

            return "?";
        };
    }]);

})();
