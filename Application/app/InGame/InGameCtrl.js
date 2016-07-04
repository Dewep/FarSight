(function () {

    var watcher = require("lib/log/watcher");
    var classifier = require("lib/ingame/classifier");
    var predictions = require("lib/ingame/predictions");
    var my_decks = require("lib/data/my_decks");
    var decks = require("lib/data/decks");

    angular.module('app').controller('InGameCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        var game = {};
        var player = {};
        var opponent = {};
        var timeout_update = null;
        var waiting_update = 0;

        $scope.waiting_message = "INITIALISATION...";

        $scope.record = null;

        $scope.deck_previewed = null;
        $scope.preview_deck = function preview_deck(deck_id) {
            var decks_properties = decks.get_decks();
            $scope.deck_previewed = null;
            if (deck_id in decks_properties) {
                $scope.deck_previewed = decks_properties[deck_id];
            }
        };
        $scope.close_deck_preview = function close_deck_preview() {
            $scope.deck_previewed = null;
        };

        $scope.card_previewed = null;
        $scope.preview_card = function preview_card(card_id) {
            $scope.card_previewed = card_id;
        };
        $scope.close_card_preview = function close_card_preview() {
            $scope.card_previewed = null;
        };

        $scope.game_state = false;

        $scope.player_cards_hand_size = 0;
        $scope.player_cards_deck_size = 0;

        $scope.opponent_cards_hand_size = 0;
        $scope.opponent_cards_deck_size = 0;

        $scope.opponent_deck_prediction = [];

        $scope.player_advices = [];

        $scope.opponent_plays_prediction = [];

        $scope.player_cards_deck = [];

        var updateScope = function updateScope() {
            $timeout(function () {
                waiting_update = 0;

                $scope.waiting_message = "Waiting for a game";
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
                    if (card["card_id"] && card["card_id"] != "GAME_005") {
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
                    if (card["card_id"] && card["card_id"] != "GAME_005") {
                        cards.push(card["card_id"]);
                    }
                }
                $scope.opponent_cards_hand_size = hand;
                $scope.opponent_cards_deck_size = deck;

                $scope.opponent_deck_prediction = [];
                var predictions_opponent = classifier.classify(opponent["hero"], cards);
                for (var i = 0; i < 3 && i < predictions_opponent.length; i++) {
                    $scope.opponent_deck_prediction.push({
                        "deck_id": predictions_opponent[i]["deck"]["deck_id"],
                        "hero": predictions_opponent[i]["deck"]["hero"],
                        "name": predictions_opponent[i]["deck"]["name"],
                        "percent": predictions_opponent[i]["rate"]
                    });
                }

                $scope.player_advices = [];
                $scope.opponent_plays_prediction = [];
                if (predictions_opponent.length) {
                    for (var advice in predictions_opponent[0]["deck"]["advices"]) {
                        $scope.player_advices.push({
                            "message": predictions_opponent[0]["deck"]["advices"][advice]
                        });
                    }

                    var predictions_plays = predictions.get_predictions_plays(predictions_opponent[0]["deck"]["deck_id"], cards, opponent["mana"] + 1);
                    for (var i = 0; i < 5 && i < predictions_plays.length; i++) {
                        $scope.opponent_plays_prediction.push({
                            "card_id": predictions_plays[i]["card_id"],
                            "percent": predictions_plays[i]["rate"]
                        });
                    }
                }

                if (game["state"] == false && game["saved"] == false) {
                    game["saved"] = true;
                    if (cards.length > 10) {
                        var selected = "new";
                        var linked_decks = [];
                        var default_name = "Undefined";
                        var default_advices = "";
                        var linked_selected = null;
                        for (var i = 0; i < 5 && i < predictions_opponent.length; i++) {
                            linked_decks.push({
                                "deck_id": predictions_opponent[i]["deck"]["deck_id"],
                                "name": "[" + predictions_opponent[i]["deck"]["hero"] + "] " + predictions_opponent[i]["deck"]["name"] + " - " + Math.round(predictions_opponent[i]["rate"] * 100) + "%"
                            });
                        }
                        if (predictions_opponent.length) {
                            linked_selected = linked_decks[0];
                            if (predictions_opponent[0]["rate"] > 0.70) {
                                selected = "linked";
                            }
                            default_name = predictions_opponent[0]["deck"]["name"] + " variance";
                            default_advices = predictions_opponent[0]["deck"]["advices"].join("\n");
                        }
                        var cards_grouped = {};
                        for (var i = 0; i < cards.length; i++) {
                            if (cards_grouped[cards[i]]) {
                                cards_grouped[cards[i]]++;
                            } else {
                                cards_grouped[cards[i]] = 1;
                            }
                        }
                        $scope.record = {
                            "selected": selected,
                            "cards": cards,
                            "cards_grouped": cards_grouped,
                            "hero": opponent["hero"],
                            "linked": {
                                "decks": linked_decks,
                                "selected": linked_selected
                            },
                            "new": {
                                "name": default_name,
                                "advices": default_advices
                            }
                        };
                        console.info("End of the game, saving enemy deck...");
                        //decks.save_enemy_deck(opponent["hero"], cards, predictions_opponent);
                    } else {
                        console.info("End of the game, not saving the enemy deck (not enough cards played).");
                    }
                }
            });
        };

        $scope.record_confirm = function record_confirm() {
            if ($scope.record && $scope.record.selected == "linked" && $scope.record.linked.selected) {
                decks.add_new_instance($scope.record.linked.selected.deck_id, $scope.record.cards);
            } else if ($scope.record && $scope.record.selected == "new") {
                decks.add_new_deck($scope.record.new.name, $scope.record.hero, $scope.record.new.advices.split("\n"), $scope.record.cards);
            }
            $scope.record = null;
        };

        watcher.Handler(function(data) {
            if (data["type"] == "game_ready") {
                //console.info("Handler:game_ready");
                game = data["game"];
                player = data["player1"];
                opponent = data["player2"];
                game["state"] = true;
                game["saved"] = false;
                game["player_checked"] = false;
                player["cards"] = {};
                opponent["cards"] = {};
            } else if (data["type"] == "player") {
                var player_target = null;
                if (data["player"]["id"] == player["id"]) {
                    player_target = player;
                } else if (data["player"]["id"] == opponent["id"]) {
                    player_target = opponent;
                }
                if (player_target) {
                    player_target["hero"] = data["player"]["hero"];
                    player_target["mana"] = data["player"]["mana"];
                    player_target["name"] = data["player"]["name"];
                }
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
                if (game["player_checked"] == false && data["card"]["card_id"]) {
                    game["player_checked"] = true;
                    if (data["player_id"] == opponent["id"]) {
                        opponent = player;
                        player = player_target;
                    }
                }
            } else if (data["type"] == "game_end") {
                console.info("Handler:game_end");
                game["state"] = false;
                game["saved"] = false;
            } else if (data["type"] == "start_watch_file") {
                console.info("Handler:start_watch_file");
                if (game) {
                    game["saved"] = true;
                }
                updateScope();
                setInterval(updateScope, 1000);
            }
        });

    }]);

})();
