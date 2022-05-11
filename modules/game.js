import Tile from "./tile.js";

export default class Game {
  constructor() {
    this.newTile();
    this.newTile();

    this.loadBestScore();
  }

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  tiles = [];
  tilesToDelete = [];
  tilesToCreate = [];
  previousBoard = [];
  score = 0;
  prevScore = 0;
  moved = false;

  touchStartX;
  touchStartY;
  touchEndX;
  touchEndY;

  newTile = () => {
    const val = Math.random() < 0.9 ? 2 : 4;
    const randomPos = Math.floor(Math.random() * this.freeSpaces().length);
    const [posY, posX] = this.freeSpaces()[randomPos];
    const tileId = this.newId();

    this.board[posY][posX] = val;
    this.tiles.push(new Tile(val, posX, posY, tileId));

    this.moved = false;
  };

  newId = () => {
    return this.tiles.length == 0 ? 0 : this.tiles.slice(-1)[0].id + 1;
  };

  freeSpaces = () => {
    const free = this.board
      .flat()
      .map((cell, i) => {
        if (cell == 0) return [Math.floor(i / 4), i % 4];
      })
      .filter((cell) => cell !== undefined);
    return free;
  };

  touchStart = (e) => {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  };

  touchEnd = (e) => {
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;

    const dirX = this.touchStartX - this.touchEndX;
    const dirY = this.touchStartY - this.touchEndY;

    if (Math.abs(dirX) > Math.abs(dirY) && dirX > 0) this.move("ArrowLeft");
    if (Math.abs(dirX) > Math.abs(dirY) && dirX < 0) this.move("ArrowRight");
    if (Math.abs(dirX) < Math.abs(dirY) && dirY > 0) this.move("ArrowUp");
    if (Math.abs(dirX) < Math.abs(dirY) && dirY < 0) this.move("ArrowDown");
  };

  move = (direction) => {
    if (this.moved) return;

    switch (direction) {
      case "ArrowLeft":
        this.moveLeft();
        this.deleteTiles();
        break;
      case "ArrowUp":
        this.moveUp();
        this.deleteTiles();
        break;
      case "ArrowRight":
        this.moveRight();
        this.deleteTiles();
        break;
      case "ArrowDown":
        this.moveDown();
        this.deleteTiles();
        break;
    }
    if (!this.legalMoves()) {
      this.gameOverScreen(false);
    }
  };

