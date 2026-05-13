import GUI from 'lil-gui';
import p5 from 'p5';

new p5((p: p5) => {
  let gfx: p5.Graphics;
  let seed: number;

  const startupParameters = {
    xSize: 600,
    ySize: 600,
    resizeCanvas: function () {
      p.createCanvas(startupParameters.xSize, startupParameters.ySize);
      gfx = p.createGraphics(startupParameters.xSize, startupParameters.ySize);
      gfx.background(options.background);
    }
  };

  const options = {
    background: '#212121',
    foreground: '#ffae23',
    restart: function () {
      seed = Math.random() * 100000;
      p.randomSeed(seed);
      gfx.reset();
      gfx.background(options.background);
    },
    save: function () {
      p.saveCanvas(`Example_${new Date().getFullYear()}_seed-${seed}_date-${Date.now()}`, 'png');
    },
    loadImage: function () {
      (document.getElementById('fileselector') as HTMLInputElement).click();
    }
  };

  const gui = new GUI({ title: 'Customization' });
  const startupParameterFolder = gui.addFolder('canvas options');
  startupParameterFolder.add(startupParameters, 'xSize', 200);
  startupParameterFolder.add(startupParameters, 'ySize', 200);
  startupParameterFolder.add(startupParameters, 'resizeCanvas');
  const folder1 = gui.addFolder('Setup options');
  folder1.add(options, 'loadImage');
  folder1.addColor(options, 'background');
  folder1.addColor(options, 'foreground');
  folder1.open();
  gui.add(options, 'restart');
  gui.add(options, 'save');

  p.setup = function (): void {
    startupParameters.resizeCanvas();
    options.restart();
  };

  p.draw = function (): void {
    p.image(gfx, 0, 0);
  };

  (window as any).onFileSelected = function (): void {
    const input = document.getElementById('fileselector') as HTMLInputElement;
    for (const file of Array.from(input.files ?? [])) {
      p.loadImage(URL.createObjectURL(file), (img: p5.Image) => {
        gfx.image(img, 0, 0);
      });
    }
  };
});
