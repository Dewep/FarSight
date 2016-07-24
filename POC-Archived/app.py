#!/usr/bin/env python
# -*- coding: utf-8 -*-

from gui import HSMLGui
from logger import HSMLLogger
# from events import HSMLZoneEvent

class HSMLApp:
    def __init__(self, logfile):
        self.logfile = logfile
        self.logger = None
        self.gui = None
        self.zones = {}

    def handle_data(self, data):
        def insert_in_zone(zone, event):
            if self.zones.get(zone, None) is None:
                self.zones[zone] = list()
            self.zones[zone].append(event)
        def delete_in_zone(zone, event):
            if self.zones.get(zone, None):
                new_zone = list()
                for e in self.zones[zone]:
                    if e.get("id") != event.get("id"):
                        new_zone.append(e)
                self.zones[zone] = new_zone
        if data.get("type") == "zone":
            delete_in_zone(data.get("from"), data)
            insert_in_zone(data.get("to"), data)
            self.update_data_gui()

    def update_data_gui(self):
        self.gui.clear()
        for zone in self.zones:
            self.gui.insert(" " + zone + ":")
            for e in self.zones[zone]:
                self.gui.insert("    - " + e.get("name"))

    def run(self):
        self.gui = HSMLGui()
        self.logger = HSMLLogger(self.logfile, self.handle_data, self.gui.is_running)
        self.logger.run()
        self.gui.run()

if __name__ == '__main__':
    # Enable "Zone" log in C:\Users\...\AppData\Local\Blizzard\Hearthstone\log.config
    # C:\Program Files (x86)\Hearthstone\Hearthstone_Data\output_log.txt
    app = HSMLApp("output_log.txt")
    app.run()
