class Player extends Entity {
  static Events = {
    FALL: "fall into hole",
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
    super(id, tileset, size, isShown);
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
  }

  preload() {
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
    if (this.position.x <= -100 && this.position.y <= -100)
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

  draw() {
    // stroke(255, 100, 100);
    // strokeWeight(10);
    // fill(255);
    // text(`${mouseVector.angleBetween(positionAsOrigin) / PI}`, 30, 30);
    // line(this.position.x, this.position.y, this.manager.mouseX, this.manager.mouseY);
    for (const p of this.particles.values()) {
      p.draw();
      if (p.lifeTime <= 0 || p.color.a < 0) {
        this.particles.delete(p);
      }
    }
    if (this.collision.isColliding) {
      this.manager.addEvent(Player.Events.FALL, 5);
    }
    super.draw();

    this.movement();
    this.rotate();
  }
}
