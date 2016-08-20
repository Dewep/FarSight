(function () {
   'use strict';

   var controller_ingame = require("./lib/controller/ingame");

   var controller = new controller_ingame();
   // controller.model = ;
   // controller.player_cards_hand_size = 3;
   // controller.player_cards_deck_size = 6;
   //
   // controller.player_cards_hand = [
   //     {"card_id": "EX1_560", "number": 1},
   //     {"card_id": "EX1_561", "number": 2}
   // ];
   //
   // controller.opponent_cards_hand_size = 4;
   // controller.opponent_cards_deck_size = 19;
   //
   // controller.opponent_deck_prediction = [
   //     {"deck": "Zoo (Warlock)", "percent": 0.4},
   //     {"deck": "Zoo 2 (Warlock)", "percent": 0.3},
   //     {"deck": "Basic (Warlock)", "percent": 0.1},
   //     {"deck": "Reno (Warlock)", "percent": 0.05}
   // ];

   controller.refresh();

}());
