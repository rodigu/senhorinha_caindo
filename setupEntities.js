function setupEntities() {
  const carTile = new Tileset({
    imageSource: "./assets/car.png",
    originalTileWidth: 256,
    originalTileHeight: 256,
    tilesetColumns: 1,
    tilesetRows: 1,
    canvasTileSize: UNIT_SIZE,
    xZero: 0,
    yZero: 0,
  });
  const car = new Player(carTile, UNIT_SIZE, true);

  car.addAnimation("static", [0], 0);
  car.setCurrentAnimation("static");

  gameManager.addEntity(car, "car");
}
