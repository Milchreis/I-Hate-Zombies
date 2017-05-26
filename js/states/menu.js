var zombiegame = zombiegame || {};

zombiegame.menu = function(game) {};

zombiegame.menu.prototype = {
  preload: function() {

  },

  create: function() {

    // Show the background
    zombiegame.world.drawBackground();

    // Show the clouds
    this.clouds = zombiegame.world.createClouds();

    // Show the game logo
    this.logo = this.game.add.sprite(this.game.width / 2, (this.game.height / 2)-100, 'logo');
    this.logo.anchor.setTo(0.5, 0.5);

    this.houses = zombiegame.world.createHouse(230, 290, 'h2');
    zombiegame.world.createHouse(230, 290, 'h2', this.houses);
    zombiegame.world.createHouse(5, 260, 'h1', this.houses);
    zombiegame.world.createHouse(400, 270, 'h1', this.houses);
    zombiegame.world.createHouse(600, 220, 'h1', this.houses);
    zombiegame.world.createHouse(900, 280, 'h2', this.houses);
    zombiegame.world.createHouse(1200, 240, 'h1', this.houses);

    this.scoreText = this.game.add.bitmapText(
      30, 30,
      'font1',
      'Score: ' + this.game.model.score.getScore() + '\nBest:' + this.game.model.score.getBest(),
      16
    );
    this.scoreText.nextBlink = 1000;
    this.scoreText.visible = false;

    this.startText = this.game.add.bitmapText(
      this.game.width / 2,
      this.game.height / 2,
      'font1', 'PRESS TO START', 32);
    this.startText.anchor.setTo(0.5, 0.5);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Start button with overlay for a better look
    this.startBtn = this.game.add.button(0, 0, 'overlay', this.onStartGame, this, 2, 1, 0);

    // Button for toggle music
    this.musicBtn = this.game.add.button(700, 50, 'musicButton', this.onMusicToggle, this, 1, 1, 1);

    if(this.game.model.isMusicEnabled) {
      this.musicBtn.setFrames(1, 1, 1);
    } else {
      this.musicBtn.setFrames(0, 0, 0);
    }

    if(this.game.model.music === null) {
      this.game.model.music = this.game.add.audio('music', 0.7, true);
      this.game.model.music.play('', 10, 1, true);
    }
  },

  update: function() {

    if(this.game.time.now > this.scoreText.nextBlink) {
      this.scoreText.visible = !this.scoreText.visible;
      this.scoreText.nextBlink = this.game.time.now + 800;
    }

    this.checkInput();

    zombiegame.world.rotateClouds(this.clouds);
  },

  onMusicToggle: function() {
    zombiegame.game.model.isMusicEnabled = !zombiegame.game.model.isMusicEnabled;

    if(zombiegame.game.model.isMusicEnabled) {
      this.game.model.music.play('', 10, 1, true);
      this.musicBtn.setFrames(1, 1, 1);
    } else {
      zombiegame.game.model.music.stop();
      this.musicBtn.setFrames(0, 0, 0);
    }
  },

  onStartGame: function() {
    this.game.state.start("Game");
  },

  checkInput: function() {
    if(this.cursors.right.isDown || this.cursors.up.isDown) {
      this.cursors.right.isDown = false;
      this.onStartGame();
    }
  },

}
