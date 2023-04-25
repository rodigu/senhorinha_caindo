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
    textSize(UNIT_SIZE * 0.3);
    text("Tu caiu no buraco,", width / 2, height / 2 - UNIT_SIZE * 1.5);
    text("tal qual milhares de outros", width / 2, height / 2 - UNIT_SIZE);
    text(
      "trabalhadores em São Paulo.",
      width / 2,
      height / 2 - UNIT_SIZE * 0.5
    );

    text("Mas não se preocupe,", width / 2, height / 2 + UNIT_SIZE * 0.5);
    text(
      "o prefeito anunciou que vai tirar",
      width / 2,
      height / 2 + UNIT_SIZE
    );
    text(
      "dinheiro da moradia pra tapar buraco.",
      width / 2,
      height / 2 + UNIT_SIZE * 1.5
    );
    pop();
    if (mouseIsPressed) {
      manager.reset();
      manager.setCurrentState("game");
    }
  });
}
