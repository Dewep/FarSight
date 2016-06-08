'use strict';

var decks = require("lib/data/decks");
var cards = require("data/cards.json");


var get_predictions_plays = function get_predictions_plays(deck_id, cards_played, mana_available) {
    var entries = decks.get_games();
    var cards_rates = {};
    var total_rate = 0;

    for (var game in entries) {
        if (entries[game]["deck"] == deck_id) {
            var cards_played_cp = cards_played.slice();
            for (var card in entries[game]["cards"]) {
                var card_id = entries[game]["cards"][card];
                if (cards[card_id] && cards[card_id]["cost"] !== undefined && cards[card_id]["cost"] <= mana_available) {
                    if (cards_played_cp.indexOf(card_id) == -1) {
                        total_rate++;
                        if (cards_rates[card_id]) {
                            cards_rates[card_id]++;
                        } else {
                            cards_rates[card_id] = 1;
                        }
                    } else {
                        cards_played_cp[cards_played_cp.indexOf(card_id)] = "-";
                    }
                }
            }
        }
    }

    var proba_cards = [];
    for (var card in cards_rates) {
        proba_cards.push({"card_id": card, "rate": cards_rates[card] / total_rate});
    }

    proba_cards.sort(function(a, b) {
        return b["rate"] - a["rate"];
    });

    return proba_cards;
};


module.exports.get_predictions_plays = get_predictions_plays;
