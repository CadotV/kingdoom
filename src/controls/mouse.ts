import Phaser from 'phaser';

export default class Mouse extends Phaser.Input.Mouse.MouseManager {
  constructor(scene: Phaser.Scene, manager: Phaser.Input.InputManager) {
    super(manager);
  }
}
