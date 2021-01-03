let gfx;
const xSize = 400;
const ySize = 400;
const CARules = {
  r111: false,
  r110: false,
  r101: false,
  r100: true,
  r011: true,
  r010: true,
  r001: true,
  r000: false,
  background: '#212121',
  foreground: '#ffae23',
  drawSpeed: 30,
  randomStart: false,
  restart: function () {
    gfx.reset();
    lineCount = 0;
    gfx.background(CARules.background);
  }
};

let gui = new dat.GUI({ name: 'Customization' });
let folder1 = gui.addFolder('Setup options');
gui.remember(CARules);
folder1.add(CARules, 'r111');
folder1.add(CARules, 'r110');
folder1.add(CARules, 'r101');
folder1.add(CARules, 'r100');
folder1.add(CARules, 'r011');
folder1.add(CARules, 'r010');
folder1.add(CARules, 'r001');
folder1.add(CARules, 'r000');
folder1.addColor(CARules, 'background');
folder1.addColor(CARules, 'foreground');
// folder1.open();
gui.add(CARules, 'randomStart');
gui.add(CARules, 'drawSpeed', 1, 60);
gui.add(CARules, 'restart');

let lineCount = 0;

function setup() {
  createCanvas(xSize, ySize);
  gfx = createGraphics(xSize, ySize)
  gfx.background(CARules.background);
}

function draw() {
  if (lineCount < gfx.height) {
    applyRulesToLine(lineCount);

    lineCount++;
  }

  image(gfx, 0, 0);
}

function applyRulesToLine(lineNr) {
  gfx.loadPixels();
  const d = gfx.pixelDensity();
  const width = gfx.width * d * 4;

  if (lineNr == 0) {
    // starting new
    if (CARules.randomStart) {
      for (let i = 0; i < width; i += 4) {
        if (Math.random() > 0.5) {
          gfx.pixels[width * lineNr + i] = red(CARules.foreground);
          gfx.pixels[width * lineNr + i + 1] = green(CARules.foreground);
          gfx.pixels[width * lineNr + i + 2] = blue(CARules.foreground);
          gfx.pixels[width * lineNr + i + 3] = alpha(CARules.foreground);
        }
      }
    } else {
      gfx.pixels[Math.round(width / 2)] = red(CARules.foreground);
      gfx.pixels[Math.round(width / 2) + 1] = green(CARules.foreground);
      gfx.pixels[Math.round(width / 2) + 2] = blue(CARules.foreground);
      gfx.pixels[Math.round(width / 2) + 3] = alpha(CARules.foreground);
    }
  } else {
    for (let i = 0; i < width; i += 4) {
      let previousLeft = 0;
      let previousMiddle = pixelIsOn(gfx.pixels, width * (lineNr - 1) + i);
      let previousRight = 0;
      if (i > 0) {
        previousLeft = pixelIsOn(gfx.pixels, width * (lineNr - 1) + i - 4);
      }
      if (i < width - 4) {
        previousRight = pixelIsOn(gfx.pixels, width * (lineNr - 1) + i + 4);
      }
      
      const shouldDraw = ruleAllowsDraw(previousLeft, previousMiddle, previousRight);
      if (shouldDraw) {
        gfx.pixels[width * lineNr + i] = red(CARules.foreground);
        gfx.pixels[width * lineNr + i + 1] = green(CARules.foreground);
        gfx.pixels[width * lineNr + i + 2] = blue(CARules.foreground);
        gfx.pixels[width * lineNr + i + 3] = alpha(CARules.foreground);
      }
    }
  }

  gfx.updatePixels();
}

function pixelIsOn(array, pixelNumber) {
  return array[pixelNumber] != red(CARules.background) 
    && array[pixelNumber + 1] != green(CARules.background) 
    && array[pixelNumber + 2] != blue(CARules.background);
}

function ruleAllowsDraw(left, middle, right) {
  let ruleName = 'r';
  ruleName += left ? 1 : 0;
  ruleName += middle ? 1 : 0;
  ruleName += right ? 1 : 0;
  
  return CARules[ruleName];
}