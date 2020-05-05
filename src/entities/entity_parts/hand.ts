import Weapon from '../weapon';
import EntityBody from './entityBody';

export default class Hand extends Phaser.GameObjects.PathFollower {
  //#region class variables
  scene: Phaser.Scene;
  type: string;
  entityBody: EntityBody;

  currentCurve: Phaser.Curves.Curve;
  shoulderCurve: Phaser.Curves.Ellipse;
  attackCurve: Phaser.Curves.Curve;
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

  weapon?: Weapon;

  // tween: Phaser.Tweens.Tween;
  //#endregion

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    entityBody: EntityBody,
    type: string,
    weapon?: Weapon,
  ) {
    let startAngleCurve = null;
    let endAngleCurve = null;
    let path = null;

    if ('left' == type) {
      path = new Phaser.Curves.Path(entityBody.getLeftPosition().x, entityBody.getLeftPosition().y);
      startAngleCurve = ((Math.PI * 5) / 4) * Phaser.Math.RAD_TO_DEG;
      endAngleCurve = ((Math.PI * 7) / 4) * Phaser.Math.RAD_TO_DEG;
    } else {
      path = new Phaser.Curves.Path(entityBody.getRightPosition().x, entityBody.getRightPosition().y);
      startAngleCurve = (Math.PI / 4) * Phaser.Math.RAD_TO_DEG;
      endAngleCurve = ((Math.PI * 3) / 4) * Phaser.Math.RAD_TO_DEG;
    }

    const shoulderCurve = new Phaser.Curves.Ellipse(
      entityBody.x,
      entityBody.y,
      entityBody.radius,
      entityBody.radius,
      startAngleCurve,
      endAngleCurve,
      false,
      entityBody.rotation,
    );

    path.add(shoulderCurve);

    super(scene, path, x, y, texture);

    this.scene = scene;
    this.entityBody = entityBody;
    this.type = type;
    this.isAttacking = false;
    this.isOpposedAttacking = false;
    this.isResetingShoulder = false;

    this.path = path;
    this.shoulderCurve = shoulderCurve;
    this.startAngleCurve = startAngleCurve;
    this.endAngleCurve = endAngleCurve;
    this.currentCurve = this.shoulderCurve;

    if (weapon) {
      this.weapon = weapon;
      this.attackCurve = weapon.currentCurve;
      this.attackStartAngleCurve = 0;
      this.attackEndAngleCurve = 0;
    } else {
      const defaultStartAngleCurve = (Math.PI / 4) * Phaser.Math.RAD_TO_DEG;
      const defaultEndAngleCurve = ((Math.PI * 7) / 4) * Phaser.Math.RAD_TO_DEG;
      const defaultCurve = new Phaser.Curves.Ellipse(
        this.entityBody.x,
        this.entityBody.y,
        this.entityBody.radius,
        this.entityBody.radius,
        defaultStartAngleCurve,
        defaultEndAngleCurve,
        true,
        this.entityBody.rotation,
      );
      this.attackStartAngleCurve = defaultStartAngleCurve;
      this.attackEndAngleCurve = defaultEndAngleCurve;
      this.attackCurve = defaultCurve;
    }

    // this.attackStartAngleCurve = (Math.PI / 4) * Phaser.Math.RAD_TO_DEG;
    // this.attackEndAngleCurve = ((Math.PI * 7) / 4) * Phaser.Math.RAD_TO_DEG;
    // this.attackCurve = new Phaser.Curves.Ellipse(
    //   entityBody.x,
    //   entityBody.y,
    //   entityBody.radius,
    //   entityBody.radius,
    //   startAngleCurve,
    //   endAngleCurve,
    //   true,
    //   entityBody.rotation,
    // );
    if ('right' === type) {
      this.setFlipY(true);
    }

    if ('left' === type) {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        this.entityBody.getLeftPosition(),
      );
    } else {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        this.entityBody.getRightPosition(),
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

  attachAttackCurve(curve: Phaser.Curves.Curve): void {
    this.attackCurve = curve;
  }

  //#region follow
  shoulderFollow(): void {
    this.stopFollow();
    this.startFollow({
      yoyo: true,
      repeat: -1,
      duration: 1000,
      rotateToPath: false,
    });
  }

  attackFollow(): void {
    this.startFollow({
      duration: 1000,
      ease: 'Expo.easeOut',
      rotateToPath: true,
      onComplete: () => {
        this.resetToShoulderCurve();
      },
    });
  }

  launchAttackCurve(): void {
    this.stopFollow();
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.attackCurve);
    this.currentCurve = this.attackCurve;
    this.isAttacking = true;
    this.attackFollow();
  }

  launchOpposedAttackCurve(): void {
    this.stopFollow();
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.shoulderCurve);
    this.currentCurve = this.shoulderCurve;
    this.isOpposedAttacking = true;
    this.attackFollow();
  }

  resetToShoulderCurve(): void {
    this.stopFollow();
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.lineToShoulderCurve);
    this.currentCurve = this.lineToShoulderCurve;
    this.isResetingShoulder = true;
    this.startFollow({
      duration: 500,
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

  //#endregion

  //#region getter & setter

  //#endregion

  //#region update
  update(): void {
    if (this.isResetingShoulder) {
      this.currentCurve = this.lineToShoulderCurve;
    } else if (this.isAttacking) {
      this.currentCurve = this.attackCurve;
    } else {
      this.currentCurve = this.shoulderCurve;
    }
    if (this.entityBody.isMoving) {
      this.resumeFollow();
      this.updateCurves();
      this.updatePath();
      //this.updateGraphics();
    } else {
      if (!this.isAttacking && !this.isOpposedAttacking && !this.isResetingShoulder) {
        this.pauseFollow();
      }
      this.updateCurves();
      this.updatePath();
      //this.updateGraphics();
    }
    this.angle = this.entityBody.angle;
  }

  updateCurves(): void {
    this.shoulderCurve = new Phaser.Curves.Ellipse(
      this.entityBody.x,
      this.entityBody.y,
      this.entityBody.radius,
      this.entityBody.radius,
      this.startAngleCurve + this.entityBody.angle,
      this.endAngleCurve + this.entityBody.angle,
      false,
      this.entityBody.rotation,
    );

    // TODO: each weapon have different curves !
    this.attackCurve = new Phaser.Curves.Ellipse(
      this.entityBody.x,
      this.entityBody.y,
      this.entityBody.radius,
      this.entityBody.radius,
      this.attackStartAngleCurve + this.entityBody.angle,
      this.attackEndAngleCurve + this.entityBody.angle,
      true,
      this.entityBody.rotation,
    );
    // this.attackCurve = this.currentCurve;

    if ('left' == this.type) {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        this.entityBody.getLeftPosition(),
      );
    } else {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        this.entityBody.getRightPosition(),
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
