#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import json

if len(sys.argv) < 2:
    print("Usage: python3 searchindata.py card_id|card_name")
    sys.exit(1)

search = []
for argv in sys.argv[1:]:
    search.append(argv.lower())

cards = {}
with open("data/cards_full.json", "r", encoding="utf8") as f:
    cards = json.load(f)

def print_info(obj, key):
    prefix = " " * (18 - len(key)) + " " + key + "  =>  "
    try:
        print(prefix + str(obj[key]))
    except:
        print(prefix + "???")

def search_in_name(search, name):
    for argv in search:
        if argv not in name.lower():
            return False
    return True

for card in cards:
    if card["id"].lower() == search[0] or search_in_name(search, card["name"].lower()):
        print_info(card, "id")
        print_info(card, "name")
        print_info(card, "text")
        for key in card:
            if key not in ["id", "name", "text"]:
                print_info(card, key)
        print("----------------------------")
