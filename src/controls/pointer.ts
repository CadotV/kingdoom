import Phaser from 'phaser';

export default class Pointer extends Phaser.Input.Pointer {
  private _vector2Position: Phaser.Math.Vector2;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, manager: Phaser.Input.InputManager, id: number) {
    super(manager, id);
    this.scene = scene;

    this._vector2Position = Phaser.Math.Vector2.ZERO;

    this.handlers();
  }

  handlers(): void {
    //
  }

  get vector2Position(): Phaser.Math.Vector2 {
    return this._vector2Position;
  }

  set vector2Position(vector2: Phaser.Math.Vector2) {
    this._vector2Position = vector2;
  }
}
