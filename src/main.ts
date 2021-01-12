import Phaser from "phaser";

import HelloWorldScene from "./scenes/HelloWorldScene";
import { SceneMainMenu } from "./scenes/SceneMainMenu";
import { SceneMain } from "./scenes/SceneMain";

const config: Phaser.Types.Core.GameConfig & Phaser.Types.Core.RenderConfig = {
  type: Phaser.WEBGL,
  width: 640,
  height: 480,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [SceneMainMenu, SceneMain],
  pixelArt: true,
  roundPixels: true,
};

export default new Phaser.Game(config);
