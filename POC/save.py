#!/usr/bin/env python
# -*- coding: utf-8 -*-

from tkinter import *
import threading
import time
import os

class HSLive:
    def __init__(self, logfile):
        self.logfile = logfile
        self.log = None
        self.live = True
        self.textbox = None

    def get_cardname(self, cardname):
        try:
            return cardname.split('[')[2].split(']')[0].split('id=')[0][5:-1]
        except:
            return "*unknow_card*"

    def run(self):
        root = Tk()
        root.title('HearthStone Live')
        root.iconbitmap(default='hearthstone.ico')
        root.wm_attributes("-topmost", 1)
        self.textbox = Text(root, state='disabled', height='32', width='30', font=('Calibri', 11))
        self.textbox.grid()
        self.logger()
        root.mainloop()
        self.live = False

    def logger(self):
        self.log = open(self.logfile, "r")
        def logger_thread():
            print("yolo")
            self.update("yolo")
            tracked = []
            while self.live == True:
                where = self.log.tell()
                line = self.log.readline()
                if not line:
                    time.sleep(1)
                    self.log.seek(where)
                else:
                    if "ZoneChangeList.ProcessChanges() - id=" in line and "type=INVALID" not in line:
                        print(line.encode("utf-8"))

                    if line[-31:-1] == 'FRIENDLY DECK -> FRIENDLY HAND':
                        self.update("Draw: " + self.get_cardname(line))
                    elif line[-31:-1] == 'FRIENDLY HAND -> FRIENDLY DECK':
                        self.update("Replaced: " + self.get_cardname(line))
                    elif line[-36:-1] == 'FRIENDLY DECK -> FRIENDLY GRAVEYARD':
                        self.update("Discarded: " + self.get_cardname(line))
                    elif line[-24:-1] == '-> FRIENDLY PLAY (Hero)':
                        self.update("--Clear--")
                    elif 'FRIENDLY HAND -> FRIENDLY GRAVEYARD' in line:
                        self.update("Discarded: " + self.get_cardname(line))
                    elif line[:12] == '[Bob] legend':
                        self.update("--Match End--")
                    elif 'player=1] zone from FRIENDLY DECK -> ' in line:
                        self.update("Tracked-tmp: " + self.get_cardname(line))
                        if len(tracked) < 3:
                            tracked.append(self.get_cardname(line))
                    elif 'player=1] zone from  -> FRIENDLY HAND' in line and self.get_cardname(line) in tracked:
                        self.update("Tracked: " + self.get_cardname(line))
                        tracked.remove(self.get_cardname(line))
                        self.update("Discarded: " + tracked[0])
                        self.update("Discarded: " + tracked[1])
                        tracked = []
        threading.Thread(target=logger_thread).start()


if __name__ == '__main__':
    hs = HSLive("C:\Program Files (x86)\Hearthstone\Hearthstone_Data\output_log.txt")
    hs.run()
