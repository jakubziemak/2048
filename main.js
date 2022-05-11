import Game from "./modules/game.js";

const game = new Game();

const newGame = document.querySelector("#new-game");
const undo = document.querySelector("#undo");

document.addEventListener("keydown", (e) => {
  game.move(e.key);
});

newGame.addEventListener("click", () => {
  game.newGame();
});

undo.addEventListener("click", () => {
  game.loadBoard();
});
