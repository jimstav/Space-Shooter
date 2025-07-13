import { HealthComponent } from "../health/HealthComponent";

export class ColliderComponent {
  #healthComponent: HealthComponent;

  constructor(healthComponent: HealthComponent) {
    this.#healthComponent = healthComponent;
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
  }
}
