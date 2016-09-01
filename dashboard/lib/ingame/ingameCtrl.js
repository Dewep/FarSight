(function () {

    'use strict';

    angular.module('app').controller('IngameCtrl', function ($scope) {
        // We use $scope as a Model - contains the data accesible from the view
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
        // Write here the $scope.functions accessible from the view
    });

})();
