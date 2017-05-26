var zombiegame = zombiegame || {};

zombiegame.Highscore = function() {

  this.score = 0;
  this.best = localStorage.getItem('score.best');
  this.blinkspeed = 1000;
  this.increaseRate = 0.01;

  if(this.best === undefined) {
    this.best = 0;
  }

  this.saveScore = function() {
    if(this.score > this.best) {
      this.best = this.score;
      localStorage.setItem('score.best', this.best);
    }
  };

  this.getScore = function() {
    return(parseInt(this.score));
  };

  this.getBest = function() {
    return(parseInt(this.best));
  };

  this.update = function() {
    this.score += this.increaseRate;
  };

  this.reset = function() {
    this.score = 0;
  };
}
