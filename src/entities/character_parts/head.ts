import CharacterBody from './characterBody';

export default class Head extends Phaser.GameObjects.Sprite {
  characterBody: CharacterBody;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, characterBody: CharacterBody) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.characterBody = characterBody;

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
    this.x = this.characterBody.x;
    this.y = this.characterBody.y;
  }

  followRotation(): void {
    // this.rotation = this.characterBody.rotation;
    this.rotation = this.characterBody.rotation;
  }

  followEntityBody(): void {
    this.followPosition();
    this.followRotation();
  }

  update(): void {
    this.followEntityBody();
  }
}
