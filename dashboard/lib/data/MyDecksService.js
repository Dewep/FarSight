(function () {

    'use strict';

    var fs = require('fs');
    var decks = require("lib/my_decks.json");

    angular.module('app').service('MyDecksService', function () {

        var myDecks = decks;

        this.addDeck = function(newDeck) {
            newDeck.id = 1 + Math.max.apply(Math, myDecks.map(function(v) { return v.id; })); // Max id + 1
            myDecks.push(newDeck);

            fs.writeFile(__dirname+ "/lib/my_decks.json", JSON.stringify(myDecks, ['id', 'name', 'hero', 'cards'], 2), function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log('The file was saved!');
            });
        };

        this.getAll = function() {
            return myDecks;
        };
    });

})();
