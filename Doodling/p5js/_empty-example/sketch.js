let gfx;
const xSize = 400;
const ySize = 400;
const options = {
  background: '#212121',
  foreground: '#ffae23',
  restart: function () {
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
}

function draw() {
  image(gfx, 0, 0);
}