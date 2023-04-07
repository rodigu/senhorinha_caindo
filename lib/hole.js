class Hole extends Road {
  constructor(id, tileset, size, isShown = false, scrollSpeed = 1) {
    super(id, tileset, size, isShown, scrollSpeed);
  }

  static randomPosition(hole) {
    return {
      x: Animate.random(-Hole.roadWidth, Hole.roadWidth),
      y: Animate.random(-5 * height, -height / 2 - hole.size.height),
    };
  }

  static randomSize() {
    const r = Animate.random(UNIT_SIZE / 2, 1.5 * UNIT_SIZE);
    return {
      width: r,
      height: r,
    };
  }

  static roadWidth = undefined;

  preload() {
    super.preload({ x: 10000, y: 10000 });
  }

  scroll() {
    const { x, y } = this.manager.mouseVector;
    if (x * x + y * y <= this.size.width) console.log("in", this.id);
    Hole.roadWidth ??= this.manager.entities.get("road0").size.width / 2;
    this.position.y += this.scrollSpeed;
    if (this.position.y - this.size.height / 2 >= height / 2) {
      this.setPosition(Hole.randomPosition(this));
      this.size = Hole.randomSize();
    }
  }
}
