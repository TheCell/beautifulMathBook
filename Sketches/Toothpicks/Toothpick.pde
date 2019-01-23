class Toothpick
{
  int ax, ay, bx, by;
  int direction;
  int pickLength = 9;
  boolean isNewToothPick = true;
  
  Toothpick(int x, int y, int direction)
  {
    this.direction = direction;
    if (this.direction == 1)
    {
      ax = x - pickLength/2;
      bx = x + pickLength/2;
      ay = y;
      by = y;
    }
    else
    {
      ax = x;
      bx = x;
      ay = y - pickLength/2;
      by = y + pickLength/2;
    }
  }
  
  private boolean intersects(int x, int y)
  {
    if (ax == x && ay == y)
    {
      return true;
    }
    else if (bx == x && by == y)
    {
      return true;
    }
    
    return false;
  }
  
  public Toothpick createA(ArrayList<Toothpick> others)
  {
    boolean available = true;
    
    for (Toothpick other : others)
    {
      if (other != this && other.intersects(ax, ay))
      {
        available = false;
      }
    }
    
    if (available)
    {
      return new Toothpick(ax, ay, direction*-1);
    }
    return null;
  }
  
  public Toothpick createB(ArrayList<Toothpick> others)
  {
    boolean available = true;
    
    for (Toothpick other : others)
    {
      if (other != this && other.intersects(bx, by))
      {
        available = false;
      }
    }
    
    if (available)
    {
      return new Toothpick(bx, by, direction*-1);
    }
    return null;
  }
  
  public void show(PGraphics canvas)
  {
    canvas.stroke(0);
    if (isNewToothPick)
    {
      canvas.stroke(0, 0, 255);
    }
    canvas.strokeWeight(1);
    canvas.line(ax, ay, bx, by);
  }
}
