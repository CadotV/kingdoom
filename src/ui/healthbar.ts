import EntityBody from '@entities/entity_parts/entityBody';

export default class Healthbar extends Phaser.GameObjects.GameObject {
  text: Phaser.GameObjects.Text;
  backgroundBar: Phaser.GameObjects.Graphics;
  foregroundBar: Phaser.GameObjects.Graphics;
  scene: Phaser.Scene;
  radius: number;
  startHealth: number;
  currentHealth: number;
  currentHealthPourcent: number;

  entityBody: EntityBody;

  constructor(scene: Phaser.Scene, entityBody: EntityBody, startHealth: number, radius: number) {
    super(scene, 'healthbar gameObject');
    this.scene = scene;

    this.startHealth = startHealth;
    this.currentHealth = startHealth;
    this.currentHealthPourcent = 100;

    this.entityBody = entityBody;

    this.radius = radius;

    this.text = new Phaser.GameObjects.Text(
      scene,
      entityBody.currentPosition.x,
      entityBody.currentPosition.y,
      'health',
      {
        fontFamily: '"Roboto Condensed"',
      },
    );

    this.backgroundBar = new Phaser.GameObjects.Graphics(scene);
    this.foregroundBar = new Phaser.GameObjects.Graphics(scene);

    this.init();
    this.attachListener();
  }

  init(): void {
    //
    this.scene.add.existing(this.backgroundBar);
    this.scene.add.existing(this.foregroundBar);
  }

  drawBar(): void {
    this.backgroundBar.clear();
    this.backgroundBar.lineStyle(8, 0xff0000, 1.0);
    // this.backgroundBar.fillStyle(0xff0000, 1.0);
    this.backgroundBar.beginPath();
    this.backgroundBar.arc(this.entityBody.x, this.entityBody.y, this.radius, 0, 360);
    this.backgroundBar.stroke();
    this.backgroundBar.closePath();

    this.foregroundBar.clear();
    this.foregroundBar.lineStyle(8, 0x00ff00, 1.0);
    // this.foregroundBar.fillStyle(0x00ff00, 1.0);
    this.foregroundBar.beginPath();
    this.foregroundBar.arc(this.entityBody.x, this.entityBody.y, this.radius, 0, this.endAngle());
    this.foregroundBar.stroke();
    this.foregroundBar.closePath();
  }

  clearDraw(): void {
    this.backgroundBar.clear();
    this.foregroundBar.clear();
  }

  endAngle(): number {
    this.currentHealthPourcent = (this.currentHealth * 100) / this.startHealth;
    return 2 * Math.PI * (this.currentHealthPourcent / 100);
  }

  setHealth(currentHealth: number): void {
    this.currentHealth = currentHealth;
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
    this.drawBar();
  }
}
