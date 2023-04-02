class Road extends Entity {
  constructor(id, tileset, size, isShown = false, scrollSpeed = 1) {
    super(id, tileset, size, isShown);
    this.scrollSpeed = scrollSpeed;
  }

  scroll() {
    this.position.y += this.scrollSpeed;
    if (this.position.y - this.size.height / 2 > height)
      this.position.y = -this.size.height / 2;
  }

  draw() {
    super.draw();
    this.scroll();
    stroke(255, 100, 100);
    strokeWeight(10);
  }
}
