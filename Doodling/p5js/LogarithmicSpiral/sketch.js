let gfx;
let system;
let spawnParticles = false;

const xSize = 400;
const ySize = 400;
const options = {
  background: '#d4d4d4',
  foreground: '#282828',
  restart: function () {
    system.reset();
    gfx.reset();
    gfx.background(options.background);
  },
 save: function () {
   saveCanvas('LogarithmicSpiral_' + Date.now(), 'png');
 } 
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  createCanvas(xSize, ySize);
  gfx = createGraphics(xSize, ySize)
  gfx.background(options.background);
  system = new ParticleSystem();
}

function draw() {
  if (spawnParticles) {
    system.addParticle();
  }
  system.run();
  image(gfx, 0, 0);
}

function mousePressed() {
  spawnParticles = true;
}

function mouseReleased() {
  spawnParticles = false;
}

let ParticleSystem = function() {
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(gfx, createVector(mouseX, mouseY)));
};

ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
          this.particles.splice(i, 1);
      }
  }
};

ParticleSystem.prototype.reset = function() {
  this.particles = [];
}