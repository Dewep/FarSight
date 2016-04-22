(function () {

    'use strict';

    var cards = require("./data/cards.json");

    angular.module('app.filter').filter('hs_data', [function(){
        return function(card_id, key) {
            if (cards[card_id] !== undefined && cards[card_id][key] !== undefined) {
                return cards[card_id][key] || "?";
            }

            return cards[card_id] || "?";
        };
    }]);

})();
