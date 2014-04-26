/*
 * Good to know:
 *  - Bitmap fonts: 	http://kvazars.com/littera/		(becareful with space)
 *  - Examples: 		http://gametest.mobi/phaser/examples/index.html
 *  - Documentation: 	http://gametest.mobi/phaser/docs/index.html
 * 	- font loading in 'preload()' only. otherwise is not working
 * 
 * Sounds:
 * 	- http://www.freesound.org/people/Rock%20Savage/sounds/81042/ (Blood)
 *  - http://www.nosoapradio.us/ (background)
 */


var game = new Phaser.Game(800, 400, Phaser.AUTO, '', 
	{ preload: preload, create: create, update: update, render: render });

// GAME STATES and var for the current gamestate
var MENU_STATE = 0;
var GAME_STATE = 1;
var SCORE_STATE = 2;
var gamestate = MENU_STATE;

var IHZ = function() {};
var logo;

var player;
var bullets;

var score;
var bestScore;
var scoreText;

var cursors;

var fireRate = 300;
var nextFire = 0;
var magSize = 7;
var mag = magSize;
var reloadTime = 1100;
var magBullets;

var gameOverEmitter;

var stayTimeButtons = 4000;

var zombies;
var zombieEmitter;
var zombieQueue = [];
var zombieBirthTime = 300;
var nextZombie;

var bg;

var houses;
var houseQueue = [];

var clouds;
var cloudSpeed = 10;
var cloudQueue = [];

var jumpStrange = 300;
var runSpeed = 200;
var maxHouseDistance = 100;

var shootSound;
var zombieSound;
var reloadSound;
var deadSound;
var music

function randint(a, b) {
	var prefix = 1;

	if(a < 0) {
		var n = Math.floor((Math.random()*2)+1);
		if(n == 2) {
			prefix = -1;
		}
	}

	return prefix * Math.floor((Math.random()*b)+a);
}

IHZ.Startmenu = function() {};
IHZ.Startmenu.prototype.show = function() {
	gamestate = MENU_STATE;
	runSpeed = 100;
	mag = 0;

	// scoreText.setText("PRESS TO START");

	houses.setAll('body.velocity.x', -runSpeed);

	magBullets.setAll('y', -200);

	// player.alive = false;
	player.kill();

	logo.reset((game.width / 2) - (logo.width/2), 50);

	this.nextBlink = 1000;
	this.scorePosY = scoreText.y;

	shootBtn.kill();
	jumpBtn.kill();

	var length = zombies.length-1;
	for(var i=length ;i>=0;i--) {
		zombies.remove(zombies.getAt(i));
	}

	if(bestScore != undefined) {
		scoreText.setText("BEST: " + parseInt(bestScore));
	}

	scoreText.scale.setTo(1, 1);
	// logo.body.gravity.y = 2;
	// logo.body.bounce.y = 0.2;
	// logo.body.collideWorldBounds = true;
};

IHZ.Startmenu.prototype.update = function() {

	if(game.time.now > this.nextBlink) {

		if(scoreText.y < -100) {

			// set in visible position and set up the time
			// for visible state (1500 millis stay)
			scoreText.y = this.scorePosY;
			this.nextBlink = game.time.now + 1500;
			
		} else {

			// bring the score or press text outside the screen
			// for hiding and set up the hiding time
			scoreText.y = -200;
			this.nextBlink = game.time.now + 400;
		}
	}
};

IHZ.Startmenu.prototype.checkInput = function() {
	if(game.input.mousePointer.isDown || game.input.pointer1.isDown || cursors.right.isDown) {
		cursors.right.isDown = false;
		showIngame();
	}
};


function showIngame() {
	gamestate = GAME_STATE;
	runSpeed = 200;
	mag = 7;

	resetHouses();

	var length = zombies.length-1;
	for(var i=length ;i>=0;i--) {
		zombies.remove(zombies.getAt(i));
	}

	// set up waiting time for button hiding
	stayTimeButtons = game.time.now + 4000;
	jumpBtn.reset(  50, 325);
	jumpBtn.body.gravity.y = 0;

	shootBtn.reset(600, 325);
	shootBtn.body.gravity.y = 0;

	houses.setAll('body.velocity.x', -runSpeed);
	magBullets.setAll('y', 20);

	player.alive = true;
	player.reset(32, 100, 100);

	logo.x = (game.width / 2) - (logo.width/2);
	logo.y = 50;

	logo.kill();

	// the birth of each zombie is after a specific time: init.
	nextZombie = game.time.now + zombieBirthTime;


	score = 0;
	scoreText.x = 50;
	scoreText.y = 20;
	// scoreText.scale.setTo(0.5, 0.5);
}

