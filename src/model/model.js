
export class Level{
    constructor(width, height, sources){
        this.width = width;
        this.height = height;

        this.sources = sources;
    }
}

export class Board{
    constructor(level){
        this.level = level;
        
        this.grid = new Array(level.width * level.height);
        
        initialize();
    }

    initialize(){
        // Initialize our grid to the default cells.
        for(let j = 0; j < this.level.height; j++){
            for(let i = 0; i < this.level.width; i++){
                this.grid[i + (j * this.level.width)] = new Cell(i, j);
            }
        }
    }
}

export class Cell{
    constructor(x, y, populated = false, color = '#000000', value = 0, isExtendable = true){
        this.x = x;
        this.y = y;
        
        this.color = color;
        this.value = value;

        this.populated = populated;
        this.isExtendable = isExtendable;
    }
}

// Representation of the initial world state
export class Model{
    constructor(){
        this.levels = {
            "level 1":{}
        };
        
        this.board = null;
    }

    getLevelNames(){
        return Object.keys(this.levels);
    }

    hasLevel(levelName){
        return !!this.levels[levelName];
    }

    loadLevel(levelName){
        if(hasLevel(levelName)){
            this.board = new Board(this.levels[levelName]);
        }
    }
}