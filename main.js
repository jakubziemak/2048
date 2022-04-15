class Game {
    constructor(){
        this.newTile()
        this.newTile()
        console.table(this.gameBoard)
    }
    
    gameBoard = [[0, 0, 0, 0], 
                 [0, 0, 0, 0], 
                 [0, 0, 0, 0], 
                 [0, 0, 0, 0]]

    newTile = () => {
        const val = Math.random() < 0.5 ? 2 : 4
        const randomPos = Math.floor(Math.random() * this.freeSpaces().length)
        const [posX, posY] = this.freeSpaces()[randomPos]

        this.gameBoard[posX][posY] = val        
    }
    freeSpaces = () => {
        const free = this.gameBoard
            .flat()
            .map((cell, i) => {if (cell == 0) return [Math.floor(i/4), i%4]})
            .filter(cell => cell !==undefined)
        return free
    }
}


let Colors = {
    2: '#eee6db',
    4: '#ece0c8',
    8: '#efb27c',
    16: '#f3966a',
    32: '#f27d62',
    64: '#f46042',
    128: '#ebce77',
    256: '#eccb67',
    512: '#edc759',
    1024: '#e7c257',
    2048: '#e8bf4e'
}