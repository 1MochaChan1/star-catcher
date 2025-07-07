import GameManager from "../global/game-manager";

export class MainMenu extends Phaser.Scene {
  private nameInput!: HTMLInputElement;
  private startButton!: Phaser.GameObjects.Text;
  private submitButton!: Phaser.GameObjects.Text;

  gm!: GameManager;

  constructor() {
    super("scene-main-menu");
  }

  preload() {
    this.load.image("sky", "/assets/day-clouds.PNG");
    this.gm = GameManager.getInstance();
  }

  async create() {
    this.gm.setScene("scene-main-menu");

    const { width, height } = this.scale;

    const bg = this.add.image(this.scale.width / 2, 160, "sky");
    bg.scale = 0.25;
    bg.setAlpha(0.75);

    // Heading
    this.add
      .text(width / 2, 100, "Star Catcher", {
        fontSize: "32px",
        fontStyle: "bold",
        color: "yellow",
      })
      .setOrigin(0.5);

    // Create DOM input element
    this.nameInput = document.createElement("input");
    this.nameInput.style.position = "absolute";
    this.nameInput.style.left = "50%";
    this.nameInput.style.top = "50%";
    this.nameInput.style.transform = "translate(-125%,-200%)";
    this.nameInput.style.width = "220px";
    this.nameInput.style.padding = "8px";
    this.nameInput.style.borderRadius = "6px";
    this.nameInput.style.border = "1px solid #ccc";
    this.nameInput.style.fontSize = "16px";

    document.body.appendChild(this.nameInput);

    // Submit Button
    this.submitButton = this.add
      .text(width / 2, height / 2 + 20, "Set Name", {
        fontSize: "18px",
        backgroundColor: "#222",
        color: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

    this.submitButton.on("pointerdown", async () => {
      const name = this.nameInput.value.trim();
      if (name) {
        await this.gm.setUser(name);
        this.gm.getCurrentUser()!.name = name;
        this.startButton.setAlpha(1).setInteractive();
      }
    });

    // Start Button (initially disabled)
    this.startButton = this.add
      .text(width / 2, height / 2 + 70, "Start Game", {
        fontSize: "20px",
        backgroundColor: "#555",
        color: "#fff",
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5)
      .setAlpha(0.5);

    this.startButton.on("pointerdown", async () => {
      const user = this.gm.getCurrentUser();
      if (user) {
        this.nameInput.remove(); // remove input from DOM
        this.scene.start("scene-game");
      }
    });
  }

  // Clean up DOM input if scene is stopped
  shutdown() {
    this.nameInput?.remove();
  }
}
