var MongoClient = require('mongodb');
var mongo_url = 'mongodb://ks.dewep.net:27017/FarSight';

var decks_properties = {};
var decks_instances = [];
var deck_next_id = -1;

var collectionGet = function collectionGet(db, collection_name, callback) {
    var collection = db.collection(collection_name);
    collection.find({}).toArray(function(err, docs) {
        callback(docs);
    });
};

var collectionInsertMany = function collectionInsertMany(db, collection_name, docs, callback) {
    var collection = db.collection(collection_name);
    collection.insertMany(docs, function(err, result) {
        if (err) {
            console.warn(err);
        } else {
            console.info("Inserted", result.result.n, "document(s) into the collection", collection_name);
        }
        callback(result);
    });
};

var mongoConnection = function mongoConnection(url, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.warn(err);
        } else {
            console.info("Connected succesfully to the server MongoDB.");
        }
        callback(db);
    });
};

var addFormatedProperty = function addFormatedProperty(property) {
    if (property["deck_id"] >= deck_next_id) {
        deck_next_id = property["deck_id"] + 1;
    }
    decks_properties[property["deck_id"]] = {
        "deck_id": property["deck_id"],
        "hero": property["hero"].toUpperCase(),
        "name": property["name"],
        "advices": property["advices"]
    };
};

var addFormatedInstance = function addFormatedInstance(instance) {
    decks_instances.push({
        "deck": instance["deck_id"],
        "cards": instance["cards"]
    });
};

var initDecks = function initDecks(url) {
    mongoConnection(url, function (db) {
        collectionGet(db, "decks_properties", function (properties) {
            collectionGet(db, "decks_instances", function (instances) {
                var item;
                decks_properties = {};
                decks_instances = [];
                for (item in properties) {
                    addFormatedProperty(properties[item]);
                }
                for (item in instances) {
                    addFormatedInstance(instances[item]);
                }
                db.close();
            });
        });
    });
};

var addDeck = function addDeck(url, instance, property) {
    console.info("addDeck to Mongo", instance, property);
    //return;
    mongoConnection(url, function (db) {
        collectionInsertMany(db, "decks_instances", [instance], function (result_instance) {
            addFormatedInstance(instance);
            if (property) {
                collectionInsertMany(db, "decks_properties", [property], function (result_property) {
                    addFormatedProperty(property);
                    console.info("addDeck", property, instance);
                    db.close();
                });
            } else {
                console.info("addDeck", property, instance);
                db.close();
            }
        });
    });
};

var add_new_deck = function add_new_deck(name, hero, advices, cards) {
    if (deck_next_id == -1) {
        deck_next_id = 1;
    }
    addDeck(mongo_url, {
        "deck_id": deck_next_id,
        "cards": cards
    }, {
        "deck_id": deck_next_id,
        "hero": hero,
        "name": name,
        "advices": advices
    });
    deck_next_id++;
};

var add_new_instance = function add_new_instance(deck_id, cards) {
    addDeck(mongo_url, {
        "deck_id": deck_id,
        "cards": cards
    }, null);
};

var get_decks = function get_decks() {
    return decks_properties;
};

var get_games = function get_games() {
    return decks_instances.slice();
};

var drop_database = function drop_database(done) {
    mongoConnection(mongo_url, function (db) {
        db.dropDatabase(function(err, result) {
            if (err) {
                console.warn(err);
            }
            db.close();
            done(result);
        });
    });
};


initDecks(mongo_url);

module.exports.get_decks = get_decks;
module.exports.get_games = get_games;
module.exports.add_new_deck = add_new_deck;
module.exports.add_new_instance = add_new_instance;
module.exports.save_enemy_deck = save_enemy_deck;
module.exports.drop_database = drop_database;