  moveUp = () => {
    this.cellsToMove().forEach((cell) => {
      const free = this.freeSpaces().filter(
        ([y, x]) => x == cell.posX && y < cell.posY
      )[0];

      const isSummed =
        this.tilesToCreate.filter(
          ({ x, y }) => free && y == free[0] - 1 && x == free[1]
        ).length == 0;

      if (cell.posY == 0) return;

      if (this.board[cell.posY - 1][cell.posX] == cell.val) {
        this.saveBoard();
        cell.val += cell.val;
        this.updateScore(cell.val);
        this.updateBoard(cell, [cell.posY - 1, cell.posX], true);
      } else if (
        free &&
        free[0] > 0 &&
        this.board[free[0] - 1][free[1]] == cell.val &&
        isSummed
      ) {
        this.saveBoard();
        cell.val += cell.val;
        this.updateScore(cell.val);
        this.updateBoard(cell, [free[0] - 1, free[1]], true);
      } else if (free && cell.posY > free[0]) {
        this.saveBoard();
        this.updateBoard(cell, free);
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

        const isSummed =
          this.tilesToCreate.filter(
            ({ x, y }) => free && y == free[0] + 1 && x == free[1]
          ).length == 0;

        if (cell.posY == 3) return;

        if (this.board[cell.posY + 1][cell.posX] == cell.val) {
          this.saveBoard();
          cell.val += cell.val;
          this.updateScore(cell.val);
          this.updateBoard(cell, [cell.posY + 1, cell.posX], true);
        } else if (
          free &&
          free[0] < 3 &&
          this.board[free[0] + 1][free[1]] == cell.val &&
          isSummed
        ) {
          this.saveBoard();
          cell.val += cell.val;
          this.updateScore(cell.val);
          this.updateBoard(cell, [free[0] + 1, free[1]], true);
        } else if (free && cell.posY < free[0]) {
          this.saveBoard();
          this.updateBoard(cell, free);
        }
      });
  };

  moveLeft = () => {
    this.cellsToMove().forEach((cell) => {
      const free = this.freeSpaces().filter(
        ([y, x]) => y == cell.posY && x < cell.posX
      )[0];

      const isSummed =
        this.tilesToCreate.filter(
          ({ x, y }) => free && y == free[0] && x == free[1] - 1
        ).length == 0;

      if (cell.posX == 0) return;

      if (this.board[cell.posY][cell.posX - 1] == cell.val) {
        this.saveBoard();
        cell.val += cell.val;
        this.updateScore(cell.val);
        this.updateBoard(cell, [cell.posY, cell.posX - 1], true);
      } else if (
        free &&
        free[1] > 0 &&
        this.board[free[0]][free[1] - 1] == cell.val &&
        isSummed
      ) {
        this.saveBoard();
        cell.val += cell.val;
        this.updateScore(cell.val);
        this.updateBoard(cell, [free[0], free[1] - 1], true);
      } else if (free && cell.posX > free[1]) {
        this.saveBoard();
        this.updateBoard(cell, free);
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

        const isSummed =
          this.tilesToCreate.filter(
            ({ x, y }) => free && y == free[0] && x == free[1] + 1
          ).length == 0;

        if (cell.posX == 3) return;

        if (this.board[cell.posY][cell.posX + 1] == cell.val) {
          this.saveBoard();
          cell.val += cell.val;
          this.updateScore(cell.val);
          this.updateBoard(cell, [cell.posY, cell.posX + 1], true);
        } else if (
          free &&
          free[1] < 3 &&
          this.board[free[0]][free[1] + 1] == cell.val &&
          isSummed
        ) {
          this.saveBoard();
          cell.val += cell.val;
          this.updateScore(cell.val);
          this.updateBoard(cell, [free[0], free[1] + 1], true);
        } else if (free && cell.posX < free[1]) {
          this.saveBoard();
          this.updateBoard(cell, free);
        }
      });
  };

  updateBoard = (cell, target, summed = false) => {
    const { posX, posY, val } = cell;
    const [targetY, targetX] = target;

    this.board[posY][posX] = 0;
    this.board[targetY][targetX] = val;

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
      });
    }
  };

  updateScore = (val) => {
    const currScore = document.querySelector("#score");
    const bestScore = document.querySelector("#best-score");

    this.score += val;
    currScore.innerHTML = this.score;

    if (localStorage.getItem("bestScore") < this.score) {
      bestScore.innerHTML = this.score;
      localStorage.setItem("bestScore", this.score);
    }
  };

  loadBestScore = () => {
    const bestScore = document.querySelector("#best-score");

    if (!localStorage.getItem("bestScore")) {
      localStorage.setItem("bestScore", 0);
    } else {
      bestScore.innerHTML = localStorage.getItem("bestScore");
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

      this.tilesToCreate.forEach(({ y, x, val }) => {
        this.tiles.push(new Tile(val, x, y, this.newId()));
      });

      this.tilesToDelete = [];
      this.tilesToCreate = [];

      if (this.moved) {
        this.newTile();
      }
    });
  };

  cellsToMove = () => {
    const cells = this.board
      .flat()
      .map((val, i) => {
        if (val !== 0)
          return { val: val, posY: Math.floor(i / 4), posX: i % 4 };
      })
      .filter((cell) => cell !== undefined);
    return cells;
  };

  newGame = () => {
    this.gameOverScreen(true);

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.clearInfo();
    const currScore = document.querySelector("#score");
    currScore.innerHTML = this.score;

    this.newTile();
    this.newTile();
  };

  saveBoard = () => {
    if (
      this.moved ||
      this.previousBoard.flat().join("") === this.board.flat().join("")
    ) {
      return;
    }
    this.previousBoard = JSON.parse(JSON.stringify(this.board));
    this.prevScore = this.score;
  };

  loadBoard = () => {
    if (!this.previousBoard.length) return;

    const currScore = document.querySelector("#score");

    this.board = JSON.parse(JSON.stringify(this.previousBoard));
    this.clearInfo();

    this.board.flat().forEach((value, i) => {
      if (value) {
        this.tiles.push(
          new Tile(value, i % 4, Math.floor(i / 4), this.newId())
        );
      }
    });

    currScore.innerHTML = this.score = this.prevScore;
  };

  clearInfo = () => {
    this.tiles.forEach((tile) => tile.delete());

    this.score = 0;
    this.tiles = [];
    this.tilesToDelete = [];
    this.tilesToCreate = [];
    this.moved = false;
  };

  legalMoves = () => {
    const arr = this.board.flat();

    if (arr.includes(0)) return true;

    for (let i = 0; i < arr.length - 1; i++) {
      if ((i % 4 !== 3 && arr[i] == arr[i + 1]) || arr[i] == arr[i + 4]) {
        return true;
      }
    }

    return false;
  };

  gameOverScreen = (boolean) => {
    const appear = [{ opacity: "0" }, { opacity: "1" }];
    const disappear = [{ opacity: "1" }, { opacity: "0" }];
    const options = { duration: 300, fill: "forwards" };
    const screen = document.querySelector("#game-over");

    if (boolean && window.getComputedStyle(screen).opacity == 0) return;
    if (!boolean && window.getComputedStyle(screen).opacity == 1) return;

    boolean
      ? screen.animate(disappear, options)
      : screen.animate(appear, options);
  };
}
