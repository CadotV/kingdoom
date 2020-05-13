import CharacterBody from '@entities/character_parts/characterBody';

/**
 * Implements different features based on Input
 */

declare interface MovableInterface {
  moveToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2, speed: number): void;
  moveRandom(currentPos: Phaser.Math.Vector2, radiusSize: number): void;
  rotateToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void;
  rotateToTargetVelocity(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void;
}

export default class Movable {
  characterBody: CharacterBody;
  speed: number;

  private moveRandomReached: boolean;
  private randomPoint: Phaser.Geom.Point;
  private randomVector2: Phaser.Math.Vector2;

  constructor(characterBody: CharacterBody, speed: number) {
    this.characterBody = characterBody;
    this.speed = speed;

    this.moveRandomReached = true;
    this.randomPoint = new Phaser.Geom.Point(
      this.characterBody.currentPosition.x,
      this.characterBody.currentPosition.y,
    );
    this.randomVector2 = new Phaser.Math.Vector2(this.randomPoint.x, this.randomPoint.y);
  }

  moveToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    this.characterBody.awake();

    const vector2Direction = new Phaser.Math.Vector2(targetPos.x - currentPos.x, targetPos.y - currentPos.y);
    const magnitude: number = vector2Direction.length();

    if (magnitude > this.characterBody.radius) {
      const normDirection = new Phaser.Math.Vector2(vector2Direction.x, vector2Direction.y).normalize();
      const velocity = normDirection.scale(this.speed);
      this.characterBody.setVelocity(velocity.x, velocity.y);
      // this.rotateToTarget(currentPos, targetPos);
      // this.rotateToTargetVelocity(currentPos, targetPos);
    }
  }

  moveRandom(currentPos: Phaser.Math.Vector2, radiusSize: number): void {
    this.characterBody.awake();

    if (this.moveRandomReached) {
      const circle: Phaser.Geom.Circle = new Phaser.Geom.Circle(currentPos.x, currentPos.y, radiusSize);
      this.randomPoint = Phaser.Geom.Circle.Random(circle, this.randomPoint);
      this.randomVector2 = new Phaser.Math.Vector2(this.randomPoint.x, this.randomPoint.y);
      this.moveRandomReached = false;
    }
    if (!this.moveRandomReached) {
      this.moveToTarget(currentPos, this.randomVector2);
      this.rotateToTarget(currentPos, this.randomVector2);

      if (currentPos.fuzzyEquals(this.randomVector2, 10)) {
        this.moveRandomReached = true;
        this.characterBody.awake();
      }
    }
  }

  rotateToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    const angleBetweenVector2 = Phaser.Math.Angle.Between(currentPos.x, currentPos.y, targetPos.x, targetPos.y);
    this.characterBody.setRotation(angleBetweenVector2);
  }

  rotateToTargetVelocity(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    const angleBetweenVector2 = Phaser.Math.Angle.Between(currentPos.x, currentPos.y, targetPos.x, targetPos.y);
    if (angleBetweenVector2 >= 0) {
      this.characterBody.setAngularVelocity(0.1);
    } else {
      this.characterBody.setAngularVelocity(-0.1);
    }
  }
}
