class Grid
{
    constructor()
    {
        this.tileSizeX = width/tileSplitCount
        this.tileSizeY = height/tileSplitCount;
        this.maxSnapDist =  0.05* sqrt(this.tileSizeX*this.tileSizeX + this.tileSizeY*this.tileSizeY);
        this.snapPoints = [];
        this.tileSplitCount = tileSplitCount;
        for(let i=0;i<tileSplitCount;i++)
        {
            for(let j=0;j<tileSplitCount;j++)
            {
                this.snapPoints.push(createVector(this.tileSizeX*j + this.tileSizeX*0.5,this.tileSizeY*i + this.tileSizeY*0.5));
            }
        }
        this.started = false;
        this.finished = false;
    }

    update()
    {
        if(!this.finished && this.started)
        {
            let won = true;
            for(let tile of tiles)
            {
                for(let point of this.snapPoints)
                {
                    let tileCenter = createVector(tile.position.x + tile.size.x*0.5,tile.position.y + tile.size.y*0.5)
                    let distance = dist(tileCenter.x,tileCenter.y,point.x,point.y);
                    
                    if(distance < this.maxSnapDist && distance > 1 && !tile.isDragging)
                    {
                        tile.position = point.copy().sub(this.tileSizeX*0.5, this.tileSizeY*0.5);
                    }
                }
                let currentPosition = {
                    col: abs(floor(tile.position.x / tile.size.x)),
                    row: abs(floor(tile.position.y / tile.size.y))
                }
                if(tile.startingPosition.col != currentPosition.col ||
                   tile.startingPosition.row != currentPosition.row)
                    won = false;
            }
            if(won)
            {
                this.finished = true;
                const notification = new Notification("Puzzle Solved!");
                alert("Solved 🥵");
            }
        }
    }

    show()
    {
        noFill();
        stroke('#eb7a34');
        strokeWeight(2);
        for(let i=0;i<this.tileSplitCount;i++)
        {
            for(let j=0;j<this.tileSplitCount;j++)
            {
                rect(this.tileSizeX*j,this.tileSizeY*i,this.tileSizeX,this.tileSizeY);
                let index = i * this.tileSplitCount + j;
                
            }
        }
    }
}