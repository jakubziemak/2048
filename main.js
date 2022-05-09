import Tile from "./modules/tile.js";

class Game {
  constructor() {
    this.newTile();
    this.newTile();
  }

  gameBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  tiles = [];
  tilesToDelete = [];
  tilesToCreate = [];
  moved = false;

  newTile = () => {
    const val = Math.random() < 0.5 ? 2 : 4;
    const randomPos = Math.floor(Math.random() * this.freeSpaces().length);
    const [posY, posX] = this.freeSpaces()[randomPos];
    const tileId = this.newId();

    this.gameBoard[posY][posX] = val;
    this.tiles.push(new Tile(val, posX, posY, tileId));
  };

  newId = () => {
    console.log(this.tiles.length == 0 ? 0 : this.tiles.slice(-1)[0].id + 1);
    return this.tiles.length == 0 ? 0 : this.tiles.slice(-1)[0].id + 1;
  };

  freeSpaces = () => {
    const free = this.gameBoard
      .flat()
      .map((cell, i) => {
        if (cell == 0) return [Math.floor(i / 4), i % 4];
      })
      .filter((cell) => cell !== undefined);
    return free;
  };

  move = (direction) => {
    Promise.all(
      document.getAnimations().map((animation) => animation.finished)
    ).then(() => {
      switch (direction) {
        case "ArrowLeft":
          this.moveLeft();
          break;
        case "ArrowUp":
          this.moveUp();
          break;
        case "ArrowRight":
          this.moveRight();
          break;
        case "ArrowDown":
          this.moveDown();
          break;
      }
      this.deleteTiles();
    });

    // if (this.moved){
    //     this.newTile()
    //     this.moved = false
    // }
    // console.log(this.gameBoard)
  };

  moveUp = () => {
    this.cellsToMove().forEach((cell) => {
      const free = this.freeSpaces().filter(
        ([y, x]) => x == cell.posX && y < cell.posY
      )[0];

      if (cell.posY == 0) return;

      if (this.gameBoard[cell.posY - 1][cell.posX] == cell.val) {
        cell.val += cell.val;
        this.updateGameBoard(cell, [cell.posY - 1, cell.posX], true);
      } else if (
        free &&
        free[0] > 0 &&
        this.gameBoard[free[0] - 1][free[1]] == cell.val
      ) {
        cell.val += cell.val;
        this.updateGameBoard(cell, [free[0] - 1, free[1]], true);
      } else if (free && cell.posY > free[0]) {
        this.updateGameBoard(cell, free);
      }
    });
  };

  moveDown = () => {
    this.cellsToMove()
      .reverse()
      .forEach((cell) => {
        const free = this.freeSpaces()
          .filter(([y, x]) => x == cell.posX && y > cell.posY)
          .reverse()[0];

        if (cell.posY == 3) return;

        if (this.gameBoard[cell.posY + 1][cell.posX] == cell.val) {
          cell.val += cell.val;
          this.updateGameBoard(cell, [cell.posY + 1, cell.posX], true);
        } else if (
          free &&
          free[0] < 3 &&
          this.gameBoard[free[0] + 1][free[1]] == cell.val
        ) {
          cell.val += cell.val;
          this.updateGameBoard(cell, [free[0] + 1, free[1]], true);
        } else if (free && cell.posY < free[0]) {
          this.updateGameBoard(cell, free);
        }
      });
  };

  moveLeft = () => {
    this.cellsToMove().forEach((cell) => {
      const free = this.freeSpaces().filter(
        ([y, x]) => y == cell.posY && x < cell.posX
      )[0];

      if (cell.posX == 0) return;

      if (this.gameBoard[cell.posY][cell.posX - 1] == cell.val) {
        cell.val += cell.val;
        this.updateGameBoard(cell, [cell.posY, cell.posX - 1], true);
      } else if (
        free &&
        free[1] > 0 &&
        this.gameBoard[free[0]][free[1] - 1] == cell.val
      ) {
        cell.val += cell.val;
        this.updateGameBoard(cell, [free[0], free[1] - 1], true);
      } else if (free && cell.posX > free[1]) {
        this.updateGameBoard(cell, free);
      }
    });
  };

  moveRight = () => {
    this.cellsToMove()
      .reverse()
      .forEach((cell) => {
        const free = this.freeSpaces()
          .filter(([y, x]) => y == cell.posY && x > cell.posX)
          .reverse()[0];

        if (cell.posX == 3) return;

        if (this.gameBoard[cell.posY][cell.posX + 1] == cell.val) {
          cell.val += cell.val;
          this.updateGameBoard(cell, [cell.posY, cell.posX + 1], true);
        } else if (
          free &&
          free[1] < 3 &&
          this.gameBoard[free[0]][free[1] + 1] == cell.val
        ) {
          cell.val += cell.val;
          this.updateGameBoard(cell, [free[0], free[1] + 1], true);
        } else if (free && cell.posX < free[1]) {
          this.updateGameBoard(cell, free);
        }
      });
  };

  updateGameBoard = (cell, target, summed = false) => {
    const { posX, posY, val } = cell;
    const [targetY, targetX] = target;

    this.gameBoard[posY][posX] = 0;
    this.gameBoard[targetY][targetX] = val;

    this.moved = true;
    this.tiles
      .filter(({ x, y }) => x == posX && y == posY)[0]
      .newPosition(targetX, targetY);

    if (summed) {
      const [tileOne, tileTwo] = this.tiles.filter(
        ({ x, y }) => x == targetX && y == targetY
      );

      this.tilesToDelete.push(tileOne.id);
      this.tilesToDelete.push(tileTwo.id);

      this.tilesToCreate.push({
        val: val,
        y: targetY,
        x: targetX,
        id: this.newId(),
      });
    }
  };

  deleteTiles = () => {
    Promise.all(
      document.getAnimations().map((animation) => animation.finished)
    ).then(() => {
      this.tilesToDelete.forEach((id) => {
        const toDelete = this.tiles.find((tile) => tile.id === id);
        toDelete.delete();
      });
      this.tiles = this.tiles.filter(
        (tile) => !this.tilesToDelete.includes(tile.id)
      );

      this.tilesToCreate.forEach(({ y, x, val, id }) => {
        this.tiles.push(new Tile(val, x, y, id));
      });

      this.tilesToCreate = [];
      this.tilesToDelete = [];
    });
  };

  cellsToMove = () => {
    const cells = this.gameBoard
      .flat()
      .map((val, i) => {
        if (val !== 0)
          return { val: val, posY: Math.floor(i / 4), posX: i % 4 };
      })
      .filter((cell) => cell !== undefined);
    return cells;
  };
}

const game = new Game();
document.addEventListener("keydown", (e) => {
  e.preventDefault();
  game.move(e.key);
});
