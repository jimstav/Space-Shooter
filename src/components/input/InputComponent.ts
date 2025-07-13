export class InputComponent {
  _up: boolean;
  _down: boolean;
  _left: boolean;
  _right: boolean;
  _shoot: boolean;

  constructor() {
    this.reset();
  }

  get upIsDown() {
    return this._up;
  }

  get downIsDown() {
    return this._down;
  }

  get leftIsDown() {
    return this._left;
  }

  get rightIsDown() {
    return this._right;
  }

  get shootIsDown() {
    return this._shoot;
  }

  reset() {
    this._up = false;
    this._down = false;
    this._left = false;
    this._right = false;
    this._shoot = false;
  }
}
