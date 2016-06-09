(function () {

    'use strict';

    var fs = require('fs');
    var decks = require("lib/my_decks.json");

    angular.module('app').service('MyDecksService', function () {

        var myDecks = decks;

        this.save = function() {
            fs.writeFile(__dirname+ "/lib/my_decks.json", JSON.stringify(myDecks, ['id', 'name', 'hero', 'cards'], 2), function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log('The file was saved!');
            });
        };

        this.add = function(newDeck) {
            newDeck.id = 1 + Math.max.apply(Math, myDecks.map(function(v) { return v.id; })); // Max id + 1
            myDecks.push(newDeck);
            this.save();
        };

        this.remove = function(deckToRemoved) {
            for (var i = 0; i < myDecks.length; i++) {
                if (myDecks[i]["id"] === deckToRemoved["id"]) {
                    myDecks.splice(i, 1);
                }
            }
            this.save();
        };

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
