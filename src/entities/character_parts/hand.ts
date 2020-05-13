import Weapon from '../weapon';
import CharacterBody from './characterBody';

const SPEED_MODIFIER = 600; // modify the character speed

export default class Hand extends Phaser.GameObjects.PathFollower {
  //#region class variables
  scene: Phaser.Scene;
  side: string;
  characterBody: CharacterBody;
  speed: number;

  currentCurve: Phaser.Curves.Curve;
  shoulderCurve: Phaser.Curves.Ellipse;
  attackCurve: Phaser.Curves.Curve;
  opposedAttackCurve: Phaser.Curves.Curve;
  lineToShoulderCurve: Phaser.Curves.Line;

  startAngleCurve: number;
  endAngleCurve: number;
  attackStartAngleCurve: number;
  attackEndAngleCurve: number;
  opposedAttackStartAngleCurve: number;
  opposedAttackEndAngleCurve: number;

  /** Flags */
  isAttacking: boolean;
  isOpposedAttacking: boolean;
  isResetingShoulder: boolean;

  weapon?: Weapon;

  // tween: Phaser.Tweens.Tween;
  //#endregion

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    characterBody: CharacterBody,
    side: string,
    speed: number,
    weapon?: Weapon,
  ) {
    let startAngleCurve = null;
    let endAngleCurve = null;
    const path = new Phaser.Curves.Path(x, y);

    //TODO: use characterBody pos
    if ('left' === side) {
      //path = new Phaser.Curves.Path(characterBody.getLeftPosition().x, characterBody.getLeftPosition().y);
      startAngleCurve = characterBody.getAngleWithPosition(characterBody.getFrontLeftMiddlePosition());
      endAngleCurve = characterBody.getAngleWithPosition(characterBody.getBackLeftMiddlePosition());
    } else {
      //path = new Phaser.Curves.Path(characterBody.getRightPosition().x, characterBody.getRightPosition().y);
      startAngleCurve = characterBody.getAngleWithPosition(characterBody.getBackRightMiddlePosition());
      endAngleCurve = characterBody.getAngleWithPosition(characterBody.getFrontRightMiddlePosition());
    }

    const shoulderCurve = new Phaser.Curves.Ellipse(
      characterBody.x,
      characterBody.y,
      characterBody.radius,
      characterBody.radius,
      startAngleCurve,
      endAngleCurve,
      true,
      characterBody.rotation,
    );

    path.add(shoulderCurve);

    super(scene, path, x, y, texture);

    this.scene = scene;
    this.characterBody = characterBody;
    this.side = side;
    this.speed = speed * this.characterBody.airFriction * this.characterBody.valueFriction * SPEED_MODIFIER;

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
      const defaultStartAngleCurve = characterBody.getAngleWithPosition(characterBody.getRightPosition());
      const defaultEndAngleCurve = characterBody.getAngleWithPosition(characterBody.getLeftPosition());
      const defaultCurve = new Phaser.Curves.Ellipse(
        this.characterBody.x,
        this.characterBody.y,
        this.characterBody.radius,
        this.characterBody.radius,
        defaultStartAngleCurve,
        defaultEndAngleCurve,
        true,
        this.characterBody.rotation,
      );
      this.attackStartAngleCurve = defaultStartAngleCurve;
      this.attackEndAngleCurve = defaultEndAngleCurve;
      this.attackCurve = defaultCurve;
    }

    this.opposedAttackStartAngleCurve = characterBody.getAngleWithPosition(characterBody.getFrontRightMiddlePosition());
    this.opposedAttackEndAngleCurve = characterBody.getAngleWithPosition(characterBody.getBackRightMiddlePosition());
    this.opposedAttackCurve = new Phaser.Curves.Ellipse(
      this.characterBody.x,
      this.characterBody.y,
      this.characterBody.radius,
      this.characterBody.radius,
      this.opposedAttackStartAngleCurve,
      this.opposedAttackEndAngleCurve,
      false,
      this.characterBody.rotation,
    );

    if ('right' === side) {
      this.setFlipY(true);
    }

    if ('left' === side) {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        this.characterBody.getLeftPosition(),
      );
    } else {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        this.characterBody.getRightPosition(),
      );
    }

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

  attachWeapon(weapon: Weapon): void {
    this.weapon = weapon;
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
      duration: this.speed,
      rotateToPath: false,
    });
  }

  attackFollow(): void {
    this.startFollow({
      duration: 1000,
      ease: 'Expo.easeOut',
      rotateToPath: false,
      // onUpdate: () => {
      //   const tangent: Phaser.Math.Vector2 = this.attackCurve.getTangent(this.pathTween.progress);
      //   this.angle = tangent.angle();
      // },
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
    this.path.add(this.opposedAttackCurve);
    this.currentCurve = this.opposedAttackCurve;
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
      rotateToPath: false,
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

  //#region update
  update(): void {
    if (this.isResetingShoulder) {
      this.currentCurve = this.lineToShoulderCurve;
    } else if (this.isAttacking && !this.isOpposedAttacking) {
      this.currentCurve = this.attackCurve;
    } else if (this.isOpposedAttacking && !this.isAttacking) {
      this.currentCurve = this.opposedAttackCurve;
    } else {
      this.currentCurve = this.shoulderCurve;
    }
    if (this.characterBody.isMoving) {
      this.resumeFollow();
      this.updateCurves();
      this.updatePath();
    } else {
      if (!this.isAttacking && !this.isOpposedAttacking && !this.isResetingShoulder) {
        this.pauseFollow();
      }
      this.updateCurves();
      this.updatePath();
    }
    if (!this.isAttacking) this.angle = this.characterBody.angle;
  }

  updateCurves(): void {
    this.shoulderCurve = new Phaser.Curves.Ellipse(
      this.characterBody.x,
      this.characterBody.y,
      this.characterBody.radius,
      this.characterBody.radius,
      this.startAngleCurve + this.characterBody.angle,
      this.endAngleCurve + this.characterBody.angle,
      true,
      this.characterBody.rotation,
    );

    // TODO: each weapon have different curves !
    this.attackCurve = new Phaser.Curves.Ellipse(
      this.characterBody.x,
      this.characterBody.y,
      this.characterBody.radius,
      this.characterBody.radius,
      this.attackStartAngleCurve + this.characterBody.angle,
      this.attackEndAngleCurve + this.characterBody.angle,
      true,
      this.characterBody.rotation,
    );

    this.opposedAttackCurve = new Phaser.Curves.Ellipse(
      this.characterBody.x,
      this.characterBody.y,
      this.characterBody.radius,
      this.characterBody.radius,
      this.opposedAttackStartAngleCurve + this.characterBody.angle,
      this.opposedAttackEndAngleCurve + this.characterBody.angle,
      false,
      this.characterBody.rotation,
    );

    if ('left' == this.side) {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        this.characterBody.getLeftPosition(),
      );
    } else {
      this.lineToShoulderCurve = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(this.x, this.y),
        this.characterBody.getRightPosition(),
      );
    }
  }

  updatePath(): void {
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.currentCurve);
  }
  //#endregion
}
