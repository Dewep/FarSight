'use strict';

var view_ingame = require("../view/ingame");
var ReactDOM = require('react-dom');

class IngameController {
    constructor() {
        this.player_cards_hand_size = 0;
        this.player_cards_deck_size = 0;
        this.player_cards_hand = [];
        this.player_cards_deck = [];
        this.player_deck_prediction = [];
        this.player_advices = [];
        this.opponent_cards_hand_size = 0;
        this.opponent_cards_deck_size = 0;
        this.opponent_deck_prediction = [];
        this.opponent_plays_prediction = [];

        this.refresh();
    };

    refresh() {
        ReactDOM.render(view_ingame.generate(this), document.getElementById('content'));
    }
}

module.exports = function () {
    return new IngameController();
};
