(function () {

    'use strict';

    var watcher = require("log/watcher");

    angular.module('app').controller('IngameCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        /*window.refresh_ingame = function refresh_ingame(new_value) {
            $timeout(function () {
                $scope.player_cards_hand_size = new_value;
            });
        };*/

        var game = {};
        var player = {};
        var opponent = {};

        $scope.player_cards_hand_size = 3;
        $scope.player_cards_deck_size = 6;

        $scope.opponent_cards_hand_size = 4;
        $scope.opponent_cards_deck_size = 19;

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

        /*$scope.player_cards_hand = [
            {"card_id": "EX1_560", "number": 1},
            {"card_id": "EX1_561", "number": 2}
        ];*/

        /*$scope.player_deck_prediction = [
            {"deck": "Zoo (Warlock)", "percent": 0.9},
            {"deck": "Basic (Warlock)", "percent": 0.1}
        ];*/

        watcher.Handler(function(data) {
            $timeout(function () {
                console.log(game, player, opponent);
                if (data["type"] == "game_ready") {
                    game = data["game"];
                    player = data["player1"];
                    opponent = data["player2"];
                    game["state"] = true;
                    player["cards"] = {};
                    opponent["cards"] = {};
                } else if (data["type"] == "card") {
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

                var entity_id = 0;
                var deck = 0;
                var hand = 0;
                $scope.player_cards_deck = [];
                for (entity_id in player["cards"]) {
                    var card = player["cards"][entity_id];
                    if (card["zone"] == "DECK") {
                        deck++;
                    } else if (card["zone"] == "HAND") {
                        hand++;
                    }
                    if (card["card_id"]) {
                        $scope.player_cards_deck.push({"card_id": card["card_id"], "number": 1});
                    }
                }
                $scope.player_cards_hand_size = hand;
                $scope.player_cards_deck_size = deck;

                deck = 0;
                hand = 0;
                $scope.opponent_plays_prediction = [];
                for (entity_id in opponent["cards"]) {
                    var card = opponent["cards"][entity_id];
                    if (card["zone"] == "DECK") {
                        deck++;
                    } else if (card["zone"] == "HAND") {
                        hand++;
                    }
                    if (card["card_id"]) {
                        $scope.opponent_plays_prediction.push({"card_id": card["card_id"], "percent": 0.1});
                    }
                }
                $scope.opponent_cards_hand_size = hand;
                $scope.opponent_cards_deck_size = deck;
            });
        });

    }]);

})();
