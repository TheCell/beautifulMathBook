let gfx;
const xSize = 400;
const ySize = 400;
const options = {
  starterNumber: 100,
  saturation: 0.25,
  vibrance: 0.95,
  useSeedForArc: true,
  background: '#212121',
  foreground: '#ffae23',
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    f(options.starterNumber);
  },
  save: function () {
    saveCanvas('Genuary21_' + Date.now(), 'png');
  }
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.add(options, 'starterNumber', 1, 300);
folder1.add(options, 'saturation', 0, 1);
folder1.add(options, 'vibrance', 0, 1);
folder1.add(options, 'useSeedForArc');
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  createCanvas(xSize, ySize);
  gfx = createGraphics(xSize, ySize)
  gfx.background(options.background);
  options.restart();
}

function draw() {
  image(gfx, 0, 0);
}

function f(x) { 
  drawCircle(gfx, x);
  if (x < 1) {
    return;
  }
  f(1 * x / 4); 
  f(2 * x / 4); 
  f(3 * x / 4);
}

function drawCircle(graphics, seed) {
  const x = random(0, xSize);
  const y = random(0, ySize);
  const color = getRandomColor(options.saturation, options.vibrance);
  
  graphics.fill(color.r, color.g, color.b);
  graphics.noStroke();
  if (options.useSeedForArc) {
    graphics.arc(x, y, 20, 20, 0, random(0, seed % (Math.PI * 2)), CHORD);
  } else {
    graphics.arc(x, y, 20, 20, 0, Math.PI, CHORD);
  }
}