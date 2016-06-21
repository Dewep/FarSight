var decks = require("lib/data/decks");
var meta = require("data/meta_decks.json");

var reset_meta = function reset_meta() {
    decks.drop_database(function () {
        var props = {};
        for (var property in meta["decks_properties"]) {
            props[meta["decks_properties"][property]["id"]] = meta["decks_properties"][property];
        }
        for (var instance in meta["decks_instances"]) {
            var p = props[meta["decks_instances"][instance]["deck"]];
            decks.add_new_deck(p["name"], p["hero"].toUpperCase(), p["advices"] || [], meta["decks_instances"][instance]["cards"]);
        }
    });
};


module.exports.reset_meta = reset_meta;
