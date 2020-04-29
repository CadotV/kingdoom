import Unit from './unit';

export default class Hand extends Phaser.GameObjects.PathFollower {
  //#region class variables
  scene: Phaser.Scene;
  type: string;
  unit: Unit;

  currentCurve: Phaser.Curves.Curve;
  shoulderCurve: Phaser.Curves.Ellipse;
  attackCurve: Phaser.Curves.Ellipse;
  lineToShoulderCurve: Phaser.Curves.Line;

  startAngleCurve: number;
  endAngleCurve: number;
  attackStartAngleCurve: number;
  attackEndAngleCurve: number;

  /** Flags */
  isAttacking: boolean;
  isOpposedAttacking: boolean;
  isResetingShoulder: boolean;

  /** Debug */
  graphics: Phaser.GameObjects.Graphics;

  // tween: Phaser.Tweens.Tween;
  //#endregion

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, unit: Unit, type: string) {
    let startAngleCurve = null;
    let endAngleCurve = null;
    let path = null;

    if ('left' == type) {
      path = new Phaser.Curves.Path(unit.leftPosition.x, unit.leftPosition.y);
      startAngleCurve = ((Math.PI * 5) / 4) * Phaser.Math.RAD_TO_DEG;
      endAngleCurve = ((Math.PI * 7) / 4) * Phaser.Math.RAD_TO_DEG;
    } else {
      path = new Phaser.Curves.Path(unit.rightPosition.x, unit.rightPosition.y);
      startAngleCurve = (Math.PI / 4) * Phaser.Math.RAD_TO_DEG;
      endAngleCurve = ((Math.PI * 3) / 4) * Phaser.Math.RAD_TO_DEG;
    }

    const shoulderCurve = new Phaser.Curves.Ellipse(
      unit.x,
      unit.y,
      unit.radius,
      unit.radius,
      startAngleCurve,
      endAngleCurve,
      false,
      unit.rotation,
    );

    path.add(shoulderCurve);

    super(scene, path, x, y, texture);

    this.scene = scene;
    this.unit = unit;
    this.type = type;
    this.isAttacking = false;
    this.isOpposedAttacking = false;
    this.isResetingShoulder = false;

    this.path = path;
    this.shoulderCurve = shoulderCurve;
    this.startAngleCurve = startAngleCurve;
    this.endAngleCurve = endAngleCurve;
    this.currentCurve = this.shoulderCurve;

    this.attackStartAngleCurve = (Math.PI / 4) * Phaser.Math.RAD_TO_DEG;
    this.attackEndAngleCurve = ((Math.PI * 7) / 4) * Phaser.Math.RAD_TO_DEG;
    this.attackCurve = new Phaser.Curves.Ellipse(
      unit.x,
      unit.y,
      unit.radius,
      unit.radius,
      startAngleCurve,
      endAngleCurve,
      true,
      unit.rotation,
    );

    if ('left' == type) {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        new Phaser.Math.Vector2(this.unit.leftPosition.x, this.unit.leftPosition.y),
      );
    } else {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        new Phaser.Math.Vector2(this.unit.rightPosition.x, this.unit.rightPosition.y),
      );
    }

    this.graphics = this.scene.add.graphics();

    this.attachListener();
    this.shoulderFollow();
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

  shoulderFollow(): void {
    this.stopFollow();
    this.startFollow(
      {
        yoyo: true,
        repeat: -1,
        duration: 1000,
        rotateToPath: false,
      },
      0.5,
    );
  }

  launchAttackCurve(): void {
    this.stopFollow();
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.attackCurve);
    this.currentCurve = this.attackCurve;
    this.isAttacking = true;
    this.startFollow({
      duration: 1000,
      yoyo: false,
      ease: 'Expo.easeOut',
      rotateToPath: true,
      onComplete: () => {
        this.resetToShoulderCurve();
      },
    });
  }

  launchOpposedAttackCurve(): void {
    this.stopFollow();
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.shoulderCurve);
    this.currentCurve = this.shoulderCurve;
    this.isOpposedAttacking = true;
    this.startFollow({
      duration: 1000,
      ease: 'Expo.easeOut',
      rotateToPath: true,
      onComplete: () => {
        this.resetToShoulderCurve();
      },
    });
  }

  resetToShoulderCurve(): void {
    this.stopFollow();
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.lineToShoulderCurve);
    this.currentCurve = this.lineToShoulderCurve;
    this.isResetingShoulder = true;
    this.startFollow({
      duration: 1000,
      rotateToPath: true,
      onComplete: () => {
        this.startShoulderCurve();
      },
    });
  }

  startShoulderCurve(): void {
    this.stopFollow();
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.shoulderCurve);
    this.currentCurve = this.shoulderCurve;
    this.isResetingShoulder = false;
    this.isAttacking = false;
    this.isOpposedAttacking = false;
    this.shoulderFollow();
  }

  //#region update
  update(): void {
    if (this.isResetingShoulder) {
      this.currentCurve = this.lineToShoulderCurve;
    } else if (this.isAttacking) {
      this.currentCurve = this.attackCurve;
    } else {
      this.currentCurve = this.shoulderCurve;
    }
    if (this.unit.isMoving) {
      this.resumeFollow();
      this.updateCurves();
      this.updatePath();
      this.updateGraphics();
    } else {
      if (!this.isAttacking && !this.isOpposedAttacking && !this.isResetingShoulder) {
        this.pauseFollow();
      }
      this.updateCurves();
      this.updatePath();
      this.updateGraphics();
    }
    this.angle = this.unit.angle;
  }

  updateCurves(): void {
    this.shoulderCurve = new Phaser.Curves.Ellipse(
      this.unit.x,
      this.unit.y,
      this.unit.radius,
      this.unit.radius,
      this.startAngleCurve + this.unit.angle,
      this.endAngleCurve + this.unit.angle,
      false,
      this.unit.rotation,
    );

    this.attackCurve = new Phaser.Curves.Ellipse(
      this.unit.x,
      this.unit.y,
      this.unit.radius,
      this.unit.radius,
      this.attackStartAngleCurve + this.unit.angle,
      this.attackEndAngleCurve + this.unit.angle,
      true,
      this.unit.rotation,
    );

    if ('left' == this.type) {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        new Phaser.Math.Vector2(this.unit.leftPosition.x, this.unit.leftPosition.y),
      );
    } else {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        new Phaser.Math.Vector2(this.unit.rightPosition.x, this.unit.rightPosition.y),
      );
    }
  }

  updatePath(): void {
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.currentCurve);
  }

  updateGraphics(): void {
    this.graphics.clear();
    this.graphics.lineStyle(1, 0x00ff00, 1);
    this.shoulderCurve.draw(this.graphics);
    this.graphics.lineStyle(1, 0xffff00, 1);
    this.attackCurve.draw(this.graphics);
    this.graphics.lineStyle(1, 0x00ff00, 1);
  }
  //#endregion
}
