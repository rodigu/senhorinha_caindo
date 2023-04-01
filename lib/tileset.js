class Tileset {
  constructor(
    args = {
      imageSource: "",
      originalTileWidth: -1,
      originalTileHeight: -1,
      tilesetColumns: -1,
      tilesetRows: -1,
      canvasTileSize: -1,
      xZero: 0,
      yZero: 0,
    }
  ) {
    const {
      imageSource,
      originalTileWidth,
      originalTileHeight,
      tilesetColumns,
      tilesetRows,
      canvasTileSize,
      xZero,
      yZero,
    } = args;
    if (xZero === undefined) xZero = 0;
    if (yZero === undefined) yZero = 0;
    this.source = imageSource;
    this.originalTileWidth = originalTileWidth;
    this.originalTileHeight = originalTileHeight;
    this.numWid = tilesetColumns;
    this.numHei = tilesetRows;
    this.tileSize = canvasTileSize;
    this.xZero = xZero;
    this.yZero = yZero;
  }

  preload() {
    this.source = loadImage(this.source);
  }

  drawTile(n, x, y, size, imageModeString = -1) {
    if (n != -1) {
      let { tileX, tileY } = this.tileNumToPos(n);
      if (imageModeString) imageMode(imageModeString);
      image(
        this.source,
        x,
        y,
        size.width,
        size.height,
        tileX,
        tileY,
        this.originalTileWidth,
        this.originalTileHeight
      );
    }
  }

  tileNumToPos(n) {
    return {
      tileX: (n % this.numWid) * this.originalTileWidth,
      tileY: Math.floor(n / this.numWid) * this.originalTileHeight,
    };
  }

  drawMap(tileMap) {
    for (let y = 0; y < tileMap.length; y++) {
      for (let x = 0; x < tileMap[y].length; x++) {
        this.drawTile(
          tileMap[y][x],
          x * this.tileSize + this.xZero,
          y * this.tileSize + this.yZero,
          this.tileSize
        );
      }
    }
  }
}
