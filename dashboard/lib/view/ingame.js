'use strict';

var React = require('react');

var GameInfo = React.createClass({
    propTypes: {
        player_cards_hand_size: React.PropTypes.number.isRequired,
        player_cards_deck_size: React.PropTypes.number.isRequired,
        opponent_cards_hand_size: React.PropTypes.number.isRequired,
        opponent_cards_deck_size: React.PropTypes.number.isRequired,
        opponent_deck_prediction: React.PropTypes.array.isRequired
    },

    render: function() {
        var predictions = this.props.opponent_deck_prediction;
        var tags_predictions = [];

        for (var i = 0; i < predictions.length; i++) {
            if (i == 0) {
                tags_predictions.push(
                    React.createElement('span', {"key": predictions[i].deck + predictions[i].percent},
                        "Opponent prediction: ",
                        React.createElement('b', {},
                            predictions[i].deck + " ",
                            React.createElement('em', {}, predictions[i].percent * 100 + "%")
                        )
                    )
                );
            } else {
                tags_predictions.push(
                    React.createElement('span', {"key": predictions[i].deck + predictions[i].percent},
                        (i == 1 ? React.createElement('br') : ", "),
                        predictions[i].deck + " ",
                        React.createElement('em', {}, predictions[i].percent * 100 + "%")
                    )
                );
            }
        }

        return (
            React.createElement('section', {},
                React.createElement('h2', {}, "Current game informations"),
                React.createElement('table', {},
                    React.createElement('tbody', {},
                        React.createElement('tr', {},
                            React.createElement('th', {}, "Your hand:"),
                            React.createElement('td', {}, this.props.player_cards_hand_size),
                            React.createElement('th', {}, "Opponent hand:"),
                            React.createElement('td', {}, this.props.opponent_cards_hand_size)
                        ),
                        React.createElement('tr', {},
                            React.createElement('th', {}, "Your deck:"),
                            React.createElement('td', {}, this.props.player_cards_deck_size),
                            React.createElement('th', {}, "Opponent deck:"),
                            React.createElement('td', {}, this.props.opponent_cards_deck_size)
                        )
                    )
                ),
                React.createElement('p', {}, tags_predictions)
            )
        )
    }
});

var Advices = React.createClass({
    propTypes: {
        player_advices: React.PropTypes.array.isRequired
    },

    render: function() {
        var advices = this.props.player_advices;
        var tags_advices = [];

        for (var i = 0; i < advices.length; i++) {
            tags_advices.push(
                React.createElement('li', {"key": advices[i].id}, advices[i].advice)
            );
        }

        return (
            React.createElement('section', {},
                React.createElement('h2', {}, "Advices"),
                React.createElement('ol', {}, tags_advices)
            )
        )
    }
});

var Card = React.createClass({
    propTypes: {
        card_id: React.PropTypes.string.isRequired,
        mana: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        number: React.PropTypes.number.isRequired,
        is_percent: React.PropTypes.bool
    },

    render: function () {
        return (
            React.createElement('article', {},
                React.createElement('span', {"className": "mana"}, this.props.mana),
                React.createElement('span', {"className": "name", "style": {backgroundImage: "url('data/cards-images-bar/" + this.props.card_id + ".png')"}},
                    React.createElement('span', {}, this.props.name)
                ),
                React.createElement('span', {"className": (this.props.is_percent ? "info" : "num")}, (this.props.is_percent ? (this.props.number * 100 + "%") : this.props.number))
            )
        )
    }
});

var PredictionsPlays = React.createClass({
    propTypes: {
        opponent_plays_prediction: React.PropTypes.array.isRequired
    },

    render: function() {
        var predictions = this.props.opponent_plays_prediction;
        var tags_predictions = [];

        for (var i = 0; i < predictions.length; i++) {
            tags_predictions.push(
                React.createElement(Card, {
                    "key": predictions[i].card_id,
                    "card_id": predictions[i].card_id,
                    "mana": 5,
                    "name": predictions[i].card_id,
                    "number": predictions[i].percent,
                    "is_percent": true
                })
            );
        }

        return (
            React.createElement('section', {},
                React.createElement('h2', {}, "Prediction plays"),
                tags_predictions
            )
        )
    }
})

var PlayerDeck = React.createClass({
    propTypes: {
        player_cards_deck: React.PropTypes.array.isRequired
    },

    render: function() {
        var cards = this.props.player_cards_deck;
        var tags_cards = [];

        for (var i = 0; i < cards.length; i++) {
            tags_cards.push(
                React.createElement(Card, {
                    "key": cards[i].card_id,
                    "card_id": cards[i].card_id,
                    "mana": 5,
                    "name": cards[i].card_id,
                    "number": cards[i].number,
                    "is_percent": false
                })
            );
        }

        return (
            React.createElement('section', {},
                React.createElement('h2', {}, "Your deck"),
                tags_cards
            )
        )
    }
})

var Content = React.createClass({
    propTypes: {
        game_info: React.PropTypes.object.isRequired,
        player_advices: React.PropTypes.array.isRequired,
        opponent_plays_prediction: React.PropTypes.array.isRequired,
        player_cards_deck: React.PropTypes.array.isRequired

        /*player_cards_hand: React.PropTypes.array.isRequired,
        player_deck_prediction: React.PropTypes.array.isRequired*/
    },

    render: function() {
        return (
            React.createElement('div', {},
                React.createElement(GameInfo, this.props.game_info),
                React.createElement(Advices, {"player_advices": this.props.player_advices}),
                React.createElement(PredictionsPlays, {"opponent_plays_prediction": this.props.opponent_plays_prediction}),
                React.createElement(PlayerDeck, {"player_cards_deck": this.props.player_cards_deck})
            )
        )
    }
});

module.exports.generate = function generate(controller) {
    return React.createElement(Content, {
        "game_info": {
            "player_cards_hand_size": controller.player_cards_hand_size,
            "player_cards_deck_size": controller.player_cards_deck_size,
            "opponent_deck_prediction": controller.opponent_deck_prediction,
            "opponent_cards_hand_size": controller.opponent_cards_hand_size,
            "opponent_cards_deck_size": controller.opponent_cards_deck_size
        },
        "player_advices": controller.player_advices,
        "opponent_plays_prediction": controller.opponent_plays_prediction,
        "player_cards_deck": controller.player_cards_deck

        /*"player_deck_prediction": controller.player_deck_prediction,
        "player_cards_hand": controller.player_cards_hand*/
    });
};
