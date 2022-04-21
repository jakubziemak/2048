export default class Tile{
    constructor(value, x, y){
        this.value = value
        this.x = x
        this.y = y

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

        newTile.className = 'tile'
        newTile.innerText = this.value

        newTile.style.height = this.height + 'px'
        newTile.style.width = this.width + 'px'
        newTile.style.background = this.colors[this.value]
        newTile.style.top = this.y * (this.height + this.spacing) + 'px'
        newTile.style.left = this.x * (this.height + this.spacing) + 'px'
        
        div.appendChild(newTile)
    }
}