var showScoreTime = 3000;
var nextMenu;
function gameover() {
	// show emitting blood at the players position
	gameOverEmitter.at(player);
	gameOverEmitter.start(true, 0, null, 10);

	// stop the scrolling houses and clouds in half speed
	houses.setAll('body.velocity.x', 0);
	clouds.setAll('body.velocity.x', -cloudSpeed/2);

	if(player.alive) {
		for(var i=0; i<zombies.length; i++){
			var z = zombies.getAt(i);
			z.body.velocity.x += runSpeed;
		}
	}

	player.kill();
	X = "GameOVER";

	nextMenu = game.time.now + showScoreTime;
	gamestate = SCORE_STATE;

	if(bestScore == undefined || score > bestScore) {
		bestScore = score;
	}

	// startmenu.show();
}

function createHouse(x, y, key) {
	var house = houses.create(x, y, key);
	house.body.immovable = true;
	houseQueue.push(house);
}

function createZombie(x, y) {
	var zombie = zombies.getFirstDead();
	if(zombie == null) return;
	X = "" + zombies.length;
	zombie.reset(x, y);

	// set up frames for animation
	zombie.animations.add('right', [0,1,2,3,4,5], 5, true);
	zombie.animations.play('right');
	zombie.scale.setTo(1.5, 1.5);

	var direction = randint(-10, 10);
	zombie.body.velocity.x = -runSpeed + direction;
	zombie.body.collideWorldBounds = false;
	zombie.body.gravity.y = 10;

	if(zombie.body.velocity.x < -runSpeed) {
		// Set Anchor to the center of your sprite
		zombie.anchor.setTo(.5,.5);

		// Invert scale.x to flip left/right
		zombie.scale.x *= -1;
	}
}

function preload() {
	game.load.image('bg', 'imgs/bg.png');
	game.load.image('h1', 'imgs/h1.png');
	game.load.image('h2', 'imgs/h2.png');
	game.load.image('h3', 'imgs/h3.png');

	game.load.image('bullet', 'imgs/bullet.png');
	
	game.load.image('cloud', 'imgs/clouds.png');

	game.load.image('overlay', 'imgs/overlay.png');
	game.load.image('logo', 'imgs/logo.png');

	game.load.image('shootBtn', 'imgs/shoot.png');
	game.load.image('jumpBtn', 'imgs/jump.png');

	game.load.image('blood', 'imgs/blood.png');

	game.load.image('bullet1', 'imgs/bullet1.png');
	game.load.image('bullet2', 'imgs/bullet2.png');

	game.load.spritesheet('player', 'imgs/player.png', 34, 34);
	game.load.spritesheet('zombie', 'imgs/z1.png', 22, 30);
	// game.load.spritesheet('zombie', 'imgs/zombies.png', 34, 34);
	
	game.load.bitmapFont('font1', 'fonts/font.png', 'fonts/font.fnt');

	game.load.audio('shootSound', ['sfx/shoot.mp3', 'sfx/shoot.ogg']);
	game.load.audio('zombieSound', ['sfx/zombie.mp3', 'sfx/zombie.ogg']);
	game.load.audio('reloadSound', ['sfx/reload.mp3', 'sfx/reload.ogg']);
	game.load.audio('deadSound', ['sfx/dead.mp3', 'sfx/dead.ogg']);
	game.load.audio('music', ['sfx/music.mp3', 'sfx/music.ogg']);
}

function resetHouses() {
	houseQueue = [];
	houses.getAt(0).reset( 230, 290);
	houses.getAt(1).reset(   5, 260);
	houses.getAt(2).reset( 400, 270);
	houses.getAt(3).reset( 600, 220);
	houses.getAt(4).reset( 900, 280);
	houses.getAt(5).reset(1200, 240);

	for(var i=0; i<houses.length; i++) {
		houseQueue.push(houses.getAt(i));
	}
}

