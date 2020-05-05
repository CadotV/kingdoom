import Phaser from 'phaser';
import buttonJsx from '@ui/buttons/ButtonJSX';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  init(): void {
    //
  }

  preload(): void {
    //
  }

  create(): void {
    // console.log(buttonJsx);
    const button = this.add.dom(400, 300, buttonJsx);
    button.addListener('click').on('click', () => {
      this.scene.start('GameScene');
    });
  }
}
