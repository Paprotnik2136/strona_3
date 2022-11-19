let leafletMap;
let canvas;
let tiles = [];
let tileSplitCount = 4;
let grid;
let shuffleBtn;

function setup()
{
    let latInput = document.getElementById("lat");
    let longInput = document.getElementById("long");
    document.getElementById("latlong-btn").addEventListener("click",() => {
        leafletMap.setView([latInput.value, longInput.value], leafletMap.getZoom());
    });

    shuffleBtn = document.getElementById("shuffle-tiles-btn");
    shuffleBtn.addEventListener("click",()=>{
        if(!shuffleBtn.classList.contains("disabled"))
        {
            shuffleTiles();
            shuffleBtn.classList.add("disabled");
        }
    })

    document.getElementById("use-current-loc-btn").addEventListener("click",()=>{
        navigator.geolocation.getCurrentPosition(
            (position)=>{
                let latitude  = position.coords.latitude;
                let longitude = position.coords.longitude;
                latInput.value = latitude;
                longInput.value = longitude;
                leafletMap.setView([latInput.value, longInput.value], leafletMap.getZoom());
            },
            ()=>{
                console.log("permission denied");
            }
        ); 
    })

    document.getElementById("create-tiles-btn").addEventListener("click",()=>{
        prepareTiles();
    });

    //leaflet
    leafletMap = L.map('map-wrapper',{
        renderer: L.canvas()
    }).setView([latInput.value, longInput.value], 13);
    L.tileLayer.canvas('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    leafletMap.on("click",(e)=>{
        let lat = e.latlng.lat;
        let long = e.latlng.lng;
        latInput.value = lat;
        longInput.value = long;
    });

    //general
    let mapWrapper = document.getElementById("map-wrapper");
    canvas = createCanvas(mapWrapper.clientWidth ,mapWrapper.clientHeight);
    canvas.parent("canvas-wrapper");

    window.addEventListener("resize",()=>{
        let mapWrapper = document.getElementById("map-wrapper");
        canvas.resize(mapWrapper.clientWidth,mapWrapper.clientHeight);
    });

    grid = new Grid();
}

function draw()
{
    background(51);
    for(let i=tiles.length-1;i>=0;i--)
    {
        tiles[i].update();
        if(tiles[i].isDragging && tiles[i] != tiles.at(-1))
        {
            let ref = tiles[i];
            tiles.splice(i, 1);
            tiles.push(ref);
            continue;
        }
    }

    for(let tile of tiles)
    {
        tile.show();
    }
    grid.update();
    grid.show();
}


function prepareTiles()
{
    html2canvas(document.querySelector("#map-wrapper")).then(tempCanvas => {
        Tile.dragLock = false;
        grid = new Grid();
        tiles = [];
        let tileSizeX = width/tileSplitCount;
        let tileSizeY = height/tileSplitCount;
        for(let row = 0; row < tileSplitCount; row++)
        {
            for(let col = 0; col < tileSplitCount; col++)
            {
                let data = tempCanvas.getContext("2d").getImageData(tileSizeX*col,tileSizeY*row,tileSizeX,tileSizeY).data;
                let tile = new Tile(col,row,tileSizeX,tileSizeY,data);
                tiles.push(tile);
            }
        }
        shuffleBtn.classList.remove("disabled");
    });
}

function shuffleTiles()
{
    let positions = [];
    for(let point of grid.snapPoints)
    {
        positions.push(point.copy().sub(grid.tileSizeX*0.5, grid.tileSizeY*0.5));
    }
    positions = shuffle(positions);
    for(let tile of tiles)
    {
        tile.position = positions.pop();
    }
    grid.started = true;
}

