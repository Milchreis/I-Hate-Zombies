I Hate Zombies
==============

![alt text](http://milchreis.github.io/I-Hate-Zombies/assets/images/logo.png "Logo")

A simple HTML5 platformer game. Shoot, jump and stay alive. This project was build to trying out the [phaser](http://phaser.io/ "phaser js") javascript library for 2D games. The small result is here out now.


## Controls and Game ##

The controls are very simple. Use the `RIGHT` button for _shooting_ and _starting_ the game and the `UP` button (or `SPACEBAR`) for _jumping_ around. The goal of the game is to stay alive as long as you can.


## Play it ##

The game runs good on modern browsers. Even on mobile browsers it works great. Please wait a few seconds while the game is loading by the browser (page is completely black).

**[Play it here](http://milchreis.github.io/I-Hate-Zombies/ "download-address")**


## Local execution ##

If you want to start the game on your computer you need to download the repository and start a local webserver on this machine. For example you can use the python SimpleHTTPServer as described below (Requires a installation of python).
 * Download the repository [here](https://github.com/Milchreis/I-Hate-Zombies/archive/master.zip)
 * Extract the zip file
 * Go into the extracted directory
 * Open up a terminal here (CMD or shell)
 * Start the server with: python -m SimpleHTTPServer
 * Open a browser and go to http://localhost:8000


## Thanks ##

My special thanks goes to Arne Blumentritt for the beautiful clouds, Jesse Freemann for the free human and zombie sprites and last but not least nosoapradio.us and freesound.org for the nice free sounds.


## Contributions ##

Feel free to add issues with new ideas or bugs or fork the complete game to bring in your personal style. 

## Changelog
**1.0.0**
* Complete rewrite after some experience with Javascript
* Update to the new PhaserJS-Version (2.7.7)
* Animation for player jump added
* Scale game canvas to window size
* Spacebar for jumps
* Mouse-Input: Complete left side for jumps and complete right side for shooting
