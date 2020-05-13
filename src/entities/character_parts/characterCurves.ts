/**
 * @author       Valentin Cadot <valentin.cadot@gmail.com>
 * @copyright    2020 KingDoom
 */
import Phaser from 'phaser';
import CharacterBody from './characterBody';

export default class CharacterCurves {
  scene: Phaser.Scene;

  constructor(public characterBody: CharacterBody, scene: Phaser.Scene) {
    this.scene = scene;

    this.attachListener();
  }

  attachListener(): void {
    this.scene.events.on(
      'update',
      () => {
        this.update();
      },
      this,
    );
  }

  update(): void {
    this.updateCurves();
  }

  updateCurves(): void {
    //
  }
}
