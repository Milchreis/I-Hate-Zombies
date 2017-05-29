var zombiegame = zombiegame || {};

zombiegame.Highscore = function() {

  this.score = 0;
  this._lastscore = 0;
  this.best = localStorage.getItem('score.best');
  this.blinkspeed = 1000;
  this.increaseRate = 0.01;
  this.scoreImproved = false;

  if(this.best === null) {
    this.best = 0;
  }

  this.saveScore = function() {
    if(this.score > this.best) {
      this.best = this.score;
      localStorage.setItem('score.best', this.best);
    }
    if(this.score > this._lastscore) {
      this.scoreImproved = true;
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
    this._lastscore = this.score;
    this.scoreImproved = false;
    this.score = 0;
  };
}
