function preloadEntities() {
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

  const car = new Player(
    "car",
    carTile,
    { width: UNIT_SIZE * 2, height: UNIT_SIZE * 2 },
    true
  );

  const roadTile = new Tileset({
    imageSource: "./assets/toon_road.png",
    originalTileWidth: 2048,
    originalTileHeight: 1500,
    tilesetColumns: 1,
    tilesetRows: 1,
    canvasTileSize: UNIT_SIZE,
    xZero: 0,
    yZero: 0,
  });

  const road0 = new Road(
    "road0",
    roadTile,
    { width: 0, height: 0 },
    true,
    UNIT_SIZE / 6
  );

  const road1 = new Road(
    "road1",
    roadTile,
    { width: 0, height: 0 },
    true,
    UNIT_SIZE / 6
  );

  gameManager.addEntity(road0, "road0");
  gameManager.addEntity(road1, "road1");
  createHoles();
  gameManager.addEntity(car, "car");
}

function createHoles() {
  const holeTile = new Tileset({
    imageSource: "./assets/hole.png",
    originalTileWidth: 200,
    originalTileHeight: 200,
    tilesetColumns: 1,
    tilesetRows: 1,
    canvasTileSize: UNIT_SIZE,
    xZero: 0,
    yZero: 0,
  });
  gameManager.addCategory("hole");

  gameManager.HOLE_COUNT = 10;

  for (let i = 0; i < gameManager.HOLE_COUNT; i++) {
    const holeID = "hole" + i;
    const newHole = new Hole(
      holeID,
      holeTile,
      { width: -1000, height: -1000 },
      true,
      UNIT_SIZE / 6
    );
    gameManager.addEntity(newHole, holeID);
    gameManager.addEntityToCategory("hole", holeID);
    newHole.setPosition({ x: -width * 4, y: -height * 4 });
  }
}

function setupEntities() {
  gameManager.setPosition({ x: width / 2, y: height / 2 });

  const car = gameManager.entities.get("car");
  car.addAnimation("static", [0], 0);
  car.setCurrentAnimation("static");

  const road0 = gameManager.entities.get("road0");
  road0.size = { width: width * 0.7, height: height };
  road0.rotation = PI / 2;
  road0.setPosition({ x: 0, y: 0 });
  road0.addAnimation("static", [0], 0);
  road0.setCurrentAnimation("static");

  const road1 = gameManager.entities.get("road1");
  road1.size = { width: width * 0.7, height: height };
  road1.rotation = PI / 2;
  road1.setPosition({
    x: 0,
    y: road0.position.y - road0.size.height,
  });
  road1.addAnimation("static", [0], 0);
  road1.setCurrentAnimation("static");

  for (let i = 0; i < gameManager.HOLE_COUNT; i++) {
    const holeID = "hole" + i;
    const hole = gameManager.entities.get(holeID);
    hole.size = { width: UNIT_SIZE / 3, height: UNIT_SIZE / 3 };
    hole.addAnimation("static", [0], 0);
    hole.setCurrentAnimation("static");
  }
}
