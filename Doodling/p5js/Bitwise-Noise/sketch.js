let gfx;
let currentlyDrawn = 0;
const startupParameters = {
  xSize: 600,
  ySize: 600,
  maxPixelCount: 600,
  fullydrawn: false,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
    startupParameters.maxPixelCount = startupParameters.xSize * startupParameters.ySize * 4;
  }
}

const operations = {
  AND: false,
  OR: false,
  XOR: true,
  ZeroFillLeft: false,
  ZeroFillRight: false,
  SignedRight: false
}

const options = {
  background: '#d0f8ee',
  foreground: '#09c2f0',
  drawLinesPerFrame: 27,
  ModuleNumber: 5,
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    startupParameters.fullydrawn = false;
    currentlyDrawn = 0;
  },
  save: function () {
    saveCanvas('Bitwise-Noise_' + Date.now(), 'png');
  }
}


// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 200);
startupParameterFolder.add(startupParameters, 'ySize', 200);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.add(options, 'drawLinesPerFrame', 1, startupParameters.ySize, 1);
folder1.add(options, 'ModuleNumber').step(1).min(1);
folder1.open();
var folder2 = gui.addFolder('Operations');
folder2.add(operations, 'AND').listen().onChange(function() { setChecked('AND') });
folder2.add(operations, 'OR').listen().onChange(function() { setChecked('OR') });
folder2.add(operations, 'XOR').listen().onChange(function() { setChecked('XOR') });
folder2.add(operations, 'ZeroFillLeft').listen().onChange(function() { setChecked('ZeroFillLeft') });
folder2.add(operations, 'ZeroFillRight').listen().onChange(function() { setChecked('ZeroFillRight') });
folder2.add(operations, 'SignedRight').listen().onChange(function() { setChecked('SignedRight') });
folder2.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setChecked(prop) {
  for (let param in operations) {
    operations[param] = false;
  }

  operations[prop] = true;
}

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  if (!startupParameters.fullydrawn)
  {
    redrawBits();
  }

  image(gfx, 0, 0);
}

function redrawBits() {
  const amountOfPixelsToDraw = startupParameters.xSize * options.drawLinesPerFrame * 4;

  console.log(operations);
  gfx.loadPixels();
  for (let i = currentlyDrawn; i < ((currentlyDrawn + amountOfPixelsToDraw) || startupParameters.maxPixelCount); i += 4) {
    let currentX = i % startupParameters.xSize;
    let currentY = (i / startupParameters.ySize);

    let draw = 0;
    if(operations.AND) {
      draw = ((currentX & currentY) % options.ModuleNumber);
    }
    if(operations.OR) {
      draw = ((currentX | currentY) % options.ModuleNumber);
    }
    if(operations.XOR) {
      draw = ((currentX ^ currentY) % options.ModuleNumber);
    }
    if(operations.ZeroFillLeft) {
      draw = ((currentX << currentY) % options.ModuleNumber);
    }
    if(operations.ZeroFillRight) {
      draw = ((currentX >>> currentY) % options.ModuleNumber);
    }
    if(operations.SignedRight) {
      draw = ((currentX >> currentY) % options.ModuleNumber);
    }

    let color = options.background;
    if (draw) {
      color = options.foreground;
    }
    gfx.pixels[i] = red(color);
    gfx.pixels[i + 1] = green(color);
    gfx.pixels[i + 2] = blue(color);
    gfx.pixels[i + 3] = alpha(color);
  }

  currentlyDrawn += amountOfPixelsToDraw;
  if (currentlyDrawn >= startupParameters.maxPixelCount)
  {
    startupParameters.fullydrawn = true;
  }
  gfx.updatePixels();
}