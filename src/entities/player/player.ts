/**
 * @author       Valentin Cadot <valentin.cadot@gmail.com>
 * @copyright    2020 KingDoom
 */

import Character from '@entities/character';
import Movable from '@entities/components/movable';

export default class Player extends Character {
  scene: Phaser.Scene;
  speed: number;
  acceleration: number;
  radius: number;
  health: number;

  /** Flags */
  isDead: boolean;

  pad: Phaser.Input.Gamepad.Gamepad;
  padAxisH: number;
  padAxisV: number;
  isPadConnected: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, speed: number) {
    super(scene, 'player', x, y, texture, 32, 100, speed);
    this.scene = scene;

    this.speed = 8;
    this.acceleration = 0;

    this.radius = 32;
    this.health = 100;
    this.isDead = false;

    // controls
    this.isPadConnected = false;
    this.pad = this.scene.input.gamepad.getPad(0);
    this.padAxisH = 0;
    this.padAxisV = 0;
    if (this.pad) {
      this.isPadConnected = true;
    }

    this.movable = new Movable(this.characterBody, this.speed);

    this.attachListener();

    this.setState('alive');
  }
  //#endregion

  //#region listener
  attachListener(): void {
    super.attachListener();
    /** Pointer */
    // TODO: put inputs in a class (Pointer)
    // Allow movement when pointer is down but not moving
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.characterBody.targetPosition.set(pointer.worldX, pointer.worldY);
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.characterBody.targetPosition.set(pointer.worldX, pointer.worldY);
      }
    });

    /** Keyboard */
    this.scene.input.keyboard.on('keydown-SPACE', this.attack, this);

    /** GamePad */
    this.scene.input.gamepad.once('connected', () => {
      console.log('Gamepad connected');
      this.isPadConnected = true;
      this.pad = this.scene.input.gamepad.getPad(0);
    });

    this.scene.input.gamepad.once('disconnected', () => {
      this.isPadConnected = false;
      this.pad.destroy();
    });

    this.scene.input.gamepad.on('down', () => {
      console.log('down');
    });
  }
  //#endregion

  moveGamePad(leftStickVector2: Phaser.Math.Vector2): void {
    // TODO: better solution ?
    const vector2Direction = new Phaser.Math.Vector2(leftStickVector2.x, -leftStickVector2.y);
    const magnitude: number = vector2Direction.length();
    // console.log(magnitude);

    if (magnitude != 0) {
      const normDirection = vector2Direction.normalize();
      const velocity = normDirection.scale(this.speed);
      this.characterBody.angle = normDirection.angle() * Phaser.Math.RAD_TO_DEG;
      this.characterBody.setVelocity(velocity.x, velocity.y);
    } else {
      //this.characterBody.setDamping(true);
    }
  }

  // Angle controled by rightStick
  rotateGamePad(rightStickVector2: Phaser.Math.Vector2): void {
    const vector2Direction = new Phaser.Math.Vector2(rightStickVector2.x, -rightStickVector2.y);
    const magnitude: number = vector2Direction.length();
    // console.log(magnitude);

    if (magnitude != 0) {
      const normDirection = vector2Direction.normalize();
      this.characterBody.angle = normDirection.angle() * Phaser.Math.RAD_TO_DEG;
    }
  }

  //#region update
  update(): void {
    super.update();
    // TODO: move and rotate in update or listener ?
    // for prototype
    // Coupling to hand.isAttacking is bad, decouple
    if (!this.isPadConnected && !this.leftHand.isAttacking && !this.rightHand.isAttacking) {
      this.moveToTarget(this.characterBody.targetPosition);
    }

    //this.healthBar.update(this.characterBody.currentPosition, this.health);
    this.updateGamePad();
    this.scene.input.gamepad.on('down', () => {
      console.log('ki');
    });
  }

  updateGamePad(): void {
    if (this.isPadConnected) {
      if (this.pad.axes.length) {
        this.moveGamePad(this.pad.leftStick);
        this.rotateGamePad(this.pad.rightStick);
      }
    }
  }
  //#endregion
}
