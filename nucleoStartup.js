function nucleoStartup() {
  const logoTile = new Tileset({
    imageSource: gameManager.assetsConfig.logo.local,
    originalTileWidth: gameManager.assetsConfig.logo.largura,
    originalTileHeight: gameManager.assetsConfig.logo.altura,
    tilesetColumns: 1,
    tilesetRows: 1,
    canvasTileSize: UNIT_SIZE,
    xZero: 0,
    yZero: 0,
  });

  const logoNucleo = new Entity(`logo-nucleo`, logoTile, {
    width: UNIT_SIZE,
    height: UNIT_SIZE,
  });

  logoNucleo.addAnimation("static", [0], 0);
  logoNucleo.setCurrentAnimation("static");

  logoNucleo.preload();

  const fadeOut = Animate.getAnimation(
    Animate.changeColors,
    {
      func: Animate.linear,
      funcArgs: { a: -5, b: 250 },
    },
    ["a"]
  );

  gameManager.addState("intro", (manager) => {
    background(0);
    if (logoNucleo.color.a < 0) manager.setCurrentState("menu");
    fadeOut.apply(logoNucleo);
    logoNucleo.setPosition({ x: width / 2, y: height / 2 });
    logoNucleo.draw();
  });
  gameManager.setCurrentState("intro");
}
