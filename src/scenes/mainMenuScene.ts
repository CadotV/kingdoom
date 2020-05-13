/**
 * @author       Valentin Cadot <valentin.cadot@gmail.com>
 * @copyright    2020 KingDoom
 */

import Phaser from 'phaser';
import buttonJsx from '@ui/mainMenu/Button';
import breadcrumJsx from '@ui/mainMenu/Breadcrum';

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

    const breadcrum = this.add.dom(100, 100, breadcrumJsx);
  }
}
