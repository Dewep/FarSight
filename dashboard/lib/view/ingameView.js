'use strict';

// Loads React lib to create the View
var React = require('react');

// Create React class with the root section element
var GameInfo = React.createClass({
    // Data required to render the view
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

        // Create React element corresponding to all predictions
        for (var i = 0; i < predictions.length; i++) {
            // 1st prediction format:
            // Opponent prediction: <span><b>Prediction Percentage%</b></span>
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
            // All other predictions are normal format:
            // <span>Prediction Percentage%</span>
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

// Render function of React
// Creates an HTML tree with tags corresponding to the elements
return (
    React.createElement('section', { className: 'my-list' },
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

// Create React class with the root div element
var Content = React.createClass({
    // Data required to render the view
    propTypes: {
        game_info: React.PropTypes.object.isRequired
    },

    render: function() {
        // Create React root div containing GameInfo section
        return (
            React.createElement('div', {},
                React.createElement(GameInfo, this.props.game_info)
            )
        );
    }
});

// Module.exports is the object returned when we require("THIS_FILE")
module.exports.generate = function generate(model) {
    // Map the model data to the React root class
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
