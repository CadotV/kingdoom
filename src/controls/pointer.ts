import Phaser from 'phaser';

export default class Pointer extends Phaser.Input.Pointer {
  private vector2Position: Phaser.Math.Vector2;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, manager: Phaser.Input.InputManager, id: number) {
    super(manager, id);
    this.scene = scene;

    this.vector2Position = Phaser.Math.Vector2.ZERO;

    this.handlers();
  }

  handlers(): void {
    //
  }

  get Vector2Position(): Phaser.Math.Vector2 {
    return this.vector2Position;
  }

  set Vector2Position(vector2: Phaser.Math.Vector2) {
    this.vector2Position = vector2;
  }
}
