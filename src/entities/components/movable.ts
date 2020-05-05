import EntityBody from '@entities/entity_parts/entityBody';

/**
 * Implements different features based on Input
 */

// declare interface IsMovable {
//   moveToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2, speed: number): void;
//   moveRandom(currentPos: Phaser.Math.Vector2, radiusSize: number): void;
//   rotateToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void;
//   rotateToTargetVelocity(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void;
// }

export default class Movable {
  entityBody: EntityBody;
  speed: number;

  private _moveRandomReached: boolean;
  private _randomPoint: Phaser.Geom.Point;
  private _randomVector2: Phaser.Math.Vector2;

  constructor(entityBody: EntityBody, speed: number) {
    this.entityBody = entityBody;
    this.speed = speed;

    this._moveRandomReached = true;
    this._randomPoint = new Phaser.Geom.Point(this.entityBody.currentPosition.x, this.entityBody.currentPosition.y);
    this._randomVector2 = new Phaser.Math.Vector2(this._randomPoint.x, this._randomPoint.y);
  }

  moveToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    this.entityBody.awake();

    const vector2Direction = new Phaser.Math.Vector2(targetPos.x - currentPos.x, targetPos.y - currentPos.y);
    const magnitude: number = vector2Direction.length();

    if (magnitude > this.entityBody.radius) {
      const normDirection = new Phaser.Math.Vector2(vector2Direction.x, vector2Direction.y).normalize();
      const velocity = normDirection.scale(this.speed);
      this.entityBody.setVelocity(velocity.x, velocity.y);
      this.rotateToTarget(currentPos, targetPos);
      // this.rotateToTargetVelocity(currentPos, targetPos);
    }
  }

  moveRandom(currentPos: Phaser.Math.Vector2, radiusSize: number): void {
    if (this._moveRandomReached) {
      const circle: Phaser.Geom.Circle = new Phaser.Geom.Circle(currentPos.x, currentPos.y, radiusSize);
      this._randomPoint = Phaser.Geom.Circle.Random(circle, this._randomPoint);
      this._randomVector2 = new Phaser.Math.Vector2(this._randomPoint.x, this._randomPoint.y);
      this._moveRandomReached = false;
    }
    if (!this._moveRandomReached) {
      this.moveToTarget(currentPos, this._randomVector2);
      this.rotateToTarget(currentPos, this._randomVector2);

      if (currentPos.fuzzyEquals(this._randomVector2, 10)) {
        this._moveRandomReached = true;
        this.entityBody.awake();
      }
    }
  }

  rotateToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    const angleBetweenVector2 = Phaser.Math.Angle.Between(currentPos.x, currentPos.y, targetPos.x, targetPos.y);
    this.entityBody.setRotation(angleBetweenVector2);
  }

  rotateToTargetVelocity(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    const angleBetweenVector2 = Phaser.Math.Angle.Between(currentPos.x, currentPos.y, targetPos.x, targetPos.y);
    if (angleBetweenVector2 >= 0) {
      this.entityBody.setAngularVelocity(0.1);
    } else {
      this.entityBody.setAngularVelocity(-0.1);
    }
  }
}
