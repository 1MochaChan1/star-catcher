import GameManager from "../global/game-manager";

export class Gameplay extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private star!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private starGroup!: Phaser.Physics.Arcade.Group;

  private spike!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private spikeGroup!: Phaser.Physics.Arcade.Group;

  private hearts!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private heartsGroup!: Phaser.Physics.Arcade.Group;

  private currScoreLabel!: Phaser.GameObjects.Text;
  private livesLabel!: Phaser.GameObjects.Text;

  private backButton!: Phaser.GameObjects.Text;

  gm!: GameManager;
  public speed: number = 500.0;
  private lives: number = 1;

  constructor() {
    super("scene-game");
  }

  preload() {
    // this.load.setBaseURL("https://labs.phaser.io");
    this.load.image("sky", "/assets/day-clouds.PNG");
    this.load.image("ground", "/assets/Ground-bg.png");
    this.load.image("heart", "/assets/heart.png");
    this.load.image("metal_beam", "/assets/metal-beam.png");
    this.load.image("player", "/assets/player.png");
    this.load.image("spikes", "/assets/spikes.png");
    this.load.image("star", "/assets/star.png");

    this.load.audio("heartSFX", "/assets/health.mp3");
    this.load.audio("explosionSFX", "/assets/explosion.mp3");
    this.load.audio("starSFX", "/assets/star.mp3");
  }

  async create() {
    this.lives = 1;
    this.gm = GameManager.getInstance();
    this.gm.setScene("scene-game");
    this.gm.currScore = 0;
    this.physics.world.gravity.y = this.gm.gravity;

    const bg = this.add.image(this.scale.width / 2, 160, "sky");
    bg.scale = 0.25;

    // SFX
    const heartSFX = this.sound.add("heartSFX");
    const explosionSFX = this.sound.add("explosionSFX");
    const starSFX = this.sound.add("starSFX");

    // PLAYER
    this.player = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height - 80,
      "player"
    );
    this.player.scale = 0.25;
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    // SPAWNABLES
    this.starGroup = this.spawnFallingGroup("star", 2, 0.15, (obj) => {
      const gmObj = obj as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      this.gm.setTempScore(this.gm.currScore + 1);
      this.gm.updateScore(this.gm.currScore + 1);
      gmObj.setPosition(this.getRandomX(), 0);
      starSFX.play();
    });

    this.spikeGroup = this.spawnFallingGroup(
      "spikes",
      2,
      0.15,
      (obj) => {
        const gmObj = obj as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this.lives--;
        gmObj.setPosition(this.getRandomX(), 0);
        explosionSFX.play();
      },
      this.gm.gravity
    );

    this.heartsGroup = this.spawnFallingGroup(
      "heart",
      2,
      0.1,
      (obj) => {
        const gmObj = obj as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this.lives++;
        gmObj.setPosition(this.getRandomX(), this.scale.height + 10);
        heartSFX.play();
      },
      this.gm.gravity
    );

    // INPUT
    this.cursors = this.input.keyboard!.createCursorKeys();

    // UI
    const score_beam = this.add.sprite(120, 60, "metal_beam");
    const health_beam = this.add.sprite(120, 120, "metal_beam");

    this.currScoreLabel = this.add.text(
      100,
      47,
      `⭐ ${this.gm.currScore.toString()}`
    );
    this.livesLabel = this.add.text(100, 107, `💓 ${this.lives} `);

    score_beam.scale = 0.35;
    health_beam.scale = 0.35;

    this.backButton = this.add
      .text(this.scale.width - 80, 60, "Back", {
        fontSize: "18px",
        backgroundColor: "#222",
        color: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

    this.backButton.on("pointerdown", async () => {
      await this.gm.clear();
      this.scene.start("scene-main-menu");
    });
  }

  async update() {
    if (this.lives <= 0) {
      this.scene.start("scene-game-over");
      return;
    }

    this.updateUI();
    this.respawnObjects();

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }
    this.player.setMaxVelocity(this.speed);
  }

  getRandomX() {
    return Math.floor(Math.random() * (this.scale.width - 100));
  }

  spawnFallingGroup(
    key: string,
    count: number,
    scale: number,
    onHit: (sprite: Phaser.GameObjects.GameObject) => void,
    gravity?: number
  ): Phaser.Physics.Arcade.Group {
    const group = this.physics.add.group({
      key,
      repeat: count - 1,
      setXY: { x: this.getRandomX(), y: 0 },
    });

    group.children.getArray().map((child) => {
      const sprite = child as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      sprite.setPosition(this.getRandomX(), 0);
      sprite.setScale(scale);
      sprite.body.allowGravity = true;
      sprite.body.setMaxVelocityY(gravity ?? this.gm.gravity);
      this.physics.add.overlap(this.player, sprite, (_player, obj) => {
        onHit(obj as Phaser.GameObjects.GameObject);
        // sprite.setPosition(this.getRandomX(), 0);
      });
    });

    return group;
  }

  respawnObjects() {
    this.starGroup.children.iterate((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.y >= this.scale.height) {
        sprite.setPosition(this.getRandomX(), 0);
      }
      return null;
    });

    this.spikeGroup.children.iterate((child) => {
      const sprite = child as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      if (sprite.y >= this.scale.height) {
        sprite.setPosition(this.getRandomX(), 0);
      }
      sprite.body.setMaxVelocityY(
        (this.gm.gravity * (this.gm.currScore + 1)) / 10
      );
      return null;
    });

    this.heartsGroup.children.iterate((child) => {
      if (this.lives < 3) {
        const sprite = child as Phaser.Physics.Arcade.Sprite;
        if (sprite.y >= this.scale.height) {
          sprite.setPosition(this.getRandomX(), 0);
        }
      }
      return null;
    });
  }

  updateUI() {
    this.currScoreLabel.setText(`⭐ ${this.gm.currScore.toString()}`);
    this.livesLabel.setText(`💓 ${this.lives} `);
  }
}
