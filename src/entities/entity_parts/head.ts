import EntityBody from './entityBody';

export default class Head extends Phaser.GameObjects.Sprite {
  entityBody: EntityBody;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, entityBody: EntityBody) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.entityBody = entityBody;

    this.attachListener();
    this.scene.add.existing(this);
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

  followPosition(): void {
    this.x = this.entityBody.x;
    this.y = this.entityBody.y;
  }

  followRotation(): void {
    // this.rotation = this.entityBody.rotation;
    this.rotation = this.entityBody.rotation;
  }

  followEntityBody(): void {
    this.followPosition();
    this.followRotation();
  }

  update(): void {
    this.followEntityBody();
  }
}
