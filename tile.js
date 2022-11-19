class Tile
{
    static dragLocked = false;

    constructor(col,row,w,h,imageData)
    {
        this.img = createImage(w,h);
        this.size = createVector(this.img.width,this.img.height);
        this.startingPosition = {
            col: col,
            row: row
        };
        this.position = createVector(this.size.x*col,this.size.y*row);
        this.img.loadPixels();
        console.log(imageData.length,this.img.pixels.length);
        for(let i=0; i < this.img.width * this.img.height*4; i+=4)
        {
            this.img.pixels[i] = imageData[i];
            this.img.pixels[i + 1] = imageData[i + 1];
            this.img.pixels[i + 2] = imageData[i + 2];
            this.img.pixels[i + 3] = imageData[i + 3];
        }
        this.img.updatePixels();

        this.isDragging = false;
    }

    update()
    {
        if(this.__isMouseOver() && mouseIsPressed===true)
        {
            if(!Tile.dragLocked)
            {
                this.isDragging = true;
                Tile.dragLocked = true;
            }

            if(this.isDragging)
            {
                this.position.x = mouseX - this.size.x*0.5;
                this.position.y = mouseY - this.size.y*0.5;
            }
        }
        else
        {
            if(this.isDragging)
            {
                this.isDragging = false;
                Tile.dragLocked = false;
            }
        }
    }

    show()
    {
        image(this.img,
              this.position.x,
              this.position.y);
        if(this.__isMouseOver() && (!Tile.dragLocked || this.isDragging))
        {
            fill(100,150,200,127);
            noStroke();
        }
    }

    __isMouseOver()
    {
        return (mouseX > this.position.x &&
                mouseX < this.position.x + this.size.x &&
                mouseY > this.position.y &&
                mouseY < this.position.y + this.size.y);
    }
}