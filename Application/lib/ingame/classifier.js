// Description: Deck classifier (with the Instance-Based Learning algorithm)
// Author: Aurelien

var decks = require("lib/data/decks"); // All cards definitions

// Get decks probabilities (which are the decks the more played)
var get_proba_classes = function get_proba_classes() {
    var entries = decks.get_games(); // List of games/instances
    var proba_classes = {};

    for (var game in entries) {
        if (proba_classes[entries[game]["deck"]]) {
            proba_classes[entries[game]["deck"]] += 1;
        } else {
            proba_classes[entries[game]["deck"]] = 1;
        }
    }

    // Compute probabilities
    for (var proba in proba_classes) {
        proba_classes[proba] = proba_classes[proba] / entries.length;
    }

    return proba_classes;
};

// Instance-Based Learning algorithm
var instance_based_learning = function instance_based_learning(hero, cards) {
    var decks_properties = decks.get_decks(); // List of decks
    var entries = decks.get_games(); // List of games/instances
    var proba_classes = get_proba_classes(); // Decks probabilities (which are the decks the more played)
    var classes = [];
    var total_rate = 0; // Rate of all decks available

    // Browse every deck available
    for (var deck in proba_classes) {
        if (decks_properties[deck]["hero"] == hero) { // If it is the same hero (between deck saved and deck played)
            var value = proba_classes[deck]; // Probability of this deck

            for (var card in cards) { // Foreach card played
                var number = 0; // Number of same card
                var total = 0; // Number of same deck

                for (var game in entries) {
                    if (entries[game]["deck"] == deck) { // Get all instances saved of this deck
                        total++;

                        for (var entry_card in entries[game]["cards"]) {
                            if (entries[game]["cards"][entry_card] == cards[card]) { // If this card were played during this game
                                number++;
                                break;
                            }
                        }
                    }
                }

                // Update probability
                if (number == 0) { // If the card has not been played, multiplied by a small number rather than 0
                    value *= 1 / entries.length;
                } else {
                    value *= number / total;
                }
            }

            // Update the total rate
            total_rate += value;

            // Add this deck with his temporary score
            classes.push({
                "deck": decks_properties[deck],
                "rate": value
            });
        }
    }

    // Compute real rate (percentage) of each deck, using the total rate
    for (var class_ in classes) {
        classes[class_]["rate"] = classes[class_]["rate"] / total_rate;
    }

    // Sort the results by best rate
    classes.sort(function(a, b) {
        return b["rate"] - a["rate"];
    });

    return classes;
};

// Set the classification function to: Instance-Based Learning
module.exports.classify = instance_based_learning;
