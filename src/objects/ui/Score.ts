import {
  CUSTOM_EVENTS,
  EventBusComponent,
} from "../../components/events/EventBusComponent";
import { FighterEnemy } from "../enemies/FighterEnemy";
import { ScoutEnemy } from "../enemies/ScoutEnemy";
import * as CONFIG from "../../config";

const ENEMY_SCORES = {
  ScoutEnemy: CONFIG.ENEMY_SCOUT_SCORE,
  FighterEnemy: CONFIG.ENEMY_FIGHTER_SCORE,
};

export class Score extends Phaser.GameObjects.Text {
  #score: number;
  #eventBusComponent: EventBusComponent;

  constructor(scene: Phaser.Scene, eventBusComponent: EventBusComponent) {
    super(scene, scene.scale.width / 2, 20, "0", {
      fontSize: "24px",
      color: "#ff2f66",
    });

    this.scene.add.existing(this);
    this.#eventBusComponent = eventBusComponent;
    this.#score = 0;
    this.setOrigin(0.5);

    this.#eventBusComponent.on(
      CUSTOM_EVENTS.ENEMY_DESTROYED,
      (enemy: FighterEnemy | ScoutEnemy) => {
        if (!(enemy instanceof FighterEnemy) && !(enemy instanceof ScoutEnemy))
          return;
        const enemyType = enemy.constructor.name as keyof typeof ENEMY_SCORES;
        this.#score += ENEMY_SCORES[enemyType];
        this.setText(this.#score.toString(10));
      }
    );
  }
}
