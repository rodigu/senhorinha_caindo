class Player extends Entity {
  constructor(id, tileset, size, isShown = false) {
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
    super.preload({ x: -100, y: -100 });
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
  }

  currentSpeed() {
    return (
      (UNIT_SIZE * 0.15) /
      (1 + exp(UNIT_SIZE * 0.02 - (frameCount - this.move.startFrame)))
    );
  }

  movement() {
    if (this.position.x <= -100 && this.position.y <= -100)
      this.position = createVector(width / 2, UNIT_SIZE * 8);

    if (mouseIsPressed) {
      const mouseVector = createVector(mouseX, mouseY);
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
        mouseX - this.position.x,
        mouseY - this.position.y
      );
      const positionAsOrigin = createVector(0, -1);
      const angleBetweenMouseAndPlayer =
        mouseVector.angleBetween(positionAsOrigin);
      if (Math.abs(angleBetweenMouseAndPlayer) > PI / 15)
        this.rotation -= (Math.sign(angleBetweenMouseAndPlayer) * PI) / 30;
    } else {
      if (this.rotation < -PI / 50) this.rotation += PI / 25;
      else if (this.rotation > PI / 50) this.rotation -= PI / 25;
    }

    if (this.rotation > PI / 6) this.rotation = PI / 6;
    else if (this.rotation < -PI / 6) this.rotation = -PI / 6;

    // if (Math.abs(this.rotation) > PI / 60)
  }

  draw() {
    // stroke(255, 100, 100);
    // strokeWeight(10);
    // fill(255);
    // text(`${mouseVector.angleBetween(positionAsOrigin) / PI}`, 30, 30);
    // line(this.position.x, this.position.y, mouseX, mouseY);
    for (const p of this.particles.values()) {
      p.draw();
      if (p.lifeTime <= 0 || p.color.a < 0) {
        this.particles.delete(p);
      }
    }
    super.draw();

    this.movement();
    this.rotate();
  }
}
