const UNIT_SIZE = window.innerHeight / 10;
const gameManager = new GameManager(UNIT_SIZE);

function setup() {
  let canvasWidth = window.innerWidth;
  if (window.innerHeight < window.innerWidth)
    canvasWidth = (2 * window.innerHeight) / 3;
  createCanvas(canvasWidth, window.innerHeight);
  noSmooth();
}

function preload() {
  setupEntities();
  gameManager.preload();
}

function draw() {
  background(10);
  gameManager.drawEntities();
}
