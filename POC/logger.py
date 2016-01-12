#!/usr/bin/env python
# -*- coding: utf-8 -*-

from events import HSMLZoneEvent
import threading
import time
import codecs

class HSMLLogger:
    def __init__(self, logfile, handle_data, is_alive):
        self.logfile = logfile
        self.handle_data = handle_data
        self.is_alive = is_alive

    def run(self):
        threading.Thread(target=self.run_logger_thread).start()

    def run_logger_thread(self):
        log = codecs.open(self.logfile, "r", "utf-8")
        while self.is_alive():
            pos = log.tell()
            line = log.readline()
            if not line:
                time.sleep(1)
                log.seek(pos)
            else:
                self.parse_line(line)

    def parse_line(self, line):
        if "ZoneChangeList.ProcessChanges() - id=" in line and "type=INVALID" not in line:
            event = HSMLZoneEvent(line)
            if event.is_valid():
                self.handle_data(event)
