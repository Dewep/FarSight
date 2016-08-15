var classifier = require("lib/ingame/classifier");
var predictions = require("lib/ingame/predictions");
var my_decks = require("lib/data/my_decks");

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

        if (card["card_id"] && card["card_id"] != "GAME_005") {
            stats.cards.push(card["card_id"]);

            if (card["zone"] != "DECK") {
                stats.cards_exclude.push(card["card_id"]);
            }
        }
    }

    return stats;
};

prototype._getPlayerCards = function (player, cards, cards_exclude) {
    var player_cards_deck = [];

    var predictions_player = my_decks.getPredictionDecks(player.hero, cards);

    if (predictions_player.length && predictions_player[0]["percent"] > 70) {
        var cards_deck = {};
        var cards_collection = predictions_player[0]["deck"]["cards"];

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

        for (card in cards_deck) {
            player_cards_deck.push({
                "card_id": card,
                "number": cards_deck[card]
            });
        }
    }

    return player_cards_deck;
};

prototype._getPredictionsDeck = function (player, cards) {
    var predictions = [];
    var predictions_decks = classifier.classify(player.hero, cards);

    for (var i = 0; i < 3 && i < predictions_decks.length; i++) {
        predictions.push({
            "deck_id": predictions_decks[i]["deck"]["deck_id"],
            "hero": predictions_decks[i]["deck"]["hero"],
            "name": predictions_decks[i]["deck"]["name"],
            "advices": predictions_decks[i]["deck"]["advices"],
            "percent": predictions_decks[i]["rate"]
        });
    }

    return predictions;
};

prototype._getPlayerAdvices = function (deck_predictions) {
    var advices = [];

    if (deck_predictions.length) {
        for (var advice in deck_predictions[0]["advices"]) {
            advices.push({
                "message": deck_predictions[0]["advices"][advice]
            });
        }
    }

    return advices;
};

prototype._getCardsPredictions = function (player, cards, deck_predictions) {
    var cards_predictions = [];

    if (deck_predictions.length) {
        var predictions_plays = predictions.get_predictions_plays(deck_predictions[0]["deck_id"], cards, player.mana + 1);

        for (var i = 0; i < 5 && i < predictions_plays.length; i++) {
            cards_predictions.push({
                "card_id": predictions_plays[i]["card_id"],
                "percent": predictions_plays[i]["rate"]
            });
        }
    }

    return cards_predictions;
};

/* Getters */
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
