type Player = {
  name: string;
  highestScore: number;
};

export default class GameManager {
  private static instance: GameManager;
  public currentUserName: string = "";
  public currScore: number = 0;
  public players: Player[] = [];

  private constructor() {}

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

  getCurrentUser(): Player | undefined {
    return this.players.find((p) => p.name === this.currentUserName);
  }
}
