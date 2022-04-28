export default class Tile{
    constructor(value, x, y, id){
        this.value = value
        this.x = x
        this.y = y
        this.id = id
        
        this.width = document.querySelector('td').clientWidth
        this.height = document.querySelector('td').clientHeight
        this.spacing = Number(getComputedStyle(document.querySelector('table')).borderSpacing[0])
        
        this.createTile()
    }
    colors = {
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
    
    createTile = () => {
        const div = document.querySelector('#tiles-handler')
        const newTile = document.createElement('div')
        
        newTile.id = `tile${this.id}`
        newTile.className = 'tile'
        newTile.innerText = this.value
        
        newTile.style.height = this.height + 'px'
        newTile.style.width = this.width + 'px'
        newTile.style.background = this.colors[this.value]
        
        div.appendChild(newTile)
        this.moveTo()
    }
    
    newPosition = (newX, newY) => {
        const oldX = this.x
        const oldY = this.y

        this.x = newX
        this.y = newY

        this.moveTo()
        this.animation(oldX, oldY, this.x, this.y)
    }

    moveTo = () => {
        const tile = document.querySelector(`#tile${this.id}`)
        tile.style.top = this.y * (this.height + this.spacing) + 'px'
        tile.style.left = this.x * (this.height + this.spacing) + 'px'
    }

    animation = (oldX, oldY, newX, newY) => {
        const tile = document.querySelector(`#tile${this.id}`)
        const ani = [
            {
                top: oldY * (this.height + this.spacing) + 'px',
                left: oldX * (this.height + this.spacing) + 'px'
            },
            {
                top: newY * (this.height + this.spacing) + 'px',
                left: newX * (this.height + this.spacing) + 'px'
            }
        ]

        tile.animate(ani, 100)
    }
}