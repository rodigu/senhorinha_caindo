function preloadEntities() {
  const car = Player.createPlayer(gameManager);

  const roadTile = new Tileset({
    imageSource: "./assets/toon_road.png",
    originalTileWidth: 500,
    originalTileHeight: 500,
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
    UNIT_SIZE / 6
  );

  const road1 = new Road(
    "road1",
    roadTile,
    { width: 0, height: 0 },
    UNIT_SIZE / 6
  );

  gameManager.addEntity(road0, "road0");
  gameManager.addEntity(road1, "road1");
  createHoles();
  gameManager.addEntity(car, "car", 2);

  gameManager.addState("reset", (m) => {
    m.reset();
    m.setCurrentState("game");
  });
  gameManager.addBehavior("resetting", (m) => {
    // if (m.hasEvent(Player.Events.FALL)) m.setCurrentState("reset");
  });
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
      UNIT_SIZE / 6
    );
    const holeCollision = new Collisions(
      newHole,
      new Set(["car"]),
      new Set(["hole"])
    );
    const holeCollider = new Collider(
      "circle",
      {
        x: 0,
        y: 0,
        radius: newHole.size.width,
      },
      [{ x: 0, y: 0 }]
    );
    holeCollision.addCollider(holeCollider);
    newHole.addCollision(holeCollision);

    gameManager.addEntity(newHole, holeID);
    gameManager.addEntityToCategory("hole", holeID);
    newHole.setPosition({ x: -width * 4, y: -height * 4 });
  }
}

function setupEntities() {
  gameManager.setPosition({ x: width / 2, y: height / 2 });

  const car = gameManager.entities.get("car");
  car.setup();

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
