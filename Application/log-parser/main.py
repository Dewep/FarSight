from hearthstone.hslog import LogWatcher


class MyLogWatcher(LogWatcher):
	def on_entity_update(self, entity):
		pass

	def on_action(self, action):
		pass

	def on_metadata(self, metadata):
		pass

	def on_tag_change(self, entity, tag, value):
		pass

	def on_zone_change(self, entity, before, after):
		pass

	def on_game_ready(self, game, *players):
		print("on_game_ready", game, players)


watcher = MyLogWatcher()

with open("Power.log", "r") as f:
    watcher.read(f)

for game in watcher.games:
    print(game, game.players)

    for action in game.packets:
        print(action)
