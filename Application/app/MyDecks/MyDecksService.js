// Description: Angular MyDecksService service (Management of user decks)
// Author: Julien

(function () {

    var fs = require('fs'); // Library to Read/Write files
    var decks = require("data/my_decks.json"); // We store User decks in a local JSON file

    angular.module('app').service('MyDecksService', function () {

        var myDecks = decks;

        // Save the array myDecks into the JSON storage file
        this.save = function() {
            fs.writeFile(__dirname+ "/data/my_decks.json", JSON.stringify(myDecks, ['id', 'name', 'hero', 'cards'], 2), function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log('The file was saved!');
            });
        };

        // Add newDeck to the user deck list
        this.add = function(newDeck) {
            newDeck.id = 1 + Math.max.apply(Math, myDecks.map(function(v) { return v.id; })); // Max id + 1
            myDecks.push(newDeck);
            this.save();
        };

        // Remove deckToRemoved to the user deck list
        this.remove = function(deckToRemoved) {
            for (var i = 0; i < myDecks.length; i++) {
                if (myDecks[i]["id"] === deckToRemoved["id"]) {
                    myDecks.splice(i, 1);
                }
            }
            this.save();
        };

        // Get all the user decks in good format
        this.getAll = function() {
            var data = myDecks;
            for (var deck in data) {
                data[deck]["cards_object"] = {};
                for (var card in data[deck]["cards"]) {
                    var card_id = data[deck]["cards"][card];
                    if (data[deck]["cards_object"][card_id]) {
                        data[deck]["cards_object"][card_id]++;
                    } else {
                        data[deck]["cards_object"][card_id] = 1;
                    }
                }
            }
            return data;
        };
    });

})();
