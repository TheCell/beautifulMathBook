let gfx;
let lSystemQuadrupel;
let currentIteration;
const xSize = 400;
const ySize = 400;
const options = {
  background: '#212121',
  foreground: '#ffae23',
  iterations: 7,
  turnrate: Math.PI / 10,
  lineLenght: 50,
  restart: function () {
    resetLSystemQuadrupel();
    gfx.reset();
    gfx.background(options.background);
  },
  save: function () {
    saveCanvas('Lindenmayer-System_' + Date.now(), 'png');
  }
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.add(options, 'iterations').step(1);
folder1.add(options, 'turnrate').name("Turnrate (radians)");
folder1.add(options, 'lineLenght');
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  frameRate(30);
  createCanvas(xSize, ySize);
  gfx = createGraphics(xSize, ySize)
  gfx.background(options.background);
  resetLSystemQuadrupel();
}

function draw() {
  if (currentIteration > 0)
  {
    gfx.background(options.background);
    currentIteration--;
    applyL();
    drawL(gfx);
  }
  image(gfx, 0, 0);
}

function applyL() {
  const currentWord = lSystemRules.word.split('');
  let newWord = '';
  currentWord.forEach((letter) => {
    newWord += lSystemRules.replacementRules[letter] ? lSystemRules.replacementRules[letter] : '';
  });

  lSystemRules.word = newWord;
}

function drawL(graphics) {
  graphics.push();
  graphics.translate(gfx.width / 2, gfx.height);
  const instructions = lSystemRules.word.split('');
  instructions.forEach((letter) => {
    switch(letter) {
      case 'a':
        graphics.stroke(options.foreground);
        graphics.strokeWeight(1);
        graphics.line(0, 0, 0, -options.lineLenght);
        graphics.translate(0, -options.lineLenght);
        break;
      case 'b':
        const scale = random(-1, 1) > 0 ? 1 : -1;
        graphics.rotate(options.turnrate * scale);
        graphics.line(0, 0, 0, -random(options.lineLenght, 2 * options.lineLenght));
        break;
      case 'd':
        graphics.push();
        break;
      case 'e':
        graphics.pop();
        break;
    }
  });
  graphics.pop();
}

function resetLSystemQuadrupel() {
  lSystemRules = {
    word: 'a',
    replacementRules: {
      'a': 'ab',
      'b': 'dae',
      'd': 'd',
      'e': 'e',
    }
  };

  currentIteration = options.iterations;
}