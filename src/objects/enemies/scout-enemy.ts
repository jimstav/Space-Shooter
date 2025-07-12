import { KeyboardInputComponent } from "../../components/input/keyboard-input-component";

export class ScoutEnemy extends Phaser.GameObjects.Container {
  #keyboardInputComponent: KeyboardInputComponent;
  #shipSprite: Phaser.GameObjects.Sprite;
  #shipEngineSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, []);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 24);
    body.setOffset(-12, -12);

    this.#shipSprite = scene.add.sprite(0, 0, "scout", 0);
    this.#shipEngineSprite = scene.add
      .sprite(0, 0, "scout_engine")
      .setFlipY(true);
    this.#shipEngineSprite.play("scout_engine");
    this.add([this.#shipEngineSprite, this.#shipSprite]);

    this.#keyboardInputComponent = new KeyboardInputComponent(this.scene);

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  update(ts: number, dt: number): void {
    this.#keyboardInputComponent.update();
  }
}