var houseCache;
function create() {

	// background
	bg = game.add.group();
	var img = game.cache.getImage('bg');

	// create background with width of the screen
	for(var i=0; i<game.width; i += img.width) {

		ground = bg.create(i, 0, 'bg');
		ground.body.immovable = true;
	}

	// clouds
	clouds = game.add.group();
	cloudQueue.push(clouds.create(-300, 20, 'cloud'));
	cloudQueue.push(clouds.create(  10, 50, 'cloud'));
	cloudQueue.push(clouds.create( 350, 80, 'cloud'));
	cloudQueue.push(clouds.create( 600, 40, 'cloud'));

	// lets move the clouds
	clouds.setAll('body.velocity.x', -cloudSpeed);

	// player
	player = game.add.sprite(32, 100, 'player');
	player.body.collideWorldBounds = true;
	player.body.gravity.y = 10;

	// set up frames for animation
	player.animations.add('shooting', [13,14,15,16,17,18,19,20], 15, true);
	player.animations.add('right', [1,2,3,4,5,6,7,8], 20, true);
	player.animations.play('right');

	// init emitting blood on gameover
	gameOverEmitter = game.add.emitter(player.x, player.y, 200);
	gameOverEmitter.makeParticles('blood');
    gameOverEmitter.gravity = 10;

	// zombies
	zombies = game.add.group();
	zombies.createMultiple(50, 'zombie');
	zombies.setAll('outOfBoundsKill', true);

	zombieEmitter = game.add.emitter(player.x, player.y, 500);
	zombieEmitter.makeParticles('blood');
    zombieEmitter.gravity = 10;

	// houses
	houses = game.add.group();
	createHouse( 230, 290, 'h2');
	createHouse(   5, 260, 'h1');
	createHouse( 400, 270, 'h1');
	createHouse( 600, 220, 'h1');
	createHouse( 900, 280, 'h2');
	createHouse(1200, 240, 'h1');

	houseCache = game.add.group();
	var h = houseCache.create(0, -1000, 'h3');
	h.body.immovable = true;

	// lets move the houses
	houses.setAll('body.velocity.x', -runSpeed);

	// Bullets
	bullets = game.add.group();
	bullets.createMultiple(50, 'bullet');
	bullets.setAll('anchor.x', 0.5);
	bullets.setAll('anchor.y', 0.5);
	bullets.setAll('outOfBoundsKill', true);
	bullets.setAll('body.velocity.x', 50);

	// magazine
	magBullets = game.add.group();
	for(var i=0; i<magSize; i++) {
		magBullets.create(600+(20*i), 20, 'bullet2');
	}

	// controls
	cursors = game.input.keyboard.createCursorKeys();
	game.input.addPointer();

	// mouse/touch detection
	shootBtn = game.add.sprite(600, 325, 'shootBtn');
	jumpBtn = game.add.sprite(  50, 325,  'jumpBtn');

	// show logo
	logo = game.add.sprite(0, -300, 'logo');

	// fonts
	scoreText = game.add.bitmapText(220, 300, 'PRESS \'RIGHT\' TO START', { font: '32px 04b_19', align: 'center' });

	// overlayer for a great look
	var overlay = game.add.sprite(0, 0, 'overlay');

	shootSound = game.add.audio('shootSound', 0.5);
	zombieSound = game.add.audio('zombieSound', 0.3);
	deadSound = game.add.audio('deadSound', 0.8);
	reloadSound = game.add.audio('reloadSound');
	music = game.add.audio('music', 1, true);

	// key, startpositon, volume, loop
	music.play('', 10, 1, true);

	// set up waiting time for button hiding
	stayTimeButtons += game.time.now

	// init score
	score = 0;
	startmenu = new IHZ.Startmenu();
	startmenu.show();
}

var startmenu;

