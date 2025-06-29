let gfx, seed, imagePlacer;
let grid = [];
let nextGrid = [];
let currentlyLoadedImage;
let simulationToCanvasRatioX, simulationToCanvasRatioY;

const startupParameters = {
  xSize: 600,
  ySize: 600,
  resizeCanvas: function() {
    let canvas = createCanvas(startupParameters.xSize, startupParameters.ySize);
    canvas.mousePressed(() => {
      options.isSimulationRunning = false;
    });

    canvas.mouseReleased(() => {
      options.isSimulationRunning = true;
    });
  },
  resizeSimulation: function() {
    options.pixelamountX = options.newPixelAmountX;
    options.pixelamountY = options.newPixelAmountY;
    gfx = createGraphics(options.pixelamountX, options.pixelamountY);
    imagePlacer = createGraphics(options.pixelamountX, options.pixelamountY);
    gfx.background(options.background);
    options.restart();
  }
}

const options = {
  background: '#080f62',
  foreground: '#56c6ff',
  pixelamountX: 300,
  pixelamountY: 300,
  newPixelAmountX: 300,
  newPixelAmountY: 300,
  diffusionRateA: 1.0,
  diffusionRateB: 0.5,
  feedRate: 0.055,
  killRate: 0.062,
  influence: [0.05, 0.2, 0.05, 0.2, -1, 0.2, 0.05, 0.2, 0.05],
  timeMultiplier: 1.0,
  brushSize: 20,
  isSimulationRunning: true,
  additive: true,
  imageThreshold: 0.5,
  useImageStencil: false,
  restart: function () {
    seed = Math.random() * 100000;
    reset();
    randomSeed(seed);
    gfx.reset();
    gfx.background(options.background);
  },
  save: function () {
    saveCanvas(`reaction-diffusion_${new Date().getFullYear()}_seed-${seed}_date-${Date.now()}`, 'png');
  },
  loadImage: function() {
    document.getElementById('fileselector').click();
  }
}

// Creating a GUI with options.
let gui = new dat.GUI({name: 'Customization'});
let startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 200);
startupParameterFolder.add(startupParameters, 'ySize', 200);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
let folder1 = gui.addFolder('Setup options');
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.add(options, 'brushSize').step(1).min(1);
folder1.add(options, 'isSimulationRunning').listen();
folder1.add(options, 'additive').listen();
folder1.add(options, 'loadImage');
folder1.add(options, 'imageThreshold').onChange(updateCurrentlyLoadedImage);
folder1.add(options, 'useImageStencil').listen();
folder1.open();

let folder2 = gui.addFolder('simulation options');
// folder2.add(options, 'timeMultiplier').step(0.01).min(0.01);
folder2.add(options, 'diffusionRateA').step(0.001).min(0.001).max(1.0);
folder2.add(options, 'diffusionRateB').step(0.001).min(0.001).max(1.0);
for (let i = 0; i < options.influence.length; i++) {
  folder2.add(options.influence, i).step(0.001).min(0.001).max(1.0).name(`influence ${i + 1}`);
}
folder2.add(options, 'feedRate').step(0.001).min(0.001).max(0.1);
folder2.add(options, 'killRate').step(0.001).min(0.001).max(0.1);

let folder3 = gui.addFolder('Canvas options');
folder3.add(options, 'newPixelAmountX', 100).step(1);
folder3.add(options, 'newPixelAmountY', 100).step(1);
folder3.add(startupParameters, 'resizeSimulation');

gui.remember(options);
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  startupParameters.resizeSimulation();
  options.restart();
  pixelDensity(1);
}

function draw() {
  background(options.background);
  handleMousePressed();
  if (options.isSimulationRunning) {
    generateNextFrame();
    swapGrid();
  }
  drawGrid();
  image(gfx, 0, 0, startupParameters.xSize, startupParameters.ySize);

  if (options.useImageStencil) {
    simulationToCanvasRatioX
    image(imagePlacer, mouseX, mouseY, imagePlacer.width / simulationToCanvasRatioX, imagePlacer.height / simulationToCanvasRatioY);
  }
}

