#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Description: Stream parsing HearthStone logs
# Author: Aurelien (parsing, events, format object), Florent (stream communication, JSON formatting)
# Python Version: 3.5

from hearthstone.hslog import LogWatcher # HearthSim/python-hearthstone library
from hearthstone.entities import Entity, Card # HearthSim/python-hearthstone library
from hearthstone.enums import Zone, GameTag, PlayState # HearthSim/python-hearthstone library
import fileinput
import json
import sys


# Class events library
class LogWatcherStream(LogWatcher):
    def __init__(self):
        super().__init__()
        self.game = None # Current game
        self.player1 = None # Player object 1
        self.player1_cards_id = [] # ID cards of the player 1
        self.player2 = None # Player object 2
        self.player2_cards_id = [] # ID cards of the player 2
        self.init = False # Is game init

    # Fix event error of the library
    def block_end(self, ts):
        action = super().block_end(ts)
        self.on_action(action) # Call the on_action event

    # Format game object
    def format_game(self, game):
        # id: Game ID
        return {"id": game.id}

    # Format player object
    def format_player(self, player):
        heroes = {
            "HERO_06": "DRUID",
            "HERO_05": "HUNTER",
            "HERO_08": "MAGE",
            "HERO_04": "PALADIN",
            "HERO_09": "PRIEST",
            "HERO_03": "ROGUE",
            "HERO_02": "SHAMAN",
            "HERO_07": "WARLOCK",
            "HERO_01": "WARRIOR"
        }
        hero = None
        for hero in player.heroes:
            hero = heroes[hero.card_id[:7]]
        mana = 0
        if GameTag.RESOURCES in player.tags:
            mana = player.tags[GameTag.RESOURCES]
        # id: Player ID
        # name: Player name
        # hero: Player hero (DRUID, HUNTER, ...)
        # mana: Player mana available
        return {"id": player.player_id, "name": player.name, "hero": hero, "mana": mana}

    # Format card object
    def format_card(self, card):
        zones = {
            Zone.INVALID: "INVALID",
            Zone.PLAY: "PLAY",
            Zone.DECK: "DECK",
            Zone.HAND: "HAND",
            Zone.GRAVEYARD: "GRAVEYARD",
            Zone.REMOVEDFROMGAME: "REMOVEDFROMGAME",
            Zone.SETASIDE: "SETASIDE",
            Zone.SECRET: "SECRET"
        }
        # id: Card ID (game entity)
        # card_id: HearthStone card ID
        # zone: Card zone (DECK, PLAY, ...)
        return {"id": card.id, "card_id": card.card_id, "zone": zones[card.zone]}

    # JSON serialisation + Standard IO communication
    def write(self, **kwargs):
        print(json.dumps(kwargs))

    # On entity update event
    def on_entity_update(self, entity):
        if self.init:
            # Create event 'type' if the entity ID is a card of the players
            if entity.id in self.player1_cards_id:
                self.write(type="card", player_id=self.player1.player_id, card=self.format_card(entity))
            if entity.id in self.player2_cards_id:
                self.write(type="card", player_id=self.player2.player_id, card=self.format_card(entity))

    # Check if it is a real card
    def is_real_card(self, card):
        if not isinstance(card, Card):
            return False
        if card.zone == Zone.SETASIDE:
            return False
        return card.card_id == None or card.type.craftable

    # On action event
    def on_action(self, action):
        if not self.init:
            # Create event 'game_ready'
            self.init = True
            self.write(type="game_ready", game=self.format_game(self.game), player1=self.format_player(self.player1), player2=self.format_player(self.player2))
            # Create events for each cards of the players
            for card in self.player1.entities:
                if self.is_real_card(card):
                    self.player1_cards_id.append(card.id)
                    self.write(type="card", player_id=self.player1.player_id, card=self.format_card(card))
            for card in self.player2.entities:
                if self.is_real_card(card):
                    self.player2_cards_id.append(card.id)
                    self.write(type="card", player_id=self.player2.player_id, card=self.format_card(card))

    # On tag change event
    def on_tag_change(self, entity, tag, value):
        # Check if game is created
        if self.game and isinstance(entity, Entity):
            # Create event 'card' if the entity is a card of the players
            if entity.id in self.player1_cards_id:
                self.write(type="card", player_id=self.player1.player_id, card=self.format_card(entity))
            if entity.id in self.player2_cards_id:
                self.write(type="card", player_id=self.player2.player_id, card=self.format_card(entity))
            # Create event 'player' if the mana cost has been updated
            if entity.id in [self.player1.id, self.player2.id] and tag == "RESOURCES":
                self.write(type="player", player=self.format_player(entity))
            # Create event 'game_end' if the game is now completed
            if self.game.id == entity.id and tag == "STATE" and value == "COMPLETE":
                # Determine the won player
                won = self.player2
                lost = self.player1
                if GameTag.PLAYSTATE in self.player1.tags and self.player1.tags[GameTag.PLAYSTATE] == PlayState.WON:
                    won = self.player1
                    lost = self.player2
                self.write(type="game_end", game=self.format_game(self.game), won=self.format_player(won), lost=self.format_player(lost))
                # Reset variables
                self.game = None
                self.player1 = None
                self.player2 = None
                self.player1_cards_id = []
                self.player2_cards_id = []
                self.init = False

    # On game ready event
    def on_game_ready(self, game, *players):
        self.game = game
        self.player1 = players[0]
        self.player2 = players[1]
        self.init = False


# Create instance of the watcher
watcher = LogWatcherStream()

# Read each line on stdin (HearthStone logs)
for line in sys.stdin:
    try:
        # Custom 'start_watch_file' event (not a real log line)
        if line.startswith("START_WATCH_FILE"):
            print(json.dumps({"type": "start_watch_file"}))
        else:
            watcher.read_line(line)
    except Exception as e:
        # Display each error on the stderr
        print(str(e), file=sys.stderr)
