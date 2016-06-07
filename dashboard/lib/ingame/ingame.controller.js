(function () {

    'use strict';

    var watcher = require("log/watcher");
    var classifier = require("ingame/classifier");
    var my_decks = require("data/my_decks");

    angular.module('app').controller('IngameCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        var game = {};
        var player = {};
        var opponent = {};
        var timeout_update = null;
        var waiting_update = 0;

        $scope.game_state = false;

        $scope.player_cards_hand_size = 0;
        $scope.player_cards_deck_size = 0;

        $scope.opponent_cards_hand_size = 0;
        $scope.opponent_cards_deck_size = 0;

        $scope.opponent_deck_prediction = [
            /*{"deck": "Zoo (Warlock)", "percent": 0.4},
            {"deck": "Zoo 2 (Warlock)", "percent": 0.3},
            {"deck": "Basic (Warlock)", "percent": 0.1},
            {"deck": "Reno (Warlock)", "percent": 0.05}*/
        ];

        $scope.player_advices = [
            /*{"message": "Do that."},
            {"message": "Next that."},
            {"message": "And that."}*/
        ];

        $scope.opponent_plays_prediction = [
            /*{"card_id": "EX1_560", "percent": 0.4},
            {"card_id": "EX1_561", "percent": 0.2},
            {"card_id": "EX1_562", "percent": 0.2}*/
        ];

        $scope.player_cards_deck = [
            /*{"card_id": "EX1_563", "number": 1},
            {"card_id": "EX1_564", "number": 2},
            {"card_id": "EX1_565", "number": 2},
            {"card_id": "EX1_567", "number": 1}*/
        ];

        var updateScope = function updateScope() {
            $timeout(function () {
                console.info("updateScope");

                waiting_update = 0;

                $scope.game_state = game["state"];

                var entity_id = 0;
                var deck = 0;
                var hand = 0;
                var cards = [];
                var cards_exclude = [];
                for (entity_id in player["cards"]) {
                    var card = player["cards"][entity_id];
                    if (card["zone"] == "DECK") {
                        deck++;
                    } else if (card["zone"] == "HAND") {
                        hand++;
                    }
                    if (card["card_id"]) {
                        cards.push(card["card_id"]);
                        if (card["zone"] != "DECK") {
                            cards_exclude.push(card["card_id"]);
                        }
                    }
                }
                $scope.player_cards_hand_size = hand;
                $scope.player_cards_deck_size = deck;

                $scope.player_cards_deck = [];
                var cards_deck = {};
                var predictions_player = my_decks.getPredictionDecks(player["hero"], cards);
                if (predictions_player.length && predictions_player[0]["percent"] > 70) {
                    var cards_collection = predictions_player[0]["deck"]["cards"];
                    for (var card in cards_collection) {
                        var index = cards_exclude.indexOf(cards_collection[card]);
                        if (index >= 0) {
                            cards_exclude[index] = "-";
                        } else {
                            if (cards_deck[cards_collection[card]]) {
                                cards_deck[cards_collection[card]]++;
                            } else {
                                cards_deck[cards_collection[card]] = 1;
                            }
                        }
                    }
                    for (card in cards_deck) {
                        $scope.player_cards_deck.push({
                            "card_id": card,
                            "number": cards_deck[card]
                        });
                    }
                }

                deck = 0;
                hand = 0;
                var cards = [];
                for (entity_id in opponent["cards"]) {
                    var card = opponent["cards"][entity_id];
                    if (card["zone"] == "DECK") {
                        deck++;
                    } else if (card["zone"] == "HAND") {
                        hand++;
                    }
                    if (card["card_id"]) {
                        cards.push(card["card_id"]);
                    }
                }
                $scope.opponent_cards_hand_size = hand;
                $scope.opponent_cards_deck_size = deck;

                $scope.opponent_deck_prediction = [];
                var predictions_opponent = classifier.classify(opponent["hero"], cards);
                var total_rate = 0;
                for (var i = 0; i < predictions_opponent.length; i++) {
                    total_rate += predictions_opponent[i]["rate"];
                }
                //console.log(predictions_opponent, total_rate);
                for (var i = 0; i < 3 && i < predictions_opponent.length; i++) {
                    $scope.opponent_deck_prediction.push({
                        "hero": predictions_opponent[i]["deck"]["hero"],
                        "name": predictions_opponent[i]["deck"]["name"],
                        "percent": predictions_opponent[i]["rate"] / total_rate
                    });
                }
            });
        };

        watcher.Handler(function(data) {
            if (data["type"] == "game_ready") {
                game = data["game"];
                player = data["player1"];
                opponent = data["player2"];
                game["state"] = true;
                player["cards"] = {};
                opponent["cards"] = {};
            } else if (data["type"] == "card") {
                game["state"] = true;
                var player_target = null;
                if (data["player_id"] == player["id"]) {
                    player_target = player;
                } else if (data["player_id"] == opponent["id"]) {
                    player_target = opponent;
                }
                if (player_target) {
                    player_target["cards"][data["card"]["id"]] = {
                        "card_id": data["card"]["card_id"],
                        "zone": data["card"]["zone"]
                    };
                }
            } else if (data["type"] == "game_end") {
                game["state"] = false;
            }

            /*clearTimeout(timeout_update);
            waiting_update++;
            if (waiting_update > 1000) {
                waiting_update = 0;
                updateScope();
            } else {
                //timeout_update = setTimeout(updateScope, 300);
            }*/
        });

        setInterval(updateScope, 1000);

    }]);

})();
