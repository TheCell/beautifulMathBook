let Particle = function(canvas, position) {
    // this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.constK = random(.1, .1); // k != 0 how fast the circle straightens
    this.constA = random(1, 5); // a > 0; how close to absolute center does it start
    // this.constA = 1; // a > 0; how close to absolute center does it start
    this.constRadiant = random(Math.PI / 20);
    this.angleRadiant = random(Math.PI * 2);
    this.position = createVector(0, 0);
    this.previousPos = createVector(0, 0);

    this.refPoint = position.copy();
    this.lifespan = random(10, 255);
    this.canvas = canvas;
}
  
Particle.prototype.run = function() {
    this.update();
    this.display();
}

Particle.prototype.update = function(){
    this.previousPos = this.position.copy();
    this.position.x = this.constA * Math.pow(Math.E, this.constK * this.angleRadiant) * Math.cos(this.angleRadiant);
    this.position.y = this.constA * Math.pow(Math.E, this.constK * this.angleRadiant) * Math.sin(this.angleRadiant);
    this.angleRadiant += this.constRadiant;
    this.refPoint.add(this.velocity);
    this.lifespan -= 1;
  };
  
Particle.prototype.display = function() {
    this.canvas.push();
    this.canvas.stroke(options.foreground);
    this.canvas.translate(this.refPoint.x, this.refPoint.y);
    this.canvas.line(this.previousPos.x, this.previousPos.y, this.position.x, this.position.y);
    this.canvas.pop();
};

Particle.prototype.isDead = function() {
    return this.lifespan < 0;
};