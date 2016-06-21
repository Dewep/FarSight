var my_decks = require("data/my_decks.json");

module.exports.getAll = function getAll() {
    return my_decks;
};

module.exports.getPredictionDecks = function getPredictionDecks(hero, played_cards) {
    var decks = [];

    for (var i = 0; i < my_decks.length; i++) {
        if (my_decks[i].hero == hero) {
            var error = 0;

            for (var j = 0; j < played_cards.length; j++) {
                if (my_decks[i].cards.indexOf(played_cards[j]) == -1) {
                    error++;
                    break;
                }
            }

            if (error != played_cards.length) {
                decks.push({
                    "deck": my_decks[i],
                    "percent": 100 - (error * 100 / played_cards.length)
                });
            }
        }
    }

    decks.sort(function(a, b) {
        return b.percent - a.percent;
    });

    return decks;
};
