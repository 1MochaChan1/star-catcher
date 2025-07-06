import Phaser from "phaser";
import { Gameplay } from "./scenes/Gameplay";
import { MainMenu } from "./scenes/MainMenu";
import { GameOver } from "./scenes/GameOver";

export const startPhaser = (parent: string) => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent,
    scene: [MainMenu, Gameplay, GameOver],
    physics: {
      default: "arcade",
    },
  });
};
