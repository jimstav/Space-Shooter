import { ScoutEnemy } from "../../objects/enemies/scout-enemy";
import { Player } from "../../objects/player";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    const player = new Player(this);
    const enemy = new ScoutEnemy(this, this.scale.width / 2, 20);

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("Game");
  }
}

