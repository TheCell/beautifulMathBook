let gfx;
const lines = [];
const startupParameters = {
  xSize: 500,
  ySize: 500,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  }
}
const options = {
  numberOfLines: 50,
  splitsPerLine: 50,
  noiseLod: 2,
  noiseFalloff: 0.01,
  noiseInfluence: 0.45,
  noiseScale: 0.02,
  maxOffset: 50,
  autodraw: false,
  background: '#212121',
  foreground: '#22ff7d',
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    lines.length = 0;
    generateLines();
    drawLines(gfx);
  },
  save: function () {
    saveCanvas('Genuary24_1_' + Date.now(), 'png');
  }
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 400);
startupParameterFolder.add(startupParameters, 'ySize', 400);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
// folder1.add(options, 'minimumRadiant', 0, Math.PI * 2);
folder1.add(options, 'numberOfLines', 1);
folder1.add(options, 'splitsPerLine', 1);
folder1.add(options, 'maxOffset');
folder1.add(options, 'noiseLod', 0, 16).step(1);
folder1.add(options, 'noiseFalloff', 0, 0.5);
folder1.add(options, 'noiseInfluence', 0, 1);
folder1.add(options, 'noiseScale', 0, 0.1);
folder1.add(options, 'autodraw', false, true);
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  if (options.autodraw) {
    options.restart();
  }
  image(gfx, 0, 0);
}

function generateLines() {
  const splitLength = startupParameters.xSize / (options.splitsPerLine + 1);
  noiseDetail(options.noiseLod, options.noiseFalloff);
    for (let i = 0; i < options.numberOfLines; i++) {
    const currentHeight = (startupParameters.ySize / options.numberOfLines) * i;
    let start = createVector(0, currentHeight);
    let segments = [start];
    for (let j = 1; j <= options.splitsPerLine; j++) {
      // const noiseValue = lerp(-1, 1, noise(splitLength * j, currentHeight));
      const noiseValue = lerp(-1, 1, noise(splitLength * j * options.noiseScale, currentHeight * options.noiseScale));
      // const noiseValue = lerp(-1, 1, noise(splitLength * j * options.noiseScale, currentHeight * options.noiseScale));
      // segments.push(createVector(splitLength * j * noiseValue * options.noiseInfluence, currentHeight * noiseValue * options.noiseInfluence));
      segments.push(createVector(splitLength * j, currentHeight + options.maxOffset * noiseValue * options.noiseInfluence));
      // segments.push(createVector(splitLength * j, currentHeight));
    }

    let end = createVector(startupParameters.xSize, (startupParameters.ySize / options.numberOfLines) * i);
    segments.push(end);
    lines.push(segments);
  }
}

function drawLines(graphics) {
  graphics.noFill();
  graphics.stroke(options.foreground);
  graphics.strokeWeight(1);
  
  lines.forEach(segmentArray => {
    graphics.beginShape();
    for(let i = 0; i < segmentArray.length; i++) {
      let segmentX = segmentArray[i].x;
      let segmentY = segmentArray[i].y;
      graphics.vertex(segmentX, segmentY);
    }
    graphics.endShape();
  });
}