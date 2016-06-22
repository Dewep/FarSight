from hearthstone.hslog import LogWatcher
from hearthstone.hslog.entities import Entity, Card
from hearthstone.enums import Zone, GameTag, PlayState
import fileinput
import json
import sys


class LogWatcherStream(LogWatcher):
    def __init__(self):
        super().__init__()
        self.game = None
        self.player1 = None
        self.player1_cards_id = []
        self.player2 = None
        self.player2_cards_id = []
        self.init = False

    def block_end(self, ts):
        action = super().block_end(ts)
        self.on_action(action)

    def format_game(self, game):
        return {"id": game.id}

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
        return {"id": player.player_id, "name": player.name, "hero": hero, "mana": mana}

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
        return {"id": card.id, "card_id": card.card_id, "zone": zones[card.zone]}

    def write(self, **kwargs):
        print(json.dumps(kwargs))

    def on_entity_update(self, entity):
        if self.init:
            if entity.id in self.player1_cards_id:
                self.write(type="card", player_id=self.player1.player_id, card=self.format_card(entity))
            if entity.id in self.player2_cards_id:
                self.write(type="card", player_id=self.player2.player_id, card=self.format_card(entity))

    def is_real_card(self, card):
        if not isinstance(card, Card):
            return False
        if card.zone == Zone.SETASIDE:
            return False
        return card.card_id == None or card.type.craftable

    def on_action(self, action):
        #print("action", action)
        if not self.init:
            self.init = True
            self.write(type="game_ready", game=self.format_game(self.game), player1=self.format_player(self.player1), player2=self.format_player(self.player2))
            for card in self.player1.entities:
                if self.is_real_card(card):
                    self.player1_cards_id.append(card.id)
                    self.write(type="card", player_id=self.player1.player_id, card=self.format_card(card))
            for card in self.player2.entities:
                if self.is_real_card(card):
                    self.player2_cards_id.append(card.id)
                    self.write(type="card", player_id=self.player2.player_id, card=self.format_card(card))

    def on_metadata(self, metadata):
        pass
        #print("metadata", metadata)

    def on_tag_change(self, entity, tag, value):
        if self.game and isinstance(entity, Entity):
            if entity.id in self.player1_cards_id:
                self.write(type="card", player_id=self.player1.player_id, card=self.format_card(entity))
            if entity.id in self.player2_cards_id:
                self.write(type="card", player_id=self.player2.player_id, card=self.format_card(entity))
            if entity.id in [self.player1.id, self.player2.id] and tag == "RESOURCES":
                self.write(type="player", player=self.format_player(entity))
            if self.game.id == entity.id and tag == "STATE" and value == "COMPLETE":
                won = self.player2
                lost = self.player1
                if GameTag.PLAYSTATE in self.player1.tags and self.player1.tags[GameTag.PLAYSTATE] == PlayState.WON:
                    won = self.player1
                    lost = self.player2
                self.write(type="game_end", game=self.format_game(self.game), won=self.format_player(won), lost=self.format_player(lost))
                self.game = None
                self.player1 = None
                self.player2 = None
                self.player1_cards_id = []
                self.player2_cards_id = []
                self.init = False
        pass
        #print("tag_change", entity, tag, value)

    def on_zone_change(self, entity, before, after):
        pass
        #print("zone_change", entity, before, after)

    def on_game_ready(self, game, *players):
        self.game = game
        self.player1 = players[0]
        self.player2 = players[1]
        self.init = False


watcher = LogWatcherStream()

for line in sys.stdin:
    try:
        watcher.read_line(line)
    except Exception as e:
        print(str(e), file=sys.stderr)
