import Game from "./modules/game.js";

const game = new Game();

const newGame = document.querySelector("#new-game");

document.addEventListener("keydown", (e) => {
  game.move(e.key);
});

newGame.addEventListener("click", () => {
  game.newGame();
});
