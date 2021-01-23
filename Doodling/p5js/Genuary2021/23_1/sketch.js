let gfx;
const xSize = 400;
const ySize = 400;
const options = {
  background: '#000000',
  c1: '#264653',
  c2: '#2a9d8f',
  c3: '#e9c46a',
  c4: '#f4a261',
  c5: '#e76f51',
  squareCountPerCall: 10,
  startsize: 50,
  rotationDivider: 16,
  autiodraw: false,
  redraw: function () {
    gfx.reset();
    gfx.background(options.background);
    drawSquares(xSize / 2, ySize / 2, options.startsize, gfx);
  },
  save: function () {
    saveCanvas('Genuary23_' + Date.now(), 'png');
  }
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.addColor(options, 'background');
folder1.addColor(options, 'c1');
folder1.addColor(options, 'c2');
folder1.addColor(options, 'c3');
folder1.addColor(options, 'c4');
folder1.addColor(options, 'c5');
folder1.add(options, 'squareCountPerCall', 1, 100);
folder1.add(options, 'startsize', 1, xSize);
folder1.add(options, 'rotationDivider', 1, 128);
folder1.add(options, 'autiodraw', false, true);
folder1.open();
gui.add(options, 'redraw');
gui.add(options, 'save');

function setup() {
  createCanvas(xSize, ySize);
  gfx = createGraphics(xSize, ySize)
  gfx.background(options.background);
  options.redraw();
}

function draw() {
  if (options.autiodraw) {
    options.redraw();
  }
  image(gfx, 0, 0);
}

function drawSquares(middleX, middleY, startsize, gfx) {
  const middlePointX = middleX - startsize / 2;
  const middlePointY = middleY - startsize / 2;
  let currentHalfSize = startsize / 2;
  let rotation = PI / options.rotationDivider;
  const colors = [options.c1, options.c2, options.c3, options.c4, options.c5];
  gfx.push();
  gfx.translate(middlePointX, middlePointY);
  gfx.noFill();
  for (let i = 0; i < options.squareCountPerCall; i++) {
    currentHalfSize = currentHalfSize * 0.9;
    gfx.stroke(random(colors));
    gfx.square(-currentHalfSize, -currentHalfSize, startsize);
    gfx.rotate(rotation);
  }
  gfx.pop();
}