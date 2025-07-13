import { FighterEnemy } from "../../objects/enemies/FighterEnemy";
import { ScoutEnemy } from "../../objects/enemies/ScoutEnemy";
import { Player } from "../../objects/Player";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    const player = new Player(this);
    const scoutEnemy = new ScoutEnemy(this, this.scale.width / 2 - 20, 0);
    const fighterEnemy = new FighterEnemy(this, this.scale.width / 2 + 20, 0);

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("Game");
  }
}

