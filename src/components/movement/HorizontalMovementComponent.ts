import * as CONFIG from "../../config";
import { InputComponent } from "../input/InputComponent";

export class HorizontalMovementComponent {
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
    this.#gameObject.body.setDrag(CONFIG.COMPONENT_MOVEMENT_HORIZONTAL_DRAG);
    this.#gameObject.body.setMaxVelocity(
      CONFIG.COMPONENT_MOVEMENT_HORIZONTAL_MAX_VELOCITY
    );
  }

  reset() {
    this.#body.velocity.x = 0;
    this.#body.setAccelerationX(0);
  }

  update() {
    if (this.#inputComponent.leftIsDown) {
      this.#body.velocity.x -= this.#velocity;
    } else if (this.#inputComponent.rightIsDown) {
      this.#body.velocity.x += this.#velocity;
    } else {
      this.#body.setAccelerationX(0);
    }
  }
}
