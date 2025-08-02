import { FighterEnemy } from "../../objects/enemies/FighterEnemy";
import { ScoutEnemy } from "../../objects/enemies/ScoutEnemy";
import { CUSTOM_EVENTS, EventBusComponent } from "../events/EventBusComponent";

export class EnemyDestroyedComponent {
  #scene: Phaser.Scene;
  #group: Phaser.GameObjects.Group;
  #eventBusComponent: EventBusComponent;

  constructor(scene: Phaser.Scene, eventBusComponent: EventBusComponent) {
    this.#scene = scene;
    this.#eventBusComponent = eventBusComponent;

    this.#group = this.#scene.add.group({
      name: `${this.constructor.name}-${Phaser.Math.RND.uuid()}`,
    });

    this.#eventBusComponent.on(
      CUSTOM_EVENTS.ENEMY_DESTROYED,
      (enemy: FighterEnemy | ScoutEnemy) => {
        const gameObject: Phaser.GameObjects.Sprite = this.#group.get(
          enemy.x,
          enemy.y,
          enemy.shipAssetKey,
          0
        );
        gameObject.play({
          key: enemy.shipDestroyedAnimationKey,
        });
      }
    );
  }
}
