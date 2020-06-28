import easygui
import os

direc=easygui.diropenbox()
for i in os.listdir():
    f = open(i, "r")
    contents = f.readlines()
    f.close()
    contents.insert(y, '<meta charset="UTF-8">')
    f = open(i, "w")
    contents = "".join(contents)
    f.write(contents)
    f.close()
