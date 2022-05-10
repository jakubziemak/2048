import Game from "./modules/game.js";

const game = new Game();
document.addEventListener("keydown", (e) => {
  e.preventDefault();
  game.move(e.key);
});
