import EntityBody from '@entities/entity_parts/entityBody';

export default class Camera extends Phaser.Cameras.Scene2D.Camera {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  followEntityBody(entityBody: EntityBody): void {
    console.log('following component', entityBody);
    this.startFollow(entityBody);
  }

  center(x: number, y: number): void {
    this.stopFollow();
    this.setScroll(x, y);
  }
}
