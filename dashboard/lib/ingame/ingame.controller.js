(function () {

    'use strict';

    var watcher = require("log/watcher");

    angular.module('app').controller('IngameCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        /*window.refresh_ingame = function refresh_ingame(new_value) {
            $timeout(function () {
                $scope.player_cards_hand_size = new_value;
            });
        };*/

        $scope.player_cards_hand_size = 3;
        $scope.player_cards_deck_size = 6;

        $scope.opponent_cards_hand_size = 4;
        $scope.opponent_cards_deck_size = 19;

        $scope.opponent_deck_prediction = [
            {"deck": "Zoo (Warlock)", "percent": 0.4},
            {"deck": "Zoo 2 (Warlock)", "percent": 0.3},
            {"deck": "Basic (Warlock)", "percent": 0.1},
            {"deck": "Reno (Warlock)", "percent": 0.05}
        ];

        $scope.player_advices = [
            {"message": "Do that."},
            {"message": "Next that."},
            {"message": "And that."}
        ];

        $scope.opponent_plays_prediction = [
            {"card_id": "EX1_560", "percent": 0.4},
            {"card_id": "EX1_561", "percent": 0.2},
            {"card_id": "EX1_562", "percent": 0.2}
        ];

        $scope.player_cards_deck = [
            {"card_id": "EX1_563", "number": 1},
            {"card_id": "EX1_564", "number": 2},
            {"card_id": "EX1_565", "number": 2},
            {"card_id": "EX1_567", "number": 1}
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
                console.log("GameWatcherData", data);
                //$scope.player_cards_hand_size = new_value;
            });
        });

    }]);

})();
