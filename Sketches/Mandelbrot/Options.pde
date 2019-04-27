class Options
{
  // accessible Variables
  public int bailoutvalue = 500;
  public PVector xMinMax = new PVector(-2.5f, 1);
  public PVector yMinMax = new PVector(-1, 1);
  public color[] colors = new color[5];
  
  public Options()
  {
    colors[0] = color(#efe9e7);
    colors[1] = color(#dae0f2);
    colors[2] = color(#fb8b24);
    colors[3] = color(#e36414);
    colors[4] = color(#231f20);
  }
}