function onFileSelected() {
  const input = document.getElementById('fileselector');
  const files = input.files;
  for (const file of files) {
    loadImage(URL.createObjectURL(file), onImageLoaded);
  };
}

function onImageLoaded(image) {
  console.log('Image loaded:', image);
  const resizedImage = resizeImage(image);
  console.log('Resized image:', resizedImage);
  currentlyLoadedImage = resizedImage;
  // now do stuff
  // imagePlacer.clear();
  // imagePlacer.image(image, 0, 0, options.pixelamountX, options.pixelamountY);
  options.useImageStencil = true;
  // gfx.image(image, 0, 0, startupParameters.xSize, startupParameters.ySize);
  updateCurrentlyLoadedImage();
}

function updateCurrentlyLoadedImage() {
  console.log('updateCurrentlyLoadedImage');
  // this will be broken if canvas size is changed after image loading
  
  imagePlacer = createGraphics(currentlyLoadedImage.width, currentlyLoadedImage.height);
  imagePlacer.image(currentlyLoadedImage, 0, 0, currentlyLoadedImage.width, currentlyLoadedImage.height);
  imagePlacer.filter(THRESHOLD, options.imageThreshold);
}

function resizeImage(img) {
  if (img.width > options.pixelamountX || img.height > options.pixelamountY) {
    // todo this is not working yet
    return image(img, 0, 0, options.pixelamountX, options.pixelamountY, 0, 0, img.width, img.height, constrain);
  }

  return img;
}

function handleMousePressed() {
  if (mouseIsPressed) {
    drawAtMousePosition();
  }
}

function mouseClicked() {
  drawAtMousePosition();
}

function drawAtMousePosition() {
  if (options.useImageStencil) {
    addImage();
  }
  else {
    addDrops(mouseX, mouseY);
  }
}

function addDrops(x, y) {
  const mouseXMin = Math.floor(x * simulationToCanvasRatioX) - Math.floor(options.brushSize / 2);
  const mouseYMin = Math.floor(y * simulationToCanvasRatioY) - Math.floor(options.brushSize / 2);

  for (let x = mouseXMin; x < mouseXMin + Math.floor(options.brushSize); x++) {
    for (let y = mouseYMin; y < mouseYMin + Math.floor(options.brushSize); y++) {
      if (x >= 0 && x < options.pixelamountX && y >= 0 && y < options.pixelamountY) {
        if (options.additive) {
          grid[x][y].b = 1;
          grid[x][y].a = 0;
        } else {
          grid[x][y].b = 0;
          grid[x][y].a = 1;
        }
      }
    }
  }
}

function addImage() {
  const scaledMouseX = Math.floor(mouseX * simulationToCanvasRatioX);
  const scaledMouseY = Math.floor(mouseY * simulationToCanvasRatioY);
  
  imagePlacer.loadPixels();
  for (let x = 0; x < options.pixelamountX; x++) {
    for (let y = 0; y < options.pixelamountY; y++) {
      if (x >= scaledMouseX && x < scaledMouseX + imagePlacer.width) {
        if (y >= scaledMouseY && y < scaledMouseY + imagePlacer.height) {
          const imagePixelIndex = (x - scaledMouseX + (y - scaledMouseY) * imagePlacer.width) * 4;
          const isBlack = imagePlacer.pixels[imagePixelIndex] < 128;
        
          if (options.additive) {
            grid[x][y].b = isBlack ? 1 : 0;
            grid[x][y].a = isBlack ? 0 : 1;
          } else {
            grid[x][y].b = isBlack ? 0 : 1;
            grid[x][y].a = isBlack ? 1 : 0;
          }
        }
      }
    }
  }
}

