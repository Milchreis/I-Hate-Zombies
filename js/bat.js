var zombiegame = zombiegame || {};

zombiegame.Bat = function(game) {

  this.game = game;


  this.sprite = game.add.sprite(100, 10, 'bat');
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

  this.sprite.body.gravity.y = 30;

  // set up frames for animation
  this.flyAnimation = this.sprite.animations.add(
    'fly', [0, 1], 8, true);

  this.sprite.animations.play('fly');

  this.sprite.body.velocity.x = 5
}

zombiegame.Bat.prototype.update = function() {
  if(this.sprite.body.touching.down) {
     this.sprite.body.velocity.y = -100
  }
}

zombiegame.Bat.prototype.die = function() {

}