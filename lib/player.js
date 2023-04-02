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
      (UNIT_SIZE * 0.12) /
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

  rotate() {
    if (this.isFollowingMouse) {
      const mouseVector = createVector(
        mouseX - this.position.x,
        mouseY - this.position.y
      );
      const positionAsOrigin = createVector(0, -1);
      const angle = mouseVector.angleBetween(positionAsOrigin);
      if (Math.abs(angle) > PI / 20)
        this.rotation -= (Math.sign(angle) * PI) / 30;
    } else {
      if (this.rotation < -PI / 50) this.rotation += PI / 25;
      else if (this.rotation > PI / 50) this.rotation -= PI / 25;
    }

    if (this.rotation > PI / 6) this.rotation = PI / 6;
    else if (this.rotation < -PI / 6) this.rotation = -PI / 6;
  }

  draw() {
    // stroke(255, 100, 100);
    // strokeWeight(10);
    // fill(255);
    // text(`${mouseVector.angleBetween(positionAsOrigin) / PI}`, 30, 30);
    // line(this.position.x, this.position.y, mouseX, mouseY);
    super.draw();

    this.movement();
    this.rotate();
  }
}
