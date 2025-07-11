import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Hello World", {
        fontSize: "32px",
      })
      .setOrigin(0.5);

    this.add.sprite(100, 100, "ship");

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("Game");
  }
}

