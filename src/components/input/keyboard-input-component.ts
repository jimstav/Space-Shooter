import { InputComponent } from "./input-component";

export class KeyboardInputComponent extends InputComponent {
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  #inputLocked: boolean;

  constructor(scene: Phaser.Scene) {
    super();
    this.#cursorKeys = scene.input.keyboard?.createCursorKeys();
    this.#inputLocked = false;
  }

  set lockInput(val: boolean) {
    this.#inputLocked = val;
  }

  update() {
    if (this.#inputLocked) {
      this.reset();
      return;
    }
    this._up = this.#cursorKeys?.up.isDown || false;
    this._down = this.#cursorKeys?.down.isDown || false;
    this._left = this.#cursorKeys?.left.isDown || false;
    this._right = this.#cursorKeys?.right.isDown || false;
    this._shoot = this.#cursorKeys?.space.isDown || false;
  }
}
