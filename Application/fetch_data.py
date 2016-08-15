#!/usr/bin/env python
# -*- coding: utf-8 -*-

import urllib.request
import shutil
import os
import json
from PIL import Image # pip install Pillow
from requests import get # pip install requests

FORCE_UPDATE = False

def mkdir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def download_file(url, destination):
    if FORCE_UPDATE or not os.path.exists(destination):
        print("Download " + url + " ... ", end="", flush=True)
        with open(destination, "wb") as out_file:
            response = get(url)
            out_file.write(response.content)
        print("[OK]")

mkdir("data/")
download_file("https://api.hearthstonejson.com/v1/latest/enUS/cards.json", "data/cards_full.json")

cards_full = {}
with open("data/cards_full.json", "r", encoding="utf8") as f:
    cards_full = json.load(f)

mkdir("data/cards-images/")
mkdir("data/cards-images-bar/")
for card in cards_full:
    card_id = card["id"]
    download_file("http://wow.zamimg.com/images/hearthstone/cards/enus/original/" + card_id + ".png", "data/cards-images/" + card_id + ".png")
    im = Image.open("data/cards-images/" + card_id + ".png")
    im = im.crop((70, 130, 70 + 130, 130 + 24))
    im.save("data/cards-images-bar/" + card_id + ".png", "PNG")

cards = {}
for card in cards_full:
    cards[card["id"]] = {
        "id": card["id"],
        "name": card["name"],
        "playerClass": card["playerClass"] if "playerClass" in card else None,
        "race": card["race"] if "race" in card else None,
        "set": card["set"],
        "type": card["type"],
        "collectible": card["collectible"] if "collectible" in card else False,
        "cost": card["cost"] if "cost" in card else None,
        "attack": card["attack"] if "attack" in card else None,
        "health": card["health"] if "health" in card else None,
        "durability": card["durability"] if "durability" in card else None,
        "mechanics": card["mechanics"] if "mechanics" in card else [],
        "playRequirements": card["playRequirements"] if "playRequirements" in card else [],
        "entourage": card["entourage"] if "entourage" in card else []
    }

with open("data/cards.json", "w", encoding="utf8") as f:
    json.dump(cards, f)
