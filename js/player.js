var zombiegame = zombiegame || {};

zombiegame.Player = function(game) {

  this.game = game;

  this.isDead = false;

  this.sprite = game.add.sprite(32, 100, 'player');
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

  this.sprite.body.gravity.y = 500;
  this.jumpStrange = 300;

  // set up frames for animation
  this.shootAnimation = this.sprite.animations.add(
    'shooting', [9, 10, 11], 15, false);

  this.runAnimation = this.sprite.animations.add(
    'right', [1, 2, 3, 4, 5, 6, 7, 8], 20, true);

  this.jumpAnimation = this.sprite.animations.add(
    'jump', [13, 13, 13, 13, 13], 20, false);

  this.sprite.animations.play('right');

  this.jumpAnimation.onComplete.add(function(sprite) {
    if(sprite.body.touching.down) {
      sprite.animations.play('right');
    } else {
      sprite.animations.play('jump');
    }
  });

  this.shootAnimation.onComplete.add(function(sprite) {
    sprite.animations.play('right');
  });

  this.weapon = new zombiegame.Weapon(game);

  this.deadSound = this.game.add.audio('deadSound', 0.8);
}

zombiegame.Player.prototype.jump = function() {
  if(this.sprite.body.touching.down) {
    this.sprite.body.velocity.y = -this.jumpStrange;
  }
}

zombiegame.Player.prototype.releaseJump = function() {
  if(this.sprite.body.velocity.y < 0) {
    this.sprite.body.velocity.y = 0;
  }
}

zombiegame.Player.prototype.shoot = function() {
    this.weapon.onShoot(this.sprite);
}

zombiegame.Player.prototype.update = function() {
  this.weapon.update();

  if(!this.sprite.body.touching.down) {
    this.sprite.animations.play('jump');
  }
}

zombiegame.Player.prototype.die = function() {
  this.isDead = true;
  this.sprite.kill();
  zombiegame.rungame.bloodEmitter.at(this.sprite);
  zombiegame.rungame.bloodEmitter.start(true, 2000, null, 50);
  this.sprite.visible = false;
  this.deadSound.play();
}
