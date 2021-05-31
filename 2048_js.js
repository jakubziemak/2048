let gameBoard = new Array();
let emptyTiles =  new Array();
let cooldown = 0;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

let td = document.querySelectorAll('td')
let table = document.querySelector('table');
document.onload = addCellsId(), refreshBestScore();
document.onkeydown = checkKey;

table.addEventListener('touchstart', (event)=>{
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
});
table.addEventListener('touchend', (event)=>{
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    moveByTouch();
})
const moveByTouch = ()=>{
    let x = touchstartX - touchEndX;
    let y = touchstartY - touchEndY;
    if (Math.abs(x) < Math.abs(y)){
        (y > 0)? move(0) : move(1)
    }
    else {
        (x > 0)? move(2) : move(3)
    }
}
function checkKey(e) {;
    if (cooldown == 0){
        cooldown++
        e = e || window.event;
        if (e.keyCode == '38') {
            move(0)// up arrow
        }
        else if (e.keyCode == '40'){
            move(1)// down arrow
        }
        else if (e.keyCode == '37'){
            move(2)// left arrow
        }
        else if (e.keyCode == '39'){
            move(3)// right arrow
        }
        setTimeout(()=>{cooldown = 0}, 360)
    }
}
function createGameBoard(){
    for (let r = 0, row; row = table.rows[r]; r++) {
        for (let i = 0, cell; cell = row.cells[i]; i++){
            cell.innerHTML = null
        }
    }
    let score = document.getElementById('current-score')
    score.innerHTML = 0
    document.getElementById('undo').disabled = false
    generateTile();
    setTimeout(()=>{generateTile()}, 30);
};
function findEmptyTiles(){
    emptyTiles = []
    for (let r = 0, row; row = table.rows[r]; r++) {
        for (let i = 0, cell; cell = row.cells[i]; i++) {
            if (cell.childNodes.length == 0) emptyTiles.push(cell.id)
        }  
    }
};
function generateTile(){
    findEmptyTiles();
    let randomTilePosition = Math.floor(Math.random()*emptyTiles.length);
    let randomTile = emptyTiles[randomTilePosition];
    let index = randomTile[0];
    let row = randomTile[1];
    let cellId = index + row;
    let generatedNumber = generateNumber()
    let score = document.getElementById('current-score')
    
    cell = document.getElementById(cellId)
    cell.innerHTML = `<h4>${generatedNumber}</h4>`;

    cell.childNodes[0].style.transform = `translateY(-50%) scale(0)`
    cell.childNodes[0].style.backgroundColor = `${Colors[cell.childNodes[0].innerHTML]}`
    setTimeout(()=>{cell.childNodes[0].style.transition = 'all .2s'
        cell.childNodes[0].style.transform = `translateY(-50%) scale(1)`}, 30)

    score.innerHTML = Number(score.innerHTML) + generatedNumber
    bestScore(score)
};
function generateNumber(){
    let tileValue = Math.random()<0.8 ? 2 : 4;
    return tileValue
};
function addCellsId(){
    for (let r = 0, row; row = table.rows[r]; r++) {
        for (let i = 0, cell; cell = row.cells[i]; i++) {
            cell.id = `${r}${i}`;
        }  
    }
};
function move(direction){
    convertTableToArray();
    let checkToGenerateTile = 0;
    let sideLength = Number(document.getElementById('00').offsetWidth);
    if(direction == 0 || direction == 2){
        for (let r = 0, row; row = table.rows[r]; r++) {
            for (let i = 0, cell; cell = row.cells[i]; i++){
                findEmptyTiles();

                if(!cell.childNodes.length == 0){
                    // move up
                    if(direction == 0 && r > 0){

                        let avalibleTileRow = emptyTiles.filter(value=>{
                            return value.charAt(1) == i;
                        })
                        let upperCell = document.getElementById(String(cell.id[0]-1) + String(cell.id[1]));
                        let destinationCell = document.getElementById(avalibleTileRow[0]);
                        let aboveDestinationCell;
                        if(avalibleTileRow.length !== 0){aboveDestinationCell = document.getElementById(String(avalibleTileRow[0][0] - 1) + i);}
                        
                        if(upperCell.innerHTML !== '' && cell.childNodes[0].innerHTML == upperCell.childNodes[0].innerHTML && upperCell.className !== 'summed'){
                            
                            upperCell.innerHTML = upperCell.innerHTML + cell.innerHTML;
                            moveTile(upperCell.childNodes[1], cell, 'Y', upperCell, sideLength);
                            toSumUp(upperCell);
                            upperCell.className = 'summed';
                            checkToGenerateTile++
                        }
                        
                        else if (avalibleTileRow.length !== 0 && avalibleTileRow[0][0] > 0 && aboveDestinationCell.childNodes[0].innerHTML == cell.childNodes[0].innerHTML 
                        && avalibleTileRow[0][0] < r && aboveDestinationCell.className !== 'summed'){
                            
                            aboveDestinationCell.innerHTML += cell.innerHTML
                            
                            aboveDestinationCell.childNodes[0].style.transition = `all 0.3s`;
                            setTimeout(()=>{aboveDestinationCell.childNodes[0].style.transform = `translateY(-50%)`}, 10);                            
                            moveTile(aboveDestinationCell.childNodes[1], cell, 'Y', aboveDestinationCell, sideLength);
                            toSumUp(aboveDestinationCell);
                            aboveDestinationCell.className = 'summed';
                            checkToGenerateTile++
                        }
                        
                        else if(avalibleTileRow.length !== 0 && avalibleTileRow[0][0] < r){

                            destinationCell.innerHTML = cell.innerHTML;
                            moveTile(destinationCell.childNodes[0], cell, 'Y', destinationCell, sideLength);
                            checkToGenerateTile++
                        }
                        else continue
                    }
                    // move left
                    if(direction == 2 && i > 0){
                        let avalibleTileIndex = emptyTiles.filter(value=>{
                            return value.charAt(0) == r;
                        })
                        let leftCell = document.getElementById(String(cell.id[0]) + String(cell.id[1]-1));
                        let destinationCell = document.getElementById(avalibleTileIndex[0]);
                        let leftOfDestinationCell;
                        if(avalibleTileIndex.length !== 0){leftOfDestinationCell = document.getElementById(r + String(avalibleTileIndex[0][1] - 1));}

                        if(leftCell.innerHTML !== '' && cell.childNodes[0].innerHTML == leftCell.childNodes[0].innerHTML && leftCell.className !== 'summed'){
                            
                            leftCell.innerHTML = leftCell.innerHTML + cell.innerHTML;
                            moveTile(leftCell.childNodes[1], cell, 'X', leftCell, sideLength);
                            toSumUp(leftCell);
                            leftCell.className = 'summed';
                            checkToGenerateTile++
                        }

                        else if (avalibleTileIndex.length !== 0 && avalibleTileIndex[0][1] > 0 && leftOfDestinationCell.childNodes[0].innerHTML == cell.childNodes[0].innerHTML 
                            && avalibleTileIndex[0][1] < i && leftOfDestinationCell.className !== 'summed'){
                                
                                leftOfDestinationCell.innerHTML += cell.innerHTML
                                
                                leftOfDestinationCell.childNodes[0].style.transition = `all 0.3s`;
                                setTimeout(()=>{leftOfDestinationCell.childNodes[0].style.transform = `translateY(-50%)`}, 10);                            
                                moveTile(leftOfDestinationCell.childNodes[1], cell, 'X', leftOfDestinationCell, sideLength);
                                toSumUp(leftOfDestinationCell);
                                leftOfDestinationCell.className = 'summed';
                                checkToGenerateTile++
                            }
                        else if(avalibleTileIndex.length !== 0 && avalibleTileIndex[0][1] < i){

                            destinationCell.innerHTML = cell.innerHTML;
                            moveTile(destinationCell.childNodes[0], cell, 'X', destinationCell, sideLength);
                            checkToGenerateTile++
                        }
                        else continue
                    }
                }
            }
        }
    }
    if(direction == 1 || direction == 3){
        for (let r = 3, row; row = table.rows[r]; r--) {
            for (let i = 3, cell; cell = row.cells[i]; i--){
                findEmptyTiles();

                if(!cell.childNodes.length == 0){
                    // move down
                    if(direction == 1 && r < 3){

                        let avalibleTileRow = emptyTiles.filter(value=>{
                            return value.charAt(1) == i;
                        })
                        let lowerCell = document.getElementById(String(Number(cell.id[0])+1) + String(cell.id[1]));
                        let destinationCell = document.getElementById(avalibleTileRow[avalibleTileRow.length - 1]);
                        let belowDestinationCell;
                        let lastElem = avalibleTileRow.length - 1
                        if(avalibleTileRow.length !== 0){belowDestinationCell = document.getElementById(Number(avalibleTileRow[lastElem]) + 10);}

                        if(lowerCell.innerHTML !== '' && cell.childNodes[0].innerHTML == lowerCell.childNodes[0].innerHTML && lowerCell.className !== 'summed'){
                            
                            lowerCell.innerHTML = lowerCell.innerHTML + cell.innerHTML;
                            moveTile(lowerCell.childNodes[1], cell, 'Y', lowerCell, sideLength);
                            toSumUp(lowerCell);
                            lowerCell.className = 'summed';
                            checkToGenerateTile++
                        }
                        
                        else if (avalibleTileRow.length !== 0 && avalibleTileRow[lastElem][0] < 3 && belowDestinationCell.childNodes[0].innerHTML == cell.childNodes[0].innerHTML 
                        && avalibleTileRow[lastElem][0] > r && belowDestinationCell.className !== 'summed'){
                            
                            belowDestinationCell.innerHTML += cell.innerHTML
                            
                            belowDestinationCell.childNodes[0].style.transition = `all 0.3s`;
                            setTimeout(()=>{belowDestinationCell.childNodes[0].style.transform = `translateY(-50%)`}, 10);                            
                            moveTile(belowDestinationCell.childNodes[1], cell, 'Y', belowDestinationCell, sideLength);
                            toSumUp(belowDestinationCell);
                            belowDestinationCell.className = 'summed';
                            checkToGenerateTile++
                        }
                        
                        else if(avalibleTileRow.length !== 0 && avalibleTileRow[lastElem][0] > r){
                        
                            destinationCell.innerHTML = cell.innerHTML;
                            moveTile(destinationCell.childNodes[0], cell, 'Y', destinationCell, sideLength);
                            checkToGenerateTile++;
                        }
                        else continue
                    }
                    if(direction == 3 && i < 3){
                        let avalibleTileIndex = emptyTiles.filter(value=>{
                            return value.charAt(0) == r;
                        })
                        let rightCell = document.getElementById(String(cell.id[0]) + String(Number(cell.id[1])+1));
                        let lastElem = avalibleTileIndex.length - 1
                        let destinationCell = document.getElementById(avalibleTileIndex[lastElem]);
                        let rightOfDestinationCell;
                        if(avalibleTileIndex.length !== 0){
                            rightOfDestinationCell = document.getElementById(avalibleTileIndex[lastElem][0] + (Number(avalibleTileIndex[lastElem][1]) + 1));}

                        if(rightCell.innerHTML !== '' && cell.childNodes[0].innerHTML == rightCell.childNodes[0].innerHTML && rightCell.className !== 'summed'){
                            
                            rightCell.innerHTML = rightCell.innerHTML + cell.innerHTML;
                            moveTile(rightCell.childNodes[1], cell, 'X', rightCell, sideLength);
                            toSumUp(rightCell);
                            rightCell.className = 'summed';
                            checkToGenerateTile++;
                        }

                        else if (avalibleTileIndex.length !== 0 && avalibleTileIndex[lastElem][1] < 3 
                            && rightOfDestinationCell.childNodes[0].innerHTML == cell.childNodes[0].innerHTML && avalibleTileIndex[lastElem][1] > i 
                            && rightOfDestinationCell.className !== 'summed'){
                                
                                rightOfDestinationCell.innerHTML += cell.innerHTML;
                                
                                rightOfDestinationCell.childNodes[0].style.transition = `all 0.3s`;
                                setTimeout(()=>{rightOfDestinationCell.childNodes[0].style.transform = `translateY(-50%)`}, 10);                            
                                moveTile(rightOfDestinationCell.childNodes[1], cell, 'X', rightOfDestinationCell, sideLength);
                                toSumUp(rightOfDestinationCell);
                                rightOfDestinationCell.className = 'summed';
                                checkToGenerateTile++;
                            }
                        else if(avalibleTileIndex.length !== 0 && avalibleTileIndex[lastElem][1] > i){

                            destinationCell.innerHTML = cell.innerHTML;
                            moveTile(destinationCell.childNodes[0], cell, 'X', destinationCell, sideLength);
                            checkToGenerateTile++;
                        }
                        else continue
                    }
                }
            }
        }
    }
    if(checkToGenerateTile !== 0){
        setTimeout(()=>{generateTile()}, 300)}
    for (let r = 0, row; row = table.rows[r]; r++) {
        for (let i = 0, cell; cell = row.cells[i]; i++){
            cell.className = '';
        }
    }
    if(emptyTiles.length == 0){
        searchForLegitMoves();
    }
}
function moveTile(tileToStyle, currentTile, axis, destination, sideLength){
    if(axis == 'Y'){tileToStyle.style.transform = `translateY(${((Number(currentTile.id[0]) - Number(destination.id[0]))*(sideLength+8)) - (sideLength*0.5)}px)`;}
    else if(axis == 'X'){tileToStyle.style.transform = `translateX(${((Number(currentTile.id[1]) - Number(destination.id[1]))*(sideLength+8))}px) translateY(-50%)`;}

    setTimeout(()=>{
        tileToStyle.style.transition = `all 0.3s`;
        tileToStyle.style.transform = `translateY(-50%)`;}, 30)

    currentTile.innerHTML = '';
    destination.style = '';
}
function toSumUp(tile){
    setTimeout(()=>{
    tile.innerHTML = `<h4>${Number(tile.childNodes[0].innerHTML) + Number(tile.childNodes[0].innerHTML)}</h4>`;
    tile.style.transition = 'all .1s';
    tile.style.transform = `scale(1.1)`;
    tile.childNodes[0].style.backgroundColor = `${Colors[tile.childNodes[0].innerHTML]}`;
    if (tile.childNodes[0].innerHTML>4){tile.childNodes[0].style.color = `white`};
    setTimeout(()=>{tile.style.transform = `scale(1)`}, 100)}, 300);

    tile.className = 'summed';
    if(tile.childNodes[0].innerHTML == 2048){
        cooldown = 1
    }
}
function searchForLegitMoves(){
    let arr = [];
    for (let r = 0, row; row = table.rows[r]; r++) {
        for (let i = 0, cell; cell = row.cells[i]; i++){
            cell = document.getElementById(`${String(r)+String(i)}`);
            let cellOnTheLeft = document.getElementById(`${String(r)+String(i + 1)}`);
            let cellBelow = document.getElementById(`${String(r+1)+String(i)}`);
            if(i<3){
                arr.push(cell.childNodes[0].innerHTML == cellOnTheLeft.childNodes[0].innerHTML)
            }
            if(r<3){
                arr.push(cell.childNodes[0].innerHTML == cellBelow.childNodes[0].innerHTML)
            }
        }
    }
    if(arr.some(x => x == true) == false){
        document.getElementById('undo').disabled = true;
        let table = document.querySelector('#content');
        let endScreen = document.createElement('div');
        let h3 = document.createElement('h3');

        table.appendChild(endScreen);
        endScreen.appendChild(h3);
        endScreen.id = 'endScreen';
        h3.id = 'endScreenCaption'

        h3.innerHTML = `YOU LOSE <br><span>TRY AGAIN</span>`

        endScreen.style.opacity = '0';
        endScreen.style.transition = 'all .3s';
        setTimeout(()=>{endScreen.style.opacity = '60%'}, 10);
        h3.style.opacity = '100%'

    }
}
function bestScore(score){
    let bestScore = document.getElementById('best-score')
    if (Number(bestScore.innerHTML) < Number(score.innerHTML)){
        bestScore.innerHTML = score.innerHTML;
        localStorage.setItem('bestScore', bestScore.innerHTML)
    }
}
function refreshBestScore(){
    let bestScore = localStorage.getItem('bestScore')
    document.getElementById('best-score').innerHTML = bestScore
}
function convertTableToArray(){
    gameBoard = []
    for (let r = 0, row; row = table.rows[r]; r++) {
        gameBoard[r] = new Array()
        for (let i = 0, cell; cell = row.cells[i]; i++){
            if (cell.innerHTML == ''){
                gameBoard[r].push(cell.innerHTML)
            }
            else {
                gameBoard[r].push(cell.childNodes[0].innerHTML)
            }
        }
    }
}
function undoMove(){
    if(gameBoard.length !== 0){
        for (let r = 0, row; row = table.rows[r]; r++) {
            for (let i = 0, cell; cell = row.cells[i]; i++){
                if(gameBoard[r][i] == ''){
                    cell.innerHTML = ''
                }
                else{
                    cell.innerHTML = `<h4>${gameBoard[r][i]}</h4>`
                    cell.childNodes[0].style.backgroundColor = Colors[gameBoard[r][i]]
                    if(gameBoard[r][i]>4){cell.childNodes[0].style.color = 'white'}
                }
            }
        }
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