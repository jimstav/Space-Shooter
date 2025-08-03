import { CUSTOM_EVENTS, EventBusComponent } from "../events/EventBusComponent";
import { HealthComponent } from "../health/HealthComponent";

export class ColliderComponent {
  #healthComponent: HealthComponent;
  #eventBusComponent: EventBusComponent;

  constructor(
    healthComponent: HealthComponent,
    eventBusComponent: EventBusComponent
  ) {
    this.#healthComponent = healthComponent;
    this.#eventBusComponent = eventBusComponent;
  }

  collideWithEnemyShip() {
    if (this.#healthComponent.isDead) {
      return;
    }
    this.#healthComponent.die();
  }

  collideWithEnemyProjectile() {
    if (this.#healthComponent.isDead) {
      return;
    }
    this.#healthComponent.hit();
    this.#eventBusComponent.emit(CUSTOM_EVENTS.SHIP_HIT);
  }
}
