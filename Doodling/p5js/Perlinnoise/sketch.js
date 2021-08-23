let gfx;
let noiseDrawn = false;

const startupParameters = {
  xSize: 600,
  ySize: 600,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  }
}
const options = {
  background: '#278de2',
  foreground: '#9bf9fc',
  noiseSeed: 1,
  noiseScale: 100,
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    noiseDrawn = false;
    noiseSeed(options.noiseSeed);
  },
  save: function () {
    saveCanvas('Perlinnoise_' + Date.now(), 'png');
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
folder1.add(options, 'noiseSeed').step(1).listen();
folder1.add(options, 'noiseScale').min(1).max(200).step(1);
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  options.noiseSeed = Math.round(Math.random() * 1000);
  console.log(options.noiseSeed);
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  if (!noiseDrawn) {
    noiseMap();
    noiseDrawn = true;
  }
  image(gfx, 0, 0);
}

function noiseMap() {
  let background = color(options.background);
  let foreground = color(options.foreground);

  gfx.loadPixels();
  for (let y = 0; y < startupParameters.ySize; y++) {
    for (let x = 0; x < startupParameters.xSize; x++) {
      const noiseValue = noise(x / options.noiseScale, y / options.noiseScale);
      const currentColor = lerpColor(background, foreground, noiseValue);

      gfx.pixels[((y * startupParameters.xSize + x) * 4)] = red(currentColor);
      gfx.pixels[((y * startupParameters.xSize + x) * 4) + 1] = green(currentColor);
      gfx.pixels[((y * startupParameters.xSize + x) * 4) + 2] = blue(currentColor);
      gfx.pixels[((y * startupParameters.xSize + x) * 4) + 3] = alpha(currentColor);
    }
  }
  
  gfx.updatePixels();
}