import os
import easygui

direc=easygui.diropenbox()
print('''<html>
        <head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
            <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
            <style>
                .mdl-layout {
                  align-items: center;
                  justify-content: top;
                }
                .demo-card-wide.mdl-card {
                  width: 75%;
                  min-height: 45%
                }
                .demo-card-wide > .mdl-card__supporting-text {
                  height:100%;
                }
            </style>
        </head>
        <body>
          <div class="mdl-layout">
            <br><br>''')
for i in os.listdir(direc):
	print('<div class="demo-card-wide mdl-card mdl-shadow--2dp through mdl-shadow--16dp" id="music"><div class="mdl-card__supporting-text"><iframe src="'+str(i)+'"  height="100%"></iframe></div><div class="mdl-card__actions mdl-card--border"><a target="_blank" href="'+str(i)+'" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">View Article</a></div></div>')
print('''</div></body></html>''')
