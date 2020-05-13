import CharacterBody from '@entities/character_parts/characterBody';

export default class Camera extends Phaser.Cameras.Scene2D.Camera {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  followEntityBody(characterBody: CharacterBody): void {
    console.log('following component', characterBody);
    this.startFollow(characterBody);
  }

  center(x: number, y: number): void {
    this.stopFollow();
    this.setScroll(x, y);
  }
}
