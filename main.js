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
    move = (direction) => {
        switch(direction){
            case 'ArrowLeft':
                this.moveLeft()
                break
            case 'ArrowUp':
                this.moveUp()
                break
            case 'ArrowRight':
                this.moveRight()
                break
            case 'ArrowDown':
                this.moveDown()
                break
        }
        console.table(this.gameBoard)
    }
    moveUp = () => {
        this.cellsToMove().forEach(cell => {
            const free = this.freeSpaces().filter(([x, y]) => y == cell.posY)[0]
            if(free && cell.posX > free[0]){
                this.gameBoard[cell.posX][cell.posY] = 0
                this.gameBoard[free[0]][free[1]] = cell.val
            }
        })
    }
    moveDown = () => {
        this.cellsToMove().reverse().forEach(cell => {
            const free = this.freeSpaces().filter(([x, y]) => y == cell.posY).reverse()[0]
            if(free && cell.posX < free[0]){
                this.gameBoard[cell.posX][cell.posY] = 0
                this.gameBoard[free[0]][free[1]] = cell.val
            }
        })
    }
    moveLeft = () => {
        this.cellsToMove().forEach(cell => {
            const free = this.freeSpaces().filter(([x, y]) => x == cell.posX)[0]
            if(free && cell.posY > free[1]){
                this.gameBoard[cell.posX][cell.posY] = 0
                this.gameBoard[free[0]][free[1]] = cell.val
            }
        })
    }
    moveRight = () => {
        this.cellsToMove().reverse().forEach(cell => {
            const free = this.freeSpaces().filter(([x, y]) => x == cell.posX).reverse()[0]
            if(free && cell.posY < free[1]){
                this.gameBoard[cell.posX][cell.posY] = 0
                this.gameBoard[free[0]][free[1]] = cell.val
            }
        })
    }
    cellsToMove = () => {
        const cells = this.gameBoard
            .flat()
            .map((val, i) => {if (val !== 0) return {val: val, posX: Math.floor(i/4), posY: i%4}})
            .filter(cell => cell !== undefined)
        return cells
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