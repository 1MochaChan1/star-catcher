import GameManager from "../global/game-manager";

export class GameOver extends Phaser.Scene {
  constructor() {
    super("scene-game-over");
  }

  preload() {
    this.load.image("sky", "/assets/day-clouds.PNG");
  }

  async create() {
    const gm = GameManager.getInstance();
    gm.setScene("scene-game-over");
    await gm.updateLeaderBoard();
    const { width, height } = this.scale;

    // Background
    const bg = this.add.image(width / 2, 160, "sky");
    bg.scale = 0.25;
    bg.setAlpha(0.75);

    // Title
    this.add
      .text(width / 2, 100, "Game Over", {
        fontSize: "32px",
        fontStyle: "bold",
        color: "red",
      })
      .setOrigin(0.5);

    // Final Score
    this.add
      .text(width / 2, height / 2 - 20, `Your Score: ${gm.currScore}`, {
        fontSize: "20px",
        color: "white",
      })
      .setOrigin(0.5);

    // Play Again Button
    const playAgainBtn = this.add
      .text(width / 2, height / 2 + 40, "Play Again", {
        fontSize: "18px",
        backgroundColor: "#333",
        color: "#fff",
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5)
      .setInteractive();

    playAgainBtn.on("pointerdown", () => {
      gm.currScore = 0;
      gm.currHighestScore = 0;
      this.scene.start("scene-game");
    });

    // Back to Menu Button
    const menuBtn = this.add
      .text(width / 2, height / 2 + 90, "Back to Menu", {
        fontSize: "16px",
        backgroundColor: "#444",
        color: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

    menuBtn.on("pointerdown", async () => {
      await gm.clear()
      this.scene.start("scene-main-menu");
    });
  }
}
