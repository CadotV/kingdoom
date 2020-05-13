/**
 * @author       Valentin Cadot <valentin.cadot@gmail.com>
 * @copyright    2020 KingDoom
 */
import CharacterBody from './characterBody';

// TODO: calculate this based on matter, body radius and character speed
const SPEED_MODIFIER = 600; // modify the character speed

export default class Foot extends Phaser.GameObjects.PathFollower {
  scene: Phaser.Scene;
  side: string;
  characterBody: CharacterBody;
  lineCurve: Phaser.Curves.Line;
  currentCurve: Phaser.Curves.Curve;
  path: Phaser.Curves.Path;

  currentVector2Position: Phaser.Math.Vector2;
  speed: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    side: string,
    characterBody: CharacterBody,
    speed: number,
  ) {
    const path = new Phaser.Curves.Path(x, y);
    let lineCurve: Phaser.Curves.Line;

    if ('left' === side) {
      lineCurve = new Phaser.Curves.Line(
        characterBody.getBackLeftMiddlePosition(),
        characterBody.getFrontLeftMiddlePosition(),
      );
    } else {
      lineCurve = new Phaser.Curves.Line(
        characterBody.getFrontRightMiddlePosition(),
        characterBody.getBackRightMiddlePosition(),
      );
    }

    path.add(lineCurve);

    super(scene, path, x, y, texture);

    this.scene = scene;
    this.side = side;
    this.characterBody = characterBody;
    this.path = path;
    this.speed = speed * this.characterBody.airFriction * this.characterBody.valueFriction * SPEED_MODIFIER;

    this.lineCurve = lineCurve;

    if ('right' === this.side) {
      this.setFlipY(true);
    }

    this.attachListener();

    this.startFollow({
      yoyo: true,
      repeat: -1,
      duration: this.speed,
      rotateToPath: false,
    });

    /** Private initialization */
    this.currentVector2Position = new Phaser.Math.Vector2(this.x, this.y);
    this.currentCurve = lineCurve;
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

  //#region update
  update(): void {
    this.updatePosition();
    this.updateAngle();
    this.updatePathFollower();
    this.updateCurves();
    this.updatePath();
  }

  updatePosition(): void {
    this.currentVector2Position.set(this.x, this.y);
  }

  updateAngle(): void {
    this.angle = this.characterBody.angle;
  }

  updatePathFollower(): void {
    if (this.characterBody.isMoving) {
      this.resumeFollow();
    } else {
      this.pauseFollow();
    }
  }

  updateCurves(): void {
    if ('left' === this.side) {
      this.lineCurve = new Phaser.Curves.Line(
        this.characterBody.getBackLeftMiddlePosition(),
        this.characterBody.getFrontLeftMiddlePosition(),
      );
    } else {
      this.lineCurve = new Phaser.Curves.Line(
        this.characterBody.getFrontRightMiddlePosition(),
        this.characterBody.getBackRightMiddlePosition(),
      );
    }
    this.currentCurve = this.lineCurve;
  }

  updatePath(): void {
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.currentCurve);
  }
  //endregion
}
