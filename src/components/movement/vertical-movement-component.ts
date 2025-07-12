import * as CONFIG from "../../config";
import { InputComponent } from "../input/input-component";

export class VerticalMovementComponent {
  #gameObject: Phaser.GameObjects.GameObject;
  #inputComponent: InputComponent;
  #body: Phaser.Physics.Arcade.Body;
  #velocity: number;

  constructor(
    gameObject: Phaser.GameObjects.GameObject,
    inputComponent: InputComponent,
    velocity: number
  ) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#velocity = velocity;

    if (!this.#gameObject.body) return;
    if (!(this.#gameObject.body instanceof Phaser.Physics.Arcade.Body)) return;

    this.#body = this.#gameObject.body;

    this.#gameObject.body.setDamping(true);
    this.#gameObject.body.setDrag(CONFIG.COMPONENT_MOVEMENT_VERTICAL_DRAG);
    this.#gameObject.body.setMaxVelocity(
      CONFIG.COMPONENT_MOVEMENT_VERTICAL_MAX_VELOCITY
    );
  }

  reset() {
    this.#body.velocity.y = 0;
    this.#body.setAccelerationY(0);
  }

  update() {
    if (this.#inputComponent.upIsDown) {
      this.#body.velocity.y -= this.#velocity;
    } else if (this.#inputComponent.downIsDown) {
      this.#body.velocity.y += this.#velocity;
    } else {
      this.#body.setAccelerationY(0);
    }
  }
}
