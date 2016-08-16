// Description: Core AI (containing all functions handling data used by the different features)
// Author: Aurelien

var classifier = require("lib/ingame/classifier"); // Classifier (Instance-Based Learning algorithm here)
var predictions = require("lib/ingame/predictions"); // Predictions plays
var my_decks = require("lib/data/my_decks"); // My Decks predictions

// Class containing all functions handling data used by the different features
var FarSightIntelligence = function () {
    this.game = {};
    this.player = {};
    this.opponent = {};

    this.player_stats = {};
    this.player_cards_deck = [];
    this.player_advices = [];
    this.opponent_stats = {};
    this.opponent_deck_predictions = [];
    this.opponent_cards_predictions = [];
};

var prototype = FarSightIntelligence.prototype;

// Update internal values (the game states and the 2 players)
prototype.updateValues = function (game, player, opponent) {
    this.game = game;
    this.player = player;
    this.opponent = opponent;

    this.player_stats = this._getPlayerStats(this.player);
    this.opponent_stats = this._getPlayerStats(this.opponent);
    this.player_cards_deck = this._getPlayerCards(this.player, this.player_stats.cards, this.player_stats.cards_exclude);
    this.opponent_deck_predictions = this._getPredictionsDeck(this.opponent, this.opponent_stats.cards);
    this.player_advices = this._getPlayerAdvices(this.opponent_deck_predictions);
    this.opponent_cards_predictions = this._getCardsPredictions(this.opponent, this.opponent_stats.cards, this.opponent_deck_predictions);
};

// Get number of cards in hand, in deck, plus their ids
prototype._getPlayerStats = function (player) {
    var stats = {
        deck: 0,
        hand: 0,
        cards: [],
        cards_exclude: []
    };

    for (var entity_id in player["cards"]) {
        var card = player["cards"][entity_id];

        if (card["zone"] == "DECK") {
            stats.deck++;
        } else if (card["zone"] == "HAND") {
            stats.hand++;
        }

        if (card["card_id"] && card["card_id"] != "GAME_005") { // GAME_005 is the coin, useless card in the prediction
            stats.cards.push(card["card_id"]);

            if (card["zone"] != "DECK") {
                stats.cards_exclude.push(card["card_id"]);
            }
        }
    }

    return stats;
};

// List of the cards in player's deck, if they provided them before playing
prototype._getPlayerCards = function (player, cards, cards_exclude) {
    var player_cards_deck = [];

    var predictions_player = my_decks.getPredictionDecks(player.hero, cards);

    // If percent > 70, there is a high chance that it is the well deck
    if (predictions_player.length && predictions_player[0]["percent"] > 70) {
        var cards_deck = {};
        var cards_collection = predictions_player[0]["deck"]["cards"];

        // Find cards not already played
        for (var card in cards_collection) {
            var index = cards_exclude.indexOf(cards_collection[card]);

            if (index >= 0) {
                cards_exclude[index] = "-";
            } else if (cards_deck[cards_collection[card]]) {
                cards_deck[cards_collection[card]]++;
            } else {
                cards_deck[cards_collection[card]] = 1;
            }
        }

        // Add them to the array
        for (card in cards_deck) {
            player_cards_deck.push({
                "card_id": card,
                "number": cards_deck[card]
            });
        }
    }

    return player_cards_deck;
};

// Get data related to deck prediction (advice, percentage of deck resemblance)
prototype._getPredictionsDeck = function (player, cards) {
    var predictions_results = [];
    var predictions_decks = classifier.classify(player.hero, cards); // Classify the deck (with the Instance-Based Learning algorithm here)

    // We only take the 3 best ones (they are sorted, then there are the 3 first)
    for (var i = 0; i < 3 && i < predictions_decks.length; i++) {
        predictions_results.push({
            "deck_id": predictions_decks[i]["deck"]["deck_id"],
            "hero": predictions_decks[i]["deck"]["hero"],
            "name": predictions_decks[i]["deck"]["name"],
            "advices": predictions_decks[i]["deck"]["advices"],
            "percent": predictions_decks[i]["rate"]
        });
    }

    return predictions_results;
};

// Get messages to display in the advices section
prototype._getPlayerAdvices = function (deck_predictions) {
    var advices = [];

    if (deck_predictions.length) {
        // Get list of the advice linked to the deck
        for (var advice in deck_predictions[0]["advices"]) {
            advices.push({
                "message": deck_predictions[0]["advices"][advice]
            });
        }
    }

    return advices;
};

// List of the cards that could get played by opponent next turn
prototype._getCardsPredictions = function (player, cards, deck_predictions) {
    var cards_predictions = [];

    if (deck_predictions.length) {
        // Get predictions plays using the deck predicted, the cards already played, and the mana of the player available
        var predictions_plays = predictions.get_predictions_plays(deck_predictions[0]["deck_id"], cards, player.mana + 1);

        // Get the 5 bests one (5 first bcz there are sorted)
        for (var i = 0; i < 5 && i < predictions_plays.length; i++) {
            cards_predictions.push({
                "card_id": predictions_plays[i]["card_id"],
                "percent": predictions_plays[i]["rate"]
            });
        }
    }

    return cards_predictions;
};

// Information Getters
prototype.getPlayerCardsHandSize = function () { return this.player_stats.hand; };
prototype.getPlayerCardsDeckSize = function () { return this.player_stats.deck; };
prototype.getPlayerCardsDeck = function () { return this.player_cards_deck; };
prototype.getPlayerAdvices = function () { return this.player_advices; };
prototype.getOpponentCardsHandSize = function () { return this.opponent_stats.hand; };
prototype.getOpponentCardsDeckSize = function () { return this.opponent_stats.deck; };
prototype.getOpponentCardsPlayed = function () { return this.opponent_stats.cards; };
prototype.getOpponentDeckPredictions = function () { return this.opponent_deck_predictions; };
prototype.getOpponentCardsPredictions = function () { return this.opponent_cards_predictions; };


module.exports = FarSightIntelligence;
