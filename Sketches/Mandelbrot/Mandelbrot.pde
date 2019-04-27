Options options;
PVector windowSize;
PVector imageSize;
PGraphics graphic;
int imageX = 1400;
int imageY = 800;

void settings()
{
  // setup window
  windowSize = new PVector(700, 400);
  imageSize = new PVector(imageX, imageY);
  size((int)windowSize.x, (int)windowSize.y);
  pixelDensity(displayDensity());
}

void setup()
{
  // prepare independent image to have a custom resolution
  graphic = createGraphics((int)imageSize.x, (int)imageSize.y);
  options = new Options();
  noLoop();
}

void draw()
{
  graphic.beginDraw();
  graphic.background(100);
  graphic.endDraw();
  
  writeMandelbrot(graphic);
  image(graphic, 0, 0, windowSize.x, windowSize.y);
}

void writeMandelbrot(PGraphics image)
{
  image.loadPixels();
  for (int i = 0; i < imageX * imageY; i++)
  {
    int x = i % imageX;
    int y = i / imageX;
    float xPercent = (1.0 / imageX) * x;
    float yPercent = (1.0 / imageY) * y;
    float pointX = lerp(options.xMinMax.x, options.xMinMax.y, xPercent);
    float pointY = lerp(options.yMinMax.x, options.yMinMax.y, yPercent);
    image.pixels[i] = calculatePoint(pointX, pointY);
  }
  image.updatePixels();
}

color calculatePoint(float x0, float y0)
{
  float x = 0.0;
  float y = 0.0;
  int iteration = 0;
  color pixelColor = options.colors[0];
  
  while(x*x + y*y <= 2*2 && iteration < options.bailoutvalue)
  {
    float xtemp = x*x - y*y + x0;
    y = 2*x*y + y0;
    x = xtemp;
    iteration = iteration + 1;
  }
  
  if (iteration > options.bailoutvalue * 0.01)
  {
    pixelColor = options.colors[1];
  }
  
  if (iteration > options.bailoutvalue * 0.02)
  {
    pixelColor = options.colors[2];
  }
  
  if (iteration > options.bailoutvalue * 0.03)
  {
    pixelColor = options.colors[3];
  }
  
  if (iteration > options.bailoutvalue * 0.99)
  {
    pixelColor = options.colors[4];
  }
  
  return pixelColor;
}
