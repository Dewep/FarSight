#!/usr/bin/env python
# -*- coding: utf-8 -*-

from tkinter import Tk, Text, END

class HSMLGui:
    def __init__(self):
        self.live = True
        self.root = Tk()
        self.root.title('HearthStone Machine Learning')
        self.root.iconbitmap(default='hearthstone.ico')
        self.root.wm_attributes("-topmost", 1)
        self.textbox = Text(self.root, state='disabled', height='32', width='40', font=('Calibri', 11))
        self.textbox.grid()

    def clear(self):
        self.textbox.config(state='normal')
        self.textbox.delete('1.0', END)
        self.textbox.config(state='disabled')

    def insert(self, data):
        self.textbox.config(state='normal')
        self.textbox.insert(END, (data + "\n"))
        self.textbox.see('end')
        self.textbox.config(state='disabled')

    def run(self):
        self.root.mainloop()
        self.live = False

    def is_running(self):
        return self.live
