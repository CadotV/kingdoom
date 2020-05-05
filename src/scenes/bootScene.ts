import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  init(): void {
    console.log('start MainMenuScene');

    this.scene.start('MainMenuScene');
  }
}
