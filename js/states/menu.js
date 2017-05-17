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
      'Score: ' + parseInt(this.game.model.score.score),
      16
    );
    this.scoreText.nextBlink = 1000;

    this.startText = this.game.add.bitmapText(
      this.game.width / 2,
      this.game.height / 2,
      'font1', 'PRESS TO START', 32);
    this.startText.anchor.setTo(0.5, 0.5);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    // overlay for a better look
    this.game.add.sprite(0, 0, 'overlay');

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

  checkInput: function() {
    if(this.game.input.mousePointer.isDown || this.game.input.pointer1.isDown ||
      this.cursors.right.isDown) {
      this.cursors.right.isDown = false;

      this.game.state.start("Game");
    }
  },

}
