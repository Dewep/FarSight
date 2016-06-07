'use strict';

var meta = require("meta_decks.json");

/*
HEROES:

"DRUID",
"HUNTER",
"MAGE",
"PALADIN",
"PRIEST",
"ROGUE",
"SHAMAN",
"WARLOCK",
"WARRIOR"
*/

// MongoDB : http://mongodb.github.io/node-mongodb-native/2.1/quick-start/
// Meta decks : http://pastebin.com/UFBmmMiP

var get_decks = function get_decks() {
    var data = {};
    for (var deck in meta["decks_properties"]) {
        data[meta["decks_properties"][deck]["id"]] = {
            "hero": meta["decks_properties"][deck]["hero"].toUpperCase(),
            "name": meta["decks_properties"][deck]["name"]
        };
    }
    return data;
    /*return {
        0: {"hero": "PALADIN", "name": "Aggro"},
        1: {"hero": "WARLOCK", "name": "Zoo"},
        2: {"hero": "ROGUE", "name": "Meule"},
    };*/
};

var get_games = function get_games() {
    return meta["decks_instances"].slice();
    /*return [
        {"deck": 0, "cards": ["CS2_087", "CS2_087", "CS2_188", "CS2_093", "CS2_093", "AT_076", "EX1_067", "EX1_383", "EX1_008", "EX1_029"]},
        {"deck": 0, "cards": ["EX1_382", "AT_087", "CS2_097", "CS2_097", "CS2_092", "CS2_092", "CS2_093", "CS2_093", "AT_076", "EX1_067", "EX1_383"]},
        {"deck": 0, "cards": ["CS2_087", "CS2_087", "CS2_188", "EX1_008", "EX1_008", "EX1_029", "EX1_029", "GVG_057", "GVG_085", "EX1_362", "CS2_203"]},
        {"deck": 0, "cards": ["GVG_085", "EX1_362", "CS2_203", "GVG_061", "GVG_061", "AT_074", "EX1_382", "AT_087", "CS2_092", "CS2_093", "CS2_093", "AT_076"]},
        {"deck": 0, "cards": ["CS2_087", "EX1_008", "EX1_008", "EX1_029", "CS2_203", "CS2_203", "NEW1_019", "GVG_058", "AT_087", "CS2_097", "CS2_097", "AT_076", "EX1_067"]},
        {"deck": 1, "cards": ["NEW1_019", "FP1_007", "FP1_007", "CS2_061", "EX1_303", "EX1_046", "EX1_093", "EX1_093", "GVG_096", "GVG_096", "EX1_310", "FP1_030", "FP1_012", "EX1_586"]},
        {"deck": 1, "cards": ["EX1_302", "EX1_316", "EX1_308", "CS2_188", "EX1_319", "EX1_319", "EX1_029", "CS2_065", "CS2_065", "GVG_015", "LOE_023", "LOE_023", "EX1_162", "FP1_002"]},
        {"deck": 1, "cards": ["CS2_065", "GVG_015", "LOE_023", "LOE_023", "EX1_162", "FP1_002", "FP1_002", "CS2_203", "NEW1_019", "FP1_007", "FP1_007", "CS2_061", "EX1_303", "EX1_046"]},
        {"deck": 2, "cards": ["CS2_072", "CS2_072", "EX1_144", "EX1_144", "CS2_074", "CS2_074", "CS2_233", "EX1_124", "EX1_124", "BRM_007", "BRM_007", "EX1_581", "EX1_581", "NEW1_004", "NEW1_004"]},
        {"deck": 2, "cards": ["EX1_124", "EX1_124", "BRM_007", "BRM_007", "EX1_581", "EX1_581", "EX1_278", "EX1_131", "CS2_142", "EX1_129", "EX1_129", "EX1_050", "EX1_050", "FP1_009", "FP1_009"]},
        {"deck": 2, "cards": ["CS2_072", "CS2_072", "EX1_144", "EX1_144", "CS2_074", "CS2_074", "CS2_233", "EX1_124", "EX1_124", "BRM_007", "BRM_007", "EX1_581", "EX1_581", "EX1_278", "EX1_131"]},
        {"deck": 2, "cards": ["EX1_129", "EX1_129", "EX1_050", "EX1_050", "FP1_009", "FP1_009", "EX1_134", "EX1_134", "CS2_076", "GVG_069", "GVG_069", "EX1_284", "NEW1_004", "NEW1_004"]},
    ];*/
};

module.exports.get_decks = get_decks;
module.exports.get_games = get_games;
