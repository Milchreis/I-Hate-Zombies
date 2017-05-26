var zombiegame = zombiegame || {};

zombiegame.game = new Phaser.Game(800, 400, Phaser.AUTO, 'game', true, false);

zombiegame.game.state.add("Boot", zombiegame.boot);
zombiegame.game.state.add("Preload", zombiegame.preload);
zombiegame.game.state.add("Menu", zombiegame.menu);
zombiegame.game.state.add("Game", zombiegame.rungame);

zombiegame.game.model = {

  score: {
    /* Latest score */
    score: 0,
    /* Best score of the last runs */
    best: 0,
    /* Time in milliseconds for blinking the text */
    blinkspeed: 1000,
  },

  /* Speed for the cloud movement */
  cloudspeed: 10,

  /* Speed for the house-rotation */
  gamespeed: 130,

  /* Time in milliseconds to spawn the next zombie */
  spawntime: 1200,

  /* Handle for the background music */
  music: null,
  isMusicEnabled: true,
}

zombiegame.game.state.start("Boot");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
