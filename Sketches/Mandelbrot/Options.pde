class Options
{
  // accessible Variables
  public int bailoutvalue = 500;
  public PVector xMinMax = new PVector(-2.5f, 1);
  public PVector yMinMax = new PVector(-1, 1);
  public color[] colors = new color[5];
  
  public Options()
  {
    colors[0] = color(#564592);
    colors[1] = color(#724cf9);
    colors[2] = color(#ca7df9);
    colors[3] = color(#f896d8);
    colors[4] = color(#edf67d);
  }
}
