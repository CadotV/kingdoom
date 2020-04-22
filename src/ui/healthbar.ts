import Unit from '@components/unit';

export default class Healthbar {
  text: Phaser.GameObjects.Text;
  backgroundBar: Phaser.GameObjects.Graphics;
  foregroundBar: Phaser.GameObjects.Graphics;
  scene: Phaser.Scene;
  radius: number;
  startHealth: number;
  currentHealth: number;
  currentHealthPourcent: number;

  constructor(scene: Phaser.Scene, unit: Unit, startHealth: number, radius: number) {
    this.scene = scene;

    this.startHealth = startHealth;
    this.currentHealth = startHealth;
    this.currentHealthPourcent = 100;

    this.radius = radius;

    this.text = new Phaser.GameObjects.Text(scene, unit.currentPosition.x, unit.currentPosition.y, 'health', {
      fontFamily: '"Roboto Condensed"',
    });

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

  drawBar(unitPos: Phaser.Math.Vector2): void {
    this.backgroundBar.clear();
    this.backgroundBar.lineStyle(8, 0xff0000, 1.0);
    // this.backgroundBar.fillStyle(0xff0000, 1.0);
    this.backgroundBar.beginPath();
    this.backgroundBar.arc(unitPos.x, unitPos.y, this.radius, 0, this.endAngle());
    this.backgroundBar.stroke();
    this.backgroundBar.closePath();

    this.foregroundBar.clear();
    this.foregroundBar.lineStyle(8, 0x00ff00, 1.0);
    // this.foregroundBar.fillStyle(0x00ff00, 1.0);
    this.foregroundBar.beginPath();
    this.foregroundBar.arc(unitPos.x, unitPos.y, this.radius, 0, this.endAngle());
    this.foregroundBar.stroke();
    this.foregroundBar.closePath();
  }

  endAngle(): number {
    this.currentHealthPourcent = (this.currentHealth * 100) / this.startHealth;
    return 2 * Math.PI * (this.currentHealthPourcent / 100);
  }

  setHealth(currentHealth: number): void {
    //
  }

  attachListener(): void {
    // this.scene.events.on(
    //   'update',
    //   () => {
    //     this.update();
    //   },
    //   this,
    // );
  }

  update(currentPos: Phaser.Math.Vector2, currentHealth: number): void {
    this.drawBar(currentPos);
  }
}
