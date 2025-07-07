import { getUsers, upsertUser } from "../api/leaderboard";

export type Player = {
  id?: number;
  name: string;
  highestScore: number;
};

export default class GameManager {
  private static instance: GameManager;

  public currentUserName: string = "";
  public currScore: number = 0;
  public currHighestScore: number = 0;

  public player?: Player = undefined;

  public players: Player[] = [];
  public gravity: number = 120;
  public currScene: string = "";

  private notifyCallback?: () => void;
  private notify() {
    this.notifyCallback?.();
  }

  private constructor() {}

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  setGravityFromLabel(label: "low" | "medium" | "high") {
    const values = { low: 120, medium: 160, high: 180 };
    this.gravity = values[label];
  }

  setScene(scene: "scene-game" | "scene-main-menu" | "scene-game-over") {
    this.currScene = scene;
  }

  onNotify(cb: () => void) {
    this.notifyCallback = cb;
  }

  async setUser(name: string) {
    const _user = await upsertUser(name);
    this.player = _user;

    this.currentUserName = name;
    this.currScore = 0;
    this.notify();
  }

  async updateScore(score: number) {
    if (this.player) {
      this.currScore = score;
      if (this.currScore > this.player.highestScore) {
        this.currHighestScore = this.currScore;
        this.player.highestScore = this.currScore;
        await upsertUser(this.player.name, this.currScore);
        this.notify();
      }
    }
  }

  setTempScore(score: number) {
    if (this.player) {
      this.currScore = score;
    }
  }

  async updateLeaderBoard() {
    if (this.player && this.player.highestScore < this.currHighestScore) {
      await upsertUser(this.player.name, this.currHighestScore);
      this.notify();
    }
  }

  async getLeaderboard(): Promise<Player[]> {
    const _users = await getUsers();
    this.players = _users;
    return this.players.sort((a, b) => b.highestScore - a.highestScore) ?? [];
  }

  getCurrenScene(): string {
    return this.currScene;
  }

  getCurrentUser(): Player | undefined {
    return this.player;
  }

  async clear() {
    this.currScore = 0;
    this.currHighestScore = 0;
    this.player = undefined;
    this.players = await getUsers();
    this.notify();
  }
}