function drawGrid() {
  // const currentTime = millis();
  gfx.loadPixels();
  
  const drawColor = color(options.foreground);
  const redColor = red(drawColor);
  const greenColor = green(drawColor);
  const blueColor = blue(drawColor);
    
  for (let x = 0; x < options.pixelamountX; x++) {
    for (let y = 0; y < options.pixelamountY; y++) {
      const pixelIndex = (x + y * options.pixelamountX) * 4;
      gfx.pixels[pixelIndex + 0] = floor(redColor);
      gfx.pixels[pixelIndex + 1] = floor(greenColor);
      gfx.pixels[pixelIndex + 2] = floor(blueColor);
      gfx.pixels[pixelIndex + 3] = 255 * grid[x][y].b;
    }
  }

  gfx.updatePixels();
  // console.log('Frame time:', millis() - currentTime);
}

function generateNextFrame() {
  for (let x = 1; x < options.pixelamountX - 1; x++) {
    for (let y = 1; y < options.pixelamountY - 1; y++) {
      const a = grid[x][y].a;
      const b = grid[x][y].b;
      nextGrid[x][y].a = a + ((options.diffusionRateA * laplaceA(x, y)) - (a * b * b) + (options.feedRate * (1 - a))) * options.timeMultiplier;
      nextGrid[x][y].b = b + ((options.diffusionRateB * laplaceB(x, y)) + (a * b * b) - ((options.killRate + options.feedRate) * b)) * options.timeMultiplier;
    }
  }
}

function laplaceA(x, y) {
  let sumA = 0;
  
  sumA += grid[x-1][y-1].a * options.influence[0]; // Top-left
  sumA += grid[x][y-1].a * options.influence[1]; // Top
  sumA += grid[x+1][y-1].a * options.influence[2]; // Top-right
  sumA += grid[x-1][y].a * options.influence[3]; // Left
  sumA += grid[x][y].a * options.influence[4]; // Center
  sumA += grid[x+1][y].a * options.influence[5]; // Right
  sumA += grid[x-1][y+1].a * options.influence[6]; // Bottom-left
  sumA += grid[x][y+1].a * options.influence[7]; // Bottom
  sumA += grid[x+1][y+1].a * options.influence[8]; // Bottom-right
  return sumA;
}

function laplaceB(x, y) {
  let sumB = 0;
  
  sumB += grid[x-1][y-1].b * options.influence[0]; // Top-left
  sumB += grid[x][y-1].b * options.influence[1]; // Top
  sumB += grid[x+1][y-1].b * options.influence[2]; // Top-right
  sumB += grid[x-1][y].b * options.influence[3]; // Left
  sumB += grid[x][y].b * options.influence[4]; // Center
  sumB += grid[x+1][y].b * options.influence[5]; // Right
  sumB += grid[x-1][y+1].b * options.influence[6]; // Bottom-left
  sumB += grid[x][y+1].b * options.influence[7]; // Bottom
  sumB += grid[x+1][y+1].b * options.influence[8]; // Bottom-right
  return sumB;
}

function swapGrid() {
  [grid, nextGrid] = [nextGrid, grid];
}

function reset() {
  console.log(`Resetting grid with seed: ${seed}`);
  
  for (let x = 0; x < options.pixelamountX; x++) {
    grid[x] = [];
    nextGrid[x] = [];

    for (let y = 0; y < options.pixelamountY; y++) {
      grid[x][y] = { a: 1, b: 0 };
      nextGrid[x][y] = { a: 1, b: 0 };
    }
  }

  const middleStartX = Math.floor(options.pixelamountX / 2) - Math.floor(options.brushSize / 2);
  const middleStartY = Math.floor(options.pixelamountY / 2) - Math.floor(options.brushSize / 2);

  for (let x = middleStartX; x < middleStartX + options.brushSize; x++) {
    for (let y = middleStartY; y < middleStartY + options.brushSize; y++) {
      grid[x][y].b = 1;
    }
  }

  simulationToCanvasRatioX = (options.pixelamountX / startupParameters.xSize);
  simulationToCanvasRatioY = (options.pixelamountY / startupParameters.ySize);
}