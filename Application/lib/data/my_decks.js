var my_decks = require("data/my_decks.json"); // Cards definitions

// Get all the decks
module.exports.getAll = function getAll() {
    return my_decks;
};

// Get predicted decks, from a hero and the cards played
module.exports.getPredictionDecks = function getPredictionDecks(hero, played_cards) {
    var decks = [];

    for (var i = 0; i < my_decks.length; i++) {
        if (my_decks[i].hero == hero) { // Filter with the hero
            var bad_attributes = 0;

            // Count bad attributes
            for (var j = 0; j < played_cards.length; j++) {
                if (my_decks[i].cards.indexOf(played_cards[j]) == -1) { // Deck does not contain the card
                    bad_attributes++;
                }
            }

            if (bad_attributes != played_cards.length) {
                decks.push({
                    "deck": my_decks[i],
                    "percent": 100 - (bad_attributes * 100 / played_cards.length)
                });
            }
        }
    }

    // Sort the deck with the best predictions
    decks.sort(function(a, b) {
        return b.percent - a.percent;
    });

    return decks;
};
