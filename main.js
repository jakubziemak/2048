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
        const [posY, posX] = this.freeSpaces()[randomPos]

        this.gameBoard[posY][posX] = val        
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
            const free = this.freeSpaces().filter(([x, y]) => y == cell.posX)[0]

            if (cell.posY == 0) return

            if (this.gameBoard[cell.posY - 1][cell.posX] == cell.val){
                cell.val += cell.val
                this.updateGameBoard(cell, [cell.posY - 1, cell.posX])
            } else if (free && free [0] > 0 && this.gameBoard[free[0] - 1][free[1]] == cell.val){
                cell.val += cell.val
                this.updateGameBoard(cell, [free[0] - 1, free[1]])
            } else if (free && cell.posY > free[0]){
                this.updateGameBoard(cell, free)
            }
        })
    }
    moveDown = () => {
        this.cellsToMove().reverse().forEach(cell => {
            const free = this.freeSpaces().filter(([x, y]) => y == cell.posX).reverse()[0]

            if (cell.posY == 3) return
            
            if (this.gameBoard[cell.posY + 1][cell.posX] == cell.val){
                cell.val += cell.val
                this.updateGameBoard(cell, [cell.posY + 1, cell.posX])
            } else if (free && free [0] < 3 && this.gameBoard[free[0] + 1][free[1]] == cell.val){
                cell.val += cell.val
                this.updateGameBoard(cell, [free[0] + 1, free[1]])
            } else if (free && cell.posY < free[0]){
                this.updateGameBoard(cell, free)
            }
        })
    }
    moveLeft = () => {
        this.cellsToMove().forEach(cell => {
            const free = this.freeSpaces().filter(([x, y]) => x == cell.posY)[0]

            if (cell.posX == 0) return
            
            if (this.gameBoard[cell.posY][cell.posX - 1] == cell.val){
                cell.val += cell.val
                this.updateGameBoard(cell, [cell.posY, cell.posX - 1])
            } else if (free && free [1] > 0 && this.gameBoard[free[0]][free[1] - 1] == cell.val){
                cell.val += cell.val
                this.updateGameBoard(cell, [free[0], free[1] - 1])
            } else if (free && cell.posX > free[1]){
                this.updateGameBoard(cell, free)
            }
        })
    }
    moveRight = () => {
        this.cellsToMove().reverse().forEach(cell => {
            const free = this.freeSpaces().filter(([x, y]) => x == cell.posY).reverse()[0]

            if (cell.posX == 3) return
            
            if (this.gameBoard[cell.posY][cell.posX + 1] == cell.val){
                cell.val += cell.val
                this.updateGameBoard(cell, [cell.posY, cell.posX + 1])
            } else if (free && free [1] < 3 && this.gameBoard[free[0]][free[1] + 1] == cell.val){
                cell.val += cell.val
                this.updateGameBoard(cell, [free[0], free[1] + 1])
            } else if (free && cell.posX < free[1]){
                this.updateGameBoard(cell, free)
            }
        })
    }
    updateGameBoard = (cell, target) => {
        const {posX, posY, val} = cell
        const [targetY, targetX] = target

        this.gameBoard[posY][posX] = 0
        this.gameBoard[targetY][targetX] = val
    }
    cellsToMove = () => {
        const cells = this.gameBoard
            .flat()
            .map((val, i) => {if (val !== 0) return {val: val, posY: Math.floor(i/4), posX: i%4}})
            .filter(cell => cell !== undefined)
        return cells
    }
}

const game = new Game()
document.addEventListener('keydown', (e) => {
    e.preventDefault()
    game.move(e.key)
})

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