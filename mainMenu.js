function setupMainMenu() {
  gameManager.addState("menu", (manager) => {
    background(254, 0, 0);
    push();
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(UNIT_SIZE * 0.7);
    text("SUPER MOTOCA RACER 2023", width / 2, height / 2 - UNIT_SIZE * 0.7);
    textSize(UNIT_SIZE / 3);
    text("toque/clique para jogar!", width / 2, height / 2 + UNIT_SIZE * 2);
    pop();
    if (mouseIsPressed) manager.setCurrentState("game");
  });

  gameManager.addState("instrucoes", (manager) => {
    background(254, 0, 0);
    push();
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(UNIT_SIZE * 0.7);
    text("SUPER MOTOCA RACER 2023", width / 2, height / 2 - UNIT_SIZE * 0.7);
    textSize(UNIT_SIZE / 3);
    text("toque/clique para jogar!", width / 2, height / 2 + UNIT_SIZE * 2);
    pop();
    if (mouseIsPressed) manager.setCurrentState("game");
  });

  gameManager.addState("lose", (manager) => {
    background(0);
    push();
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(UNIT_SIZE * 0.5);
    text(
      "Tu caiu no buraco, tal qual milhares de outros trabalhadores em São Paulo.",
      0,
      height / 2 - UNIT_SIZE,
      width,
      UNIT_SIZE * 3
    );

    text(
      "Mas não se preocupe, o prefeito anunciou que vai tirar dinheiro da moradia pra tapar buraco.",
      0,
      height / 2 + UNIT_SIZE,
      width,
      UNIT_SIZE * 3
    );

    pop();
    if (mouseIsPressed) {
      manager.reset();
      manager.setCurrentState("game");
    }
  });
}
