class Road extends Entity {
  constructor(id, tileset, size, isShown = false, scrollSpeed = 1) {
    super(id, tileset, size, isShown);
    this.scrollSpeed = scrollSpeed;
  }

  scroll() {
    this.position.y += this.scrollSpeed;
    if (this.position.y - this.size.height / 2 >= height / 2)
      this.position.y = this.scrollSpeed - this.size.height;
  }

  draw() {
    super.draw();
    this.scroll();
  }
}
