'use strict';

var decks = require("lib/data/decks");

var get_proba_classes = function get_proba_classes() {
    var entries = decks.get_games();
    var proba_classes = {};
    for (var game in entries) {
        if (proba_classes[entries[game]["deck"]]) {
            proba_classes[entries[game]["deck"]] += 1;
        } else {
            proba_classes[entries[game]["deck"]] = 1;
        }
    }
    for (var proba in proba_classes) {
        proba_classes[proba] = proba_classes[proba] / entries.length;
    }
    return proba_classes;
};

var naive_bayes = function naive_bayes(hero, cards) {
    var decks_properties = decks.get_decks();
    var entries = decks.get_games();
    var proba_classes = get_proba_classes();
    var classes = [];
    var total_rate = 0;

    for (var deck in proba_classes) {
        var value = proba_classes[deck];
        if (decks_properties[deck]["hero"] == hero) {
            for (var card in cards) {
                var number = 0;
                var total = 0;
                for (var game in entries) {
                    if (entries[game]["deck"] == deck) {
                        total++;
                        for (var entry_card in entries[game]["cards"]) {
                            if (entries[game]["cards"][entry_card] == cards[card]) {
                                number++;
                                break;
                            }
                        }
                    }
                }
                if (number == 0) {
                    value *= 1 / entries.length;
                } else {
                    value *= number / total;
                }
            }
            total_rate += value;
            classes.push({"deck": decks_properties[deck], "rate": value});
        }
    }

    for (var class_ in classes) {
        classes[class_]["rate"] = classes[class_]["rate"] / total_rate;
    }

    classes.sort(function(a, b) {
        return b["rate"] - a["rate"];
    });

    return classes;
};

module.exports.classify = naive_bayes;
