class Player extends Entity {
  constructor(tileset, size, isShown = false) {
    super(tileset, size, isShown);
    this.movementVector = {};
    this.move = {
      startFrame: 0,
    };
    this.isAccelerating = false;
    this.speed = 0;
    this.maxSpeed = UNIT_SIZE;
  }

  preload() {
    super.preload({ x: -100, y: -100 });
    this.movementVector = createVector(0, 0);
  }

  currentSpeed() {
    return (
      (UNIT_SIZE * 0.12) /
      (1 + exp(UNIT_SIZE * 0.02 - (frameCount - this.move.startFrame)))
    );
  }

  draw() {
    if (this.position.x <= -100 && this.position.y <= -100)
      this.position = createVector(width / 2, UNIT_SIZE * 8);
    super.draw();
    const mouseVector = createVector(mouseX, mouseY);
    if (mouseIsPressed) {
      if (this.move.startFrame === 0) this.move.startFrame = frameCount;
      const difference = p5.Vector.sub(this.position, mouseVector);
      difference.normalize();
      difference.rotate(PI);

      difference.mult(this.currentSpeed());

      if (this.position.dist(mouseVector) > UNIT_SIZE / 10)
        this.position.add(difference);
      else this.move.startFrame = frameCount;
    } else {
      this.move.startFrame = 0;
    }
  }
}
