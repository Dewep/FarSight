'use strict';

var controller_ingame = require("./lib/controller/ingame");

var controller = new controller_ingame();

controller.player_cards_hand_size = 3;
controller.player_cards_deck_size = 6;

controller.player_cards_hand = [
    {"card_id": "EX1_560", "number": 1},
    {"card_id": "EX1_561", "number": 2}
];

controller.player_cards_deck = [
    {"card_id": "EX1_563", "number": 1},
    {"card_id": "EX1_564", "number": 2},
    {"card_id": "EX1_565", "number": 2},
    {"card_id": "EX1_567", "number": 1}
];

controller.player_deck_prediction = [
    {"deck": "Zoo (Warlock)", "percent": 0.9},
    {"deck": "Basic (Warlock)", "percent": 0.1}
];

controller.player_advices = [
    {"advice": "Do that.", "id": 58},
    {"advice": "Next that.", "id": 59},
    {"advice": "And that.", "id": 60}
];

controller.opponent_cards_hand_size = 4;
controller.opponent_cards_deck_size = 19;

controller.opponent_deck_prediction = [
    {"deck": "Zoo (Warlock)", "percent": 0.4},
    {"deck": "Zoo 2 (Warlock)", "percent": 0.3},
    {"deck": "Basic (Warlock)", "percent": 0.1},
    {"deck": "Reno (Warlock)", "percent": 0.05}
];

controller.opponent_plays_prediction = [
    {"card_id": "EX1_560", "percent": 0.4},
    {"card_id": "EX1_561", "percent": 0.2},
    {"card_id": "EX1_562", "percent": 0.2}
];


controller.refresh();
