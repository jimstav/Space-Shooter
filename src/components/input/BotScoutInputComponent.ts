import { InputComponent } from "./InputComponent";
import * as CONFIG from "../../config";

export class BotScoutInputComponent extends InputComponent {
  #gameObject: Phaser.GameObjects.Container;
  #startX: number;
  #maxXMovement: number;

  constructor(gameObject: Phaser.GameObjects.Container) {
    super();
    this.#gameObject = gameObject;
    this.#startX = this.#gameObject.x;
    this.#maxXMovement = CONFIG.ENEMY_SCOUT_MOVEMENT_MAX_X;
    this._right = true;
    this._down = true;
    this._left = false;
  }

  update() {
    if (this.#gameObject.x > this.#startX + this.#maxXMovement) {
      this._left = true;
      this._right = false;
    } else if (this.#gameObject.x < this.#startX - this.#maxXMovement) {
      this._left = false;
      this._right = true;
    }
  }
}
