class ChildApplet extends PApplet {
  //JFrame frame;
  Options options;
  PVector optionWindowSize;
  PGraphics optionsCanvas;
  
  public ChildApplet()
  {
    this(new Options());
  }
  
  public ChildApplet(Options options)
  {
    super();
    PApplet.runSketch(new String[]{this.getClass().getName()}, this);
    this.options = options;
  }
  
  public void settings()
  {
    // setup window
    optionWindowSize = new PVector(400, 800);
    size((int)optionWindowSize.x, (int)optionWindowSize.y);
    pixelDensity(displayDensity());
  }
  
  public void setup()
  {
    surface.setTitle("Options Menu");
    frameRate(30);
    optionsCanvas = createGraphics((int)optionWindowSize.x, (int)optionWindowSize.y);
  }

  public void draw()
  {
    this.options.prepareCanvas(optionsCanvas);
    image(optionsCanvas, 0, 0, optionWindowSize.x, optionWindowSize.y);
  }
  
  void mousePressed()
  {
    options.mousePressedAt(mouseX, mouseY);
  }
}