function update() {

	if(gamestate == MENU_STATE) {
		startmenu.update();
		startmenu.checkInput();
	}

	if(gamestate == SCORE_STATE) {
		if(game.time.now > nextMenu) {
			startmenu.show();
		}
	}

 	// Collide the player with houses
	game.physics.collide(player, houses);
	game.physics.collide(player, zombies, zombieHitPlayer);
	game.physics.collide(zombies, houses);
	game.physics.collide(bullets, houses, bulletHitWall);
	game.physics.collide(bullets, zombies, zombieKill);

	// check first cloud for being outside the screen
	if(cloudQueue[0].x + cloudQueue[0].width < 0) {
		
		// get the cloud and put it on the end of the screen
		// and the data structure. There is no searching for last object
		var cloud = cloudQueue.shift();
		cloud.x = game.width+100;
		cloudQueue.push(cloud);
	}

	// check first house for being outside the screen
	if(houseQueue[0].x + houseQueue[0].width < 0) {

		// get the first house
		var house = houseQueue.shift();

		// the new placement of the house depends on the last object,
		// therefore get the last house.
		var lastHouse = houseQueue[houseQueue.length-1];

		// set up the new placement
		house.x = lastHouse.x + lastHouse.width + randint(-maxHouseDistance, maxHouseDistance);

		if(lastHouse.y < 260) {
			house.y = lastHouse.y + 20*randint(1,2);
		} else {
			house.y = lastHouse.y - 20*randint(1,2);
		}

		// put the element on the end
		houseQueue.push(house);
	}

	// check zombie for a new zombie
	if(gamestate == GAME_STATE) {

		if(game.time.now > nextZombie) {

			// it is time for a new zombie
			createZombie(game.width+200, 50);

			// set up the time for next zombie
			nextZombie = game.time.now + zombieBirthTime;
		}
	}

	// controls
	// =============================================================

	// check for click events: mark click for stop looping
	if(gamestate == GAME_STATE) {
		var checkForClick = false;
		if(game.input.mousePointer.isDown || game.input.pointer1.isDown) {

			// input is in the bottom area
			if(game.input.y > 280 && game.input.y <= game.height) {
				
				// check the click for shooting
				if(game.input.x > game.width/2 && game.input.x <= game.width) {

					// set the cursor for shooting
					cursors.right.isDown = true;

				// otherwise is was a click for jumping
				} else {

					// set the cursor for jumping
					cursors.up.isDown = true;
				}

				// a click was activated, mark it
				checkForClick = true;
			}
		}

		// check button inputs
		if(cursors.right.isDown) {

			// play shooting animation when mag is not empty
			if(mag > 0)	player.animations.play('shooting');

			// check the fire routine
			tryToFire();

		} else if(cursors.up.isDown && player.body.touching.down) {

			player.body.velocity.y = -jumpStrange;

		} else {

			player.animations.play('right');
		}
		
		if(checkForClick) {
			cursors.right.isDown = false;
			cursors.up.isDown = false;
		}
	}


	// gameplay
	// =============================================================

	// if the player is maybe dead? check for gameover if player is outside
	if(player.alive && (player.x + player.width + 10 < 0 || player.x != 32)) {
		gameover();
	}

	// set up the velocity for bullets
	// because the dynamic creation, everytime the property will set up
	bullets.setAll("body.velocity.x", 1000);

	// check reload for updating the magazine
	if(mag == 0 && game.time.now > nextFire) {
		reloadSound.play();
		mag = magSize;

		// reset all bullets in mag representation
		magBullets.setAll('body.y', 20);
		magBullets.setAll('body.velocity.y', 0);
	}

	// update magazine bullet representation
	for(var i=0; i<magSize-mag; i++) {
		var bullet = magBullets.getAt(i);
		bullet.body.velocity.y = -1000;
	}

	// if the magazine is empty but the user is pressing fire,
	// stop firing state and therefore the animation
	if(mag == 0 && cursors.right.isDown) {
		cursors.right.isDown = false;
	}

	if(gamestate == GAME_STATE) {

		// leaving button infos
		if(jumpBtn.alive) {
			if(game.time.now > stayTimeButtons) {
				jumpBtn.body.gravity.y = 10;
				stayTimeButtons += 100;
			}

			if(jumpBtn.y > game.height) jumpBtn.alive = false;
		}

		if(shootBtn.alive) {
			if(game.time.now > stayTimeButtons) {
				shootBtn.body.gravity.y = 10;
			}

			if(shootBtn.y > game.height) shootBtn.alive = false;
		}

		score += 0.01;
		scoreText.setText("SCORE: "+ parseInt(score));
	}
}

function zombieHitPlayer(player, zombie) {
	player.x = 30;
	deadSound.play();
}

function zombieKill(bullet, zombie) {
	X = zombie;
	zombieEmitter.at(zombie);
	zombieEmitter.start(true, 1000, null, 10);

	zombie.kill();
	bullet.kill();

	zombieSound.play();
}

function bulletHitWall(bullet, house) {
	bullet.kill();
}

function tryToFire() {

	// check for next shoot:
	// time to next shoot is over and bullet sprites available
	if (game.time.now > nextFire && bullets.countDead() > 0 && player.alive) {
		
		// if the magazine is not empty
		if(mag > 0) {
			// set up the next earliest moment to shoot
			nextFire = game.time.now + fireRate;
			
			// get the next possible bullet sprite
			var bullet = bullets.getFirstDead();

			// set up to player sprite
			bullet.reset(player.x+10, player.y+12);

			// decrease the shoot from magazine			
			mag--;

			// play shoot sound
			shootSound.play();

			// magazine is empty 
			if(mag == 0) {
				nextFire = game.time.now + reloadTime;
			}
		}
	}
}

var X = "";
function render() {
	var string = "FPS: " + game.time.fps + " SCORE: " + parseInt(score) + " X: " + X;
	game.debug.renderText(string, 500, 390, '#000000');
}
