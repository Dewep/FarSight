#!/usr/bin/env python
# -*- coding: utf-8 -*-

import urllib.request
import shutil
import os
import json
from PIL import Image # pip install Pillow

FORCE_UPDATE = False

def mkdir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def download_file(url, destination):
    if FORCE_UPDATE or not os.path.exists(destination):
        print("Download " + url + " ... ", end="", flush=True)
        with urllib.request.urlopen(url) as response, open(destination, "wb") as out_file:
            shutil.copyfileobj(response, out_file)
        print("[OK]")

mkdir("data/")
download_file("https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json", "data/cards.json")

cards = {}
with open("data/cards.json", "r", encoding="utf8") as f:
    cards = json.load(f)

mkdir("data/cards-images/")
mkdir("data/cards-images-bar/")
for card in cards:
    card_id = card["id"]
    download_file("http://wow.zamimg.com/images/hearthstone/cards/enus/original/" + card_id + ".png", "data/cards-images/" + card_id + ".png")
    im = Image.open("data/cards-images/" + card_id + ".png")
    im = im.crop((70, 125, 70 + 130, 125 + 35))
    im.save("data/cards-images-bar/" + card_id + ".png", "PNG")
