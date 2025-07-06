type Player = {
  name: string;
  highestScore: number;
};

export default class GameManager {
  private static instance: GameManager;
  public currentUserName: string = "";
  public currScore: number = 0;
  public players: Player[] = [];
  public gravity: number = 120;
  public currScene: string = "";
  private constructor() {}

  setGravityFromLabel(label: "low" | "medium" | "high") {
    const values = { low: 120, medium: 160, high: 180 };
    this.gravity = values[label];
  }
  setScene(scene: "scene-game" | "scene-main-menu" | "scene-game-over") {
    this.currScene = scene;
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  setUser(name: string) {
    if (!this.players.find((p) => p.name === name)) {
      this.players.push({ name: name, highestScore: 0 });
    }
    this.currentUserName = name;
    this.currScore = 0;
  }

  updateScore(name: string, score: number) {
    const player = this.players.find((p) => p.name === name);
    if (player) {
      this.currScore = score;
      if (this.currScore > player.highestScore) {
        player.highestScore = this.currScore;
      }
    }
  }

  getLeaderboard(): Player[] {
    return [...this.players].sort((a, b) => b.highestScore - a.highestScore);
  }

  getCurrenScene(): string {
    return this.currScene;
  }

  getCurrentUser(): Player | undefined {
    return this.players.find((p) => p.name === this.currentUserName);
  }
}
