(function () {
   'use strict';

    class IngameModel {

        constructor() {
            this.player_cards_hand_size = 3;
            this.player_cards_deck_size = 6;
            
            this.player_cards_hand = [
                {"card_id": "EX1_560", "number": 1},
                {"card_id": "EX1_561", "number": 2}
            ];

            this.opponent_cards_hand_size = 4;
            this.opponent_cards_deck_size = 19;

            this.opponent_deck_prediction = [
                {"deck": "Zoo (Warlock)", "percent": 0.4},
                {"deck": "Zoo 2 (Warlock)", "percent": 0.3},
                {"deck": "Basic (Warlock)", "percent": 0.1},
                {"deck": "Reno (Warlock)", "percent": 0.05}
            ];
        }
    }

    module.exports = function () {
        return new IngameModel();
    };

}());
