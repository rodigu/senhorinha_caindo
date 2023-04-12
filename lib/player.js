class Player extends Entity {
  static Events = {
    FALL: "fall into hole",
    HIT: "hit a hole",
  };
  /**
   * Creates an instance of Player.
   * @date 4/10/2023 - 2:43:22 PM
   *
   * @constructor
   * @param {string} id Player entity ID
   * @param {Tileset} tileset Tileset to be used by the player
   * @param {{width: number, height: number}} size Player entity size
   */
  constructor(id, tileset, size) {
    super(id, tileset, size);
    this.movementVector = {};
    this.move = {
      startFrame: 0,
    };
    this.isAccelerating = false;
    this.speed = 0;
    this.maxSpeed = UNIT_SIZE;
    this.animations = new Map();
    this.isFollowingMouse = false;
    this.particles = new Set();
    this.hearts = [];
    this.health = 3;

    this.buracosDesviados = -10;
  }

  preload() {
    this.buracosDesviados = -10;
    super.preload({ x: -1000, y: -1000 });
    this.movementVector = createVector(0, 0);

    this.animations.set(
      "turn right",
      Animate.getAnimation(this, Animate.turn, {
        func: Animate.linearFunc,
        funcArgs: 1,
      })
    );
    this.animations.set(
      "turn left",
      Animate.getAnimation(this, Animate.turn, {
        func: Animate.linearFunc,
        funcArgs: -1,
      })
    );

    this.collision.colliders[0].shapeArgs = {
      x: 0,
      y: 0,
      radius: this.size.width / 4,
    };
  }

  currentSpeed() {
    return (
      (UNIT_SIZE * 0.15) /
      (1 + exp(UNIT_SIZE * 0.02 - (frameCount - this.move.startFrame)))
    );
  }

  movement() {
    if (this.position.x <= -1000 && this.position.y <= -1000)
      this.position = createVector(0, UNIT_SIZE * 4);

    if (mouseIsPressed) {
      const mouseVector = createVector(
        this.manager.mouseX,
        this.manager.mouseY
      );
      if (this.move.startFrame === 0) this.move.startFrame = frameCount;
      const difference = p5.Vector.sub(this.position, mouseVector);
      difference.normalize();
      difference.rotate(PI);

      difference.mult(this.currentSpeed());
      this.addParticle(difference.y);

      if (this.position.dist(mouseVector) > UNIT_SIZE / 10) {
        this.position.add(difference);
        this.isFollowingMouse = true;
      } else {
        this.move.startFrame = frameCount;
        this.isFollowingMouse = false;
      }
    } else {
      this.move.startFrame = 0;
      this.isFollowingMouse = false;
    }
  }

  addParticle(ySpeed) {
    if (this.particles.size > 40 || Math.random() < 0.6) return;
    const lifeTime = Animate.randint(60, 100);
    const position = { x: 0, y: (2 * this.size.height) / 5 };
    const size = { width: 0 };
    size.height = size.width;
    const colors = { r: 100, g: 100, b: 100, a: 250 };

    const growthFunction = Animate.getAnimation(
      Animate.stretch,
      {
        func: Animate.linear,
        funcArgs: {
          a: Animate.random(0.1, 0.5),
          b: Animate.random(this.size.height / 6, this.size.height / 15),
        },
      },
      ["width"]
    );

    const fadeOut = Animate.getAnimation(
      Animate.changeColors,
      {
        func: Animate.linear,
        funcArgs: { a: Animate.random(-15, -25), b: 250 },
      },
      ["a"]
    );

    const moveOutX = Animate.getAnimation(
      Animate.move,
      {
        func: Animate.linear,
        funcArgs: { a: Animate.random(-1, 1), b: Animate.random(-5, 5) },
      },
      ["x"]
    );

    const ySpeedModifier = ySpeed > 0 ? ySpeed : 0;

    const moveOutY = Animate.getAnimation(
      Animate.move,
      {
        func: Animate.linear,
        funcArgs: {
          a: Animate.random(UNIT_SIZE / 20, UNIT_SIZE / 19) + ySpeedModifier,
          b: position.y,
        },
      },
      ["y"]
    );

    const particle = new Particle(
      lifeTime,
      this.position.copy(),
      this.rotation ?? 0,
      position,
      [fadeOut, growthFunction, moveOutX, moveOutY],
      size,
      colors
    );

    this.particles.add(particle);
  }

  rotate() {
    if (this.isFollowingMouse) {
      const mouseVector = createVector(
        this.manager.mouseX,
        this.manager.mouseY
      );

      let multiplier = 1;

      if (
        Math.sign(this.rotation) !== Math.sign(mouseVector.x) &&
        Math.abs(this.rotation) > PI / 70
      )
        multiplier = 10;

      if (Math.abs(mouseVector.x - this.position.x) > this.size.width / 20)
        this.rotation +=
          (multiplier *
            (Math.sign((PI * (mouseVector.x - this.position.x)) / width) *
              PI)) /
          70;
    } else {
      if (this.rotation < -PI / 90) this.rotation += PI / 50;
      else if (this.rotation > PI / 90) this.rotation -= PI / 50;
    }

    if (this.rotation > PI / 7) this.rotation = PI / 7;
    else if (this.rotation < -PI / 7) this.rotation = -PI / 7;
  }

  entityDraw() {
    super.draw();
  }

  draw() {
    this.currentState(this);
  }

  reset() {
    this.setState("default");
    this.health = 3;
    this.buracosDesviados = -10;
    for (const heart of this.hearts) heart.setCurrentAnimation("full");
    this.buracosDesviados = 0;
    this.position = createVector(0, UNIT_SIZE * 4);
  }

  setup() {
    this.addAnimation("static", [0], 0);
    this.setCurrentAnimation("static");
    for (const heart of this.hearts) {
      heart.addAnimation("full", [0], 0);
      heart.addAnimation("empty", [1], 0);
      heart.setCurrentAnimation("full");
    }
    this.hearts.forEach((heart, i) => {
      heart.position.x = width / 2 - UNIT_SIZE / 2;
      heart.position.y = -UNIT_SIZE + i * UNIT_SIZE;
    });
  }

  static createPlayer(manager) {
    const carTile = new Tileset({
      imageSource: "./assets/pug-dog-dancing.gif",
      originalTileWidth: 200,
      originalTileHeight: 186,
      tilesetColumns: 1,
      tilesetRows: 1,
      canvasTileSize: UNIT_SIZE,
      xZero: 0,
      yZero: 0,
    });

    const car = new Player("car", carTile, {
      width: UNIT_SIZE * 1,
      height: UNIT_SIZE * 1,
    });

    const heartTiles = new Tileset({
      imageSource: "./assets/heart.png",
      originalTileWidth: 200,
      originalTileHeight: 100,
      tilesetColumns: 2,
      tilesetRows: 1,
      canvasTileSize: UNIT_SIZE,
      xZero: 0,
      yZero: 0,
    });

    for (const hn of [1, 2, 3]) {
      const newHeart = new Entity(`heart${hn}`, heartTiles, {
        width: UNIT_SIZE,
        height: UNIT_SIZE,
      });
      car.hearts.push(newHeart);
      manager.addEntity(newHeart, `heart${hn}`, 3);
    }

    const spin = Animate.getAnimation(Animate.turn, {
      func: Animate.linear,
      funcArgs: {
        a: PI / 10,
        b: 0,
      },
    });

    const shrink = Animate.getAnimation(
      Animate.stretch,
      {
        func: Animate.linear,
        funcArgs: {
          a: -UNIT_SIZE / 30,
          b: car.size.width,
        },
      },
      ["width", "height"]
    );

    car.addState("spin", (c) => {
      c.entityDraw();
      if (c.manager.hasEvent(Player.Events.FALL)) {
        spin.apply(c);
        c.position.y -= c.manager.entities.get("road0").scrollSpeed;
      } else manager.setCurrentState("reset");
    });

    car.addState("default", (c) => {
      push();
      textSize(UNIT_SIZE / 3);
      textAlign(CENTER);
      text(c.buracosDesviados, 0, -height / 2 + UNIT_SIZE / 3);
      pop();
      for (const p of c.particles.values()) {
        p.draw();
        if (p.lifeTime <= 0 || p.color.a < 0) {
          c.particles.delete(p);
        }
      }
      if (c.collision.isColliding) {
        c.manager.addEvent(Player.Events.HIT, 10);
      }
      c.entityDraw();

      c.movement();
      c.rotate();

      if (c.manager.hasEvent(Player.Events.HIT)) {
        if (c.manager.getEventDuration(Player.Events.HIT) === 9) {
          c.health--;
          navigator.vibrate(200);
          for (let i = 0; i < 3; i++) {
            c.health > i
              ? c.hearts[i].setCurrentAnimation("full")
              : c.hearts[i].setCurrentAnimation("empty");
          }
        }
      }

      if (c.health <= 0) {
        c.manager.addEvent(Player.Events.FALL, 60);
        c.setState("spin");
      }
    });

    car.setState("default");

    const playerCollision = new Collisions(
      car,
      new Set(["hole"]),
      new Set(["car"])
    );
    const playerCollider = new Collider(
      "circle",
      {
        x: 0,
        y: 0,
        radius: car.size.width,
      },
      [{ x: 0, y: 0 }]
    );
    playerCollision.addCollider(playerCollider);
    car.addCollision(playerCollision);

    const shake = Animate.getAnimation(
      Animate.move,
      {
        func: Animate.sine,
        funcArgs: {
          a: 5,
          b: -1.3,
          c: 0,
          d: 0,
        },
      },
      ["x"]
    );

    manager.addBehavior("shaking", (m) => {
      if (m.hasEvent(Player.Events.HIT)) {
        const tempPos = { position: { x: m.x } };
        shake.apply(tempPos);
        m.position.x = width / 2 + tempPos.position.x;
      } else m.position.x = width / 2;
    });

    return car;
  }
}
