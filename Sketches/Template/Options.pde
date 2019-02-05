class Options
{
  // accessible Variables
  public boolean exampleBool = false;
  public boolean exampleBool2 = false;
  
  // style options
  private int lineHeight = 28;
  private int lineWidth = 380;
  private int textSize = lineHeight - 8;
  private color activeColor = color(#74b9ff);
  private color inactiveColor = color(#197ae0);
  private color highlightColor = color(#53a0f4);
  private color backgroundColor = color(#294869);
  private color textColor = color(#e3f5ff);
  
  // internal logic
  private int amountOfElements = 0;
  private PVector drawStartpoint = new PVector(10, 10);
  
  public Options()
  {
  }
  
  public void prepareCanvas(PGraphics canvas)
  {
    canvas.beginDraw();
    
    canvas.background(backgroundColor);
    drawBoolOption(exampleBool, "exampleBool", canvas);
    drawBoolOption(exampleBool2, "exampleBool2", canvas);
    
    canvas.endDraw();
    
    resetElementCounting();
  }
  
  public void mousePressedAt(int mouseXVal, int mouseYVal)
  {
    // this must somehow update the the global Variables
    int elementNumber = getClickedElementNumber(mouseXVal, mouseYVal);
    println("todo: update clicked Variable " + elementNumber);
  }
  
  private void drawBoolOption(boolean boolVar, String varName, PGraphics canvas)
  {
    PVector topLeftPos = getElementDrawPosition();
    float rectTopPos = topLeftPos.y + 2;
    float checkboxSize = lineHeight - 4;
    
    // display option
    if (boolVar)
    {
      canvas.fill(inactiveColor);      
    }
    else
    {
      canvas.fill(activeColor);      
    }
    canvas.rect(topLeftPos.x, rectTopPos, checkboxSize, checkboxSize);
    
    // display var text
    canvas.fill(textColor);
    canvas.textSize(textSize);
    float textY = rectTopPos + checkboxSize - 6;
    canvas.text(varName, topLeftPos.x + checkboxSize + 4, textY);
    
    elementDrawn();
  }
  
  // returns on which line the click was (elementNumber)
  private int getClickedElementNumber(int mouseXVal, int mouseYVal)
  {
    //return (int)((mouseY - drawStartpoint.y) % lineHeight);
    return mouseXVal;
  }
  
  private PVector getElementDrawPosition()
  {
    PVector position = new PVector(
      this.drawStartpoint.x,
      this.drawStartpoint.y + this.lineHeight * this.amountOfElements);
    return position;
  }
  
  private void elementDrawn()
  {
    this.amountOfElements ++;
  }
  
  private void resetElementCounting()
  {
    this.amountOfElements = 0;
  }
}
