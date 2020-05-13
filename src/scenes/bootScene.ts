/**
 * @author       Valentin Cadot <valentin.cadot@gmail.com>
 * @copyright    2020 KingDoom
 */

import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  init(): void {
    this.getScale();

    this.scene.start('GameScene');
  }

  getScale(): void {
    const aspectMode = this.scale.gameSize.aspectMode;
    const aspectRatio = this.scale.gameSize.aspectRatio;
  }
}
