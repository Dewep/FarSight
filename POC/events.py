#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re

class HSMLZoneEvent:
    def __init__(self, line):
        self.data = {}
        self.is_parsed = self.parse(line)

    def is_valid(self):
        return self.is_parsed

    def parse(self, line):
        pattern = (r''
            '^\[Zone\] ZoneChangeList\.ProcessChanges\(\) - '
            'id=(?P<id>\d+) '
            'local=(?P<local>True|False) '
            '\['
            'name=(?P<data_name>.+) '
            'id=(?P<data_id>\d+) '
            'zone=(?P<data_zone>.+) '
            'zonePos=(?P<data_zonePos>\d+) '
            'cardId=(?P<data_cardId>.+) '
            'player=(?P<data_player>\d+)'
            '\] '
            '(?P<type>zone|pos) from '
            '(?P<from>.*) -> '
            '(?P<to>.+)\r$'
        )
        match = re.match(pattern, line)
        if match:
            self.data = {
                "change_id": match.group("id"),
                "local": match.group("local"),
                "name": match.group("data_name"),
                "id": match.group("data_id"),
                "zone": match.group("data_zone"),
                "zonePos": match.group("data_zonePos"),
                "cardId": match.group("data_cardId"),
                "player": match.group("data_player"),
                "type": match.group("type"),
                "from": match.group("from") if match.group("from") != "" else None,
                "to": match.group("to")
            }
            return True
        return False

    def get(self, key, default=None):
        return self.data.get(key, default)
