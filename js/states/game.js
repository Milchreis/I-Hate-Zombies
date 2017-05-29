var zombiegame = zombiegame || {};

zombiegame.rungame = function(game) {
  this.zombies = null;
  this.player = null;
  this.gamespeed = null;
  this.zombieKillSound = null;
  this.buttonLock = null;
};

zombiegame.rungame.prototype = {

    preload: function() {
    },

    create: function() {
      // Setup the current gamespeed
      zombiegame.rungame.gamespeed = this.game.model.gamespeed;

      // Create the input objects
      this.cursors = this.game.input.keyboard.createCursorKeys();
      this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      // Show the backgroundzombiegame.rungame.batzombiegame.rungame.bat
      zombiegame.world.drawBackground();zombiegame.rungame.bat

      // Show the clouds
      this.clouds = zombiegame.world.createClouds();

      // Player object
      zombiegame.rungame.player = new zombiegame.Player(this.game);
      this.player = zombiegame.rungame.player

      // Bat object
      zombiegame.rungame.bat = new zombiegame.Bat(this.game);
      this.bat = zombiegame.rungame.bat

      // houses
      this.houses = zombiegame.world.createHouse(5, 260, 'h1', null, zombiegame.rungame.gamespeed);
      zombiegame.world.createHouse(230, 290, 'h2', this.houses, zombiegame.rungame.gamespeed);
      zombiegame.world.createHouse(400, 270, 'h1', this.houses, zombiegame.rungame.gamespeed);
      zombiegame.world.createHouse(600, 220, 'h1', this.houses, zombiegame.rungame.gamespeed);
      zombiegame.world.createHouse(800, 280, 'h2', this.houses, zombiegame.rungame.gamespeed);

      // Score
      this.game.model.score.reset();
      this.scoreText = this.game.add.bitmapText(30, 30,
        'font1', 'Score: ' + this.game.model.score.getScore(), 16);
      this.scoreText.anchor.setTo(0, 0);

      // Zombies
      this.zombies = zombiegame.world.createZombiePool(50);
      zombiegame.rungame.zombies = this.zombies;
      this.zombies.nextSpawnTime = 0;

      zombiegame.rungame.bloodEmitter = this.game.add.emitter(0, 0, 200);
      zombiegame.rungame.bloodEmitter.makeParticles('blood');
      zombiegame.rungame.bloodEmitter.gravity.set(0, 500);

      zombiegame.world.spawnZombie(this.zombies, 750, 200, zombiegame.rungame.gamespeed);

      // set up waiting time for button hiding
      this.helpButtonTime = this.game.time.now + 4000;
      // mouse/touch detection
      this.shootBtn = this.game.add.sprite(600, 325, 'shootBtn');
      this.game.physics.enable(this.shootBtn, Phaser.Physics.ARCADE);
      this.jumpBtn = this.game.add.sprite(50, 325, 'jumpBtn');
      this.game.physics.enable(this.jumpBtn, Phaser.Physics.ARCADE);

      // overlay for a better look
      this.game.add.sprite(0, 0, 'overlay');

      zombiegame.rungame.zombieKillSound = this.game.add.audio('zombieSound', 0.3);
    },

    update: function() {

      zombiegame.world.rotateClouds(this.clouds);
      zombiegame.world.rotateHouses(this.houses);

      // Collide the player with houses
      this.game.physics.arcade.collide(this.player.sprite, this.houses);

      // Collide the bat with houses
      this.game.physics.arcade.collide(this.bat.sprite, this.houses);

      // Collide the zombies with houses
      this.game.physics.arcade.collide(this.zombies, this.houses);

      // Collide the bullets with zombies
      this.game.physics.arcade.collide(
        this.player.weapon.bullets,
        this.zombies,
        this.onBulletZombieCollision);

      // Collide bullets with zombie and custom action
      this.game.physics.arcade.collide(
        this.player.sprite,
        this.zombies,
        this.onPlayerZombieCollision);

      // Collide bullets with walls
      this.game.physics.arcade.collide(
        this.player.weapon.bullets,
        this.houses,
        this.player.weapon.onHit);

      this.player.update();

      this.bat.update();

      // Update score until the player dies
      if(!this.player.isDead) {
        this.game.model.score.update();
        this.scoreText.setText("SCORE: " + this.game.model.score.getScore());
      }

      this.checkControls();
      this.checkZombieSpawn();
      this.checkHelpButtons();
      this.updateGameOver();

      // if the player is maybe dead? check for gameover if player is outside
      if(!this.player.isDead && this.player.sprite.x < 30) {
        this.onGameOver();
      }
    },

    onBulletZombieCollision: function(bullet, zombie) {
      zombiegame.rungame.bloodEmitter.at(zombie);
      zombiegame.rungame.bloodEmitter.start(true, 2000, null, 50);
      zombie.kill();
      bullet.kill();
      zombiegame.rungame.zombieKillSound.play();
    },

    onPlayerZombieCollision: function(playerSprite, zombie) {
      zombiegame.rungame.prototype.onGameOver();
    },

    onGameOver: function() {
      zombiegame.rungame.player.die();
      zombiegame.game.model.score.saveScore();
      zombiegame.rungame.buttonLock = zombiegame.game.time.now + 700;
    },

    updateGameOver: function() {
      if(this.player.isDead) {
        // Decrease the scrolling speed
        if(zombiegame.rungame.gamespeed > 0) {
          zombiegame.rungame.gamespeed -= 1.5;
          this.houses.setAll("body.velocity.x", -zombiegame.rungame.gamespeed, true);
          this.zombies.setAll("body.velocity.x", -zombiegame.rungame.gamespeed, true);
        }

        // Show Points
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.scoreText.fontSize = 20;
        this.scoreText.x = this.game.width/2;
        this.scoreText.y = this.game.height/2;
      }
    },

    checkZombieSpawn: function() {
      if(this.game.time.now > this.zombies.nextSpawnTime) {
        // it is time for a new zombie
        zombiegame.world.spawnZombie(
          this.zombies,
          this.game.width + 150,
          50,
          zombiegame.rungame.gamespeed);

        // set up the time for next zombie
        this.zombies.nextSpawnTime = this.game.time.now + this.game.model.spawntime;
		  }
    },

    checkControls: function() {

      if(this.player.isDead) {
        if(this.game.time.now > zombiegame.rungame.buttonLock &&
          (this.cursors.right.isDown
          || this.spacebar.isDown
          || this.cursors.up.isDown
          || this.game.input.pointer1.isDown
          || this.game.input.mousePointer.isDown)) {

          this.game.state.start("Menu");
        }

      } else {
        // Jump
        if(this.cursors.up.isDown
          || this.spacebar.isDown
          || (this.game.input.pointer1.isDown && this.game.input.pointer1.x < this.game.width/2)
          || (this.game.input.mousePointer.isDown && this.game.input.mousePointer.x < this.game.width/2)) {

            this.player.jump();
        }
        // Release Jump
        else if(this.cursors.up.isUp
          || this.spacebar.isUp
          || (this.game.input.pointer1.isUp && this.game.input.pointer1.x < this.game.width/2)
          || (this.game.input.mousePointer.isUp && this.game.input.mousePointer.x < this.game.width/2)) {

          this.player.releaseJump();
        }

        // Shoot
        if(this.cursors.right.isDown
            || (this.game.input.pointer1.isDown && this.game.input.pointer1.x > this.game.width/2)
            || (this.game.input.mousePointer.isDown && this.game.input.mousePointer.x > this.game.width/2)) {

            this.player.shoot();
        }
      }
    },

    checkHelpButtons: function() {
      if(this.jumpBtn.alive) {
        if(this.game.time.now > this.helpButtonTime) {
          this.jumpBtn.body.gravity.y = 100;
        } else if(this.jumpBtn.y > this.game.height) {
          this.jumpBtn.alive = false;
        }
      }

      if(this.shootBtn.alive) {
        if(this.game.time.now > this.helpButtonTime) {
          this.shootBtn.body.gravity.y = 100;
        } else if(this.shootBtn.y > this.game.height) {
          this.shootBtn.alive = false;
        }
      }
    },
}
