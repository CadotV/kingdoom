import Phaser from 'phaser';

export default class Pointer extends Phaser.Input.Pointer {
  constructor(scene: Phaser.Scene, manager: Phaser.Input.InputManager, id: integer) {
    super(manager, id);
  }
}
