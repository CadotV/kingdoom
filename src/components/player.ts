/**
 * Player class
 * TODO: lots of stuff in common with Ennemy. Use a Component Pattern for compositing (vs inheritence).
 * Take into account SOLID, SRP, high cohesion / low coupling
 */

import Phaser from 'phaser';
import Unit from '@components/unit';
import HealthBar from '@ui/healthbar';

export default class Player {
  scene: Phaser.Scene;
  speed: number;
  acceleration: number;
  radius: number;
  health: number;

  // component
  healthBar: HealthBar;

  unit: Unit;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.scene = scene;

    this.speed = 300;
    this.acceleration = 0;

    this.radius = 32;
    this.health = 100;

    this.unit = new Unit(scene, x, y, texture, this.radius);
    this.healthBar = new HealthBar(this.scene, this.unit, this.health, this.radius);

    this.unit.angle = 0;

    this.attachComponent();
    this.attachListener();
  }

  //#region component
  attachComponent(): void {
    //
  }
  //#endregion

  //#region listener
  attachListener(): void {
    // Scene update()
    this.scene.events.on(
      'update',
      () => {
        this.update();
      },
      this,
    );

    // Pointer
    // TODO: put inputs in a class (Pointer)
    // See if x,y coordinates or world coordinates
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.unit.targetPosition.set(pointer.worldX, pointer.worldY);
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.unit.targetPosition.set(pointer.worldX, pointer.worldY);
      }
    });

    this.scene.input.keyboard.on('keydown-SPACE', this.attack);
  }
  //#endregion

  // TODO: set move in a component depending on mouse / touch / gamepad
  moveToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    const vector2Direction = new Phaser.Math.Vector2(targetPos.x - currentPos.x, targetPos.y - currentPos.y);
    const magnitude: number = vector2Direction.length();

    if (magnitude > this.unit.body.halfWidth) {
      const normDirection = new Phaser.Math.Vector2(vector2Direction.x, vector2Direction.y).normalize();
      const velocity = normDirection.scale(this.speed);
      // if (this.acceleration <= this.speed) {
      //   this.acceleration++;
      //   this.unit.setAcceleration(velocity.x, velocity.y);
      // } else {
      this.unit.setVelocity(velocity.x, velocity.y);
      // }
    } else {
      // this.acceleration = 0;
      this.unit.setDamping(true);
    }
  }

  rotateToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    const angleBetweenVector2 = Phaser.Math.Angle.Between(currentPos.x, currentPos.y, targetPos.x, targetPos.y);
    this.unit.setRotation(angleBetweenVector2);
  }

  attack(e: Event): void {
    e.preventDefault();
    console.log('ATTACK !!!');
  }

  update(): void {
    // TODO: move and rotate in update or listener ?
    this.moveToTarget(this.unit.currentPosition, this.unit.targetPosition);
    this.rotateToTarget(this.unit.currentPosition, this.unit.targetPosition);

    // component
    this.healthBar.update(this.unit.currentPosition, this.health);
  }
}
