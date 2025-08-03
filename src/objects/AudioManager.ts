import {
  CUSTOM_EVENTS,
  EventBusComponent,
} from "../components/events/EventBusComponent";

export class AudioManager {
  #scene: Phaser.Scene;
  #eventBusComponent: EventBusComponent;

  constructor(scene: Phaser.Scene, eventBusComponent: EventBusComponent) {
    this.#scene = scene;
    this.#eventBusComponent = eventBusComponent;

    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, () => {
      this.#scene.sound.play("explosion", {
        volume: 0.6,
      });
    });

    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#scene.sound.play("explosion", {
        volume: 0.6,
      });
    });
  }
}
