import Game from "./modules/game.js";

const root = document.querySelector(":root");
root.style.setProperty("--width", `${window.innerWidth - 32}px`);

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

document.addEventListener("touchstart", (e) => {
  game.touchStart(e);
});
document.addEventListener("touchend", (e) => {
  game.touchEnd(e);
});

window.addEventListener("resize", () => {
  root.style.setProperty("--width", `${window.innerWidth - 32}px`);
});
