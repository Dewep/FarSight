(function () {

    var watcher = require("lib/log/watcher");
    var decks = require("lib/data/decks");
    var FarSightIntelligence = require("lib/ingame/ia");

    angular.module('app').controller('InGameCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        var ia = new FarSightIntelligence();
        var game = {};
        var player = {};
        var opponent = {};
        var timeout_update = null;

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
                $scope.waiting_message = "Waiting for a game";
                $scope.game_state = game["state"];

                ia.updateValues(game, player, opponent);

                $scope.player_cards_hand_size = ia.getPlayerCardsHandSize();
                $scope.player_cards_deck_size = ia.getPlayerCardsDeckSize();
                $scope.player_cards_deck = ia.getPlayerCardsDeck();

                $scope.opponent_cards_hand_size = ia.getOpponentCardsHandSize();
                $scope.opponent_cards_deck_size = ia.getOpponentCardsDeckSize();

                $scope.opponent_deck_prediction = ia.getOpponentDeckPredictions();
                $scope.player_advices = ia.getPlayerAdvices();
                $scope.opponent_plays_prediction = ia.getOpponentCardsPredictions();

                if (game["state"] == false && game["saved"] == false) {
                    game["saved"] = true;

                    var opponent_cards_played = ia.getOpponentCardsPlayed();

                    if (opponent_cards_played.length > 10) {
                        var selected = "new";
                        var linked_decks = [];
                        var default_name = "Undefined";
                        var default_advices = "";
                        var linked_selected = null;

                        var deck_predictions = ia.getOpponentDeckPredictions();

                        for (let i = 0; i < deck_predictions.length; i++) {
                            linked_decks.push({
                                "deck_id": deck_predictions[i]["deck_id"],
                                "name": "[" + deck_predictions[i]["hero"] + "] " + deck_predictions[i]["name"] + " - " + Math.round(deck_predictions[i]["percent"] * 100) + "%"
                            });
                        }

                        if (deck_predictions.length) {
                            linked_selected = linked_decks[0];
                            if (deck_predictions[0]["percent"] > 0.70) {
                                selected = "linked";
                            }
                            default_name = deck_predictions[0]["name"] + " variance";
                            default_advices = deck_predictions[0]["advices"].join("\n");
                        }

                        var cards_grouped = {};
                        for (var i = 0; i < opponent_cards_played.length; i++) {
                            if (cards_grouped[opponent_cards_played[i]]) {
                                cards_grouped[opponent_cards_played[i]]++;
                            } else {
                                cards_grouped[opponent_cards_played[i]] = 1;
                            }
                        }

                        $scope.record = {
                            "selected": selected,
                            "cards": opponent_cards_played,
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
                        // Do not save deck without confirmation while program is still in learning mode
                        // $scope.record_confirm();
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
