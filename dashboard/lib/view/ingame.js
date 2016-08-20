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
            if (i === 0) {
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
        );
    }
});

var Content = React.createClass({
    propTypes: {
        game_info: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            React.createElement('div', {},
                React.createElement(GameInfo, this.props.game_info)
            )
        );
    }
});

module.exports.generate = function generate(model) {
    if (model === undefined) return;
    return React.createElement(Content, {
        "game_info": {
            "player_cards_hand_size": model.player_cards_hand_size,
            "player_cards_deck_size": model.player_cards_deck_size,
            "opponent_deck_prediction": model.opponent_deck_prediction,
            "opponent_cards_hand_size": model.opponent_cards_hand_size,
            "opponent_cards_deck_size": model.opponent_cards_deck_size
        }
    });
};
