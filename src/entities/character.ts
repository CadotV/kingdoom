/**
 * @author       Valentin Cadot <valentin.cadot@gmail.com>
 * @copyright    2020 KingDoom
 */

import CharacterBody from './character_parts/characterBody';
import Foot from './character_parts/foot';
import Hand from './character_parts/hand';
import Head from './character_parts/head';
import Movable from './components/movable';
import Weapon from './weapon';

export default abstract class Character extends Phaser.GameObjects.GameObject {
  speed: number;
  health: number;
  radius: number;

  characterBody: CharacterBody;
  leftHand: Hand;
  rightHand: Hand;
  weapon: Weapon;
  head: Head;
  leftFoot: Foot;
  rightFoot: Foot;

  movable: Movable;

  /** Flags */
  isDead: boolean;

  constructor(
    scene: Phaser.Scene,
    type: string,
    x: number,
    y: number,
    texture: string,
    radius: number,
    health: number,
    speed: number,
  ) {
    super(scene, type);

    if (speed) {
      this.speed = speed;
    } else {
      this.speed = 4;
    }
    this.health = health;
    this.radius = radius;
    this.isDead = false;

    this.characterBody = new CharacterBody(scene, x, y, texture, radius, type);
    this.characterBody.setName('enemy characterBody');

    this.leftHand = new Hand(
      this.scene,
      this.characterBody.getLeftPosition().x,
      this.characterBody.getLeftPosition().y,
      'enemy_hand',
      this.characterBody,
      'left',
      this.speed,
    );
    this.rightHand = new Hand(
      this.scene,
      this.characterBody.getRightPosition().x,
      this.characterBody.getRightPosition().y,
      'enemy_hand',
      this.characterBody,
      'right',
      this.speed,
    );
    // this.characterBody.width = this.characterBody.height = this.radius * 2;
    const defaultStartAngleCurve = (Math.PI / 4) * Phaser.Math.RAD_TO_DEG;
    const defaultEndAngleCurve = ((Math.PI * 7) / 4) * Phaser.Math.RAD_TO_DEG;
    const attackCurve = new Phaser.Curves.Ellipse(
      this.characterBody.x,
      this.characterBody.y,
      this.characterBody.radius,
      this.characterBody.radius,
      defaultStartAngleCurve,
      defaultEndAngleCurve,
      false,
      this.characterBody.rotation,
    );
    this.weapon = new Weapon(
      this.scene,
      this.leftHand.x,
      this.leftHand.y,
      'sword',
      this.leftHand,
      this.characterBody,
      attackCurve,
    );
    this.leftHand.attachWeapon(this.weapon);
    this.leftHand.attachAttackCurve(this.weapon.currentCurve);

    this.head = new Head(this.scene, this.characterBody.x, this.characterBody.y, 'head', this.characterBody);

    this.leftFoot = new Foot(
      this.scene,
      this.characterBody.x,
      this.characterBody.y,
      'foot',
      'left',
      this.characterBody,
      this.speed,
    );
    this.rightFoot = new Foot(
      this.scene,
      this.characterBody.x,
      this.characterBody.y,
      'foot',
      'right',
      this.characterBody,
      this.speed,
    );

    this.setState('alive');
    this.setActiveState(true);
    this.setVisibleState(true);

    this.attachListener();

    this.movable = new Movable(this.characterBody, this.speed);
  }

  attachListener(): void {
    // Scene update()
    this.scene.events.on(
      'update',
      () => {
        this.update();
      },
      this,
    );
  }

  setActiveState(state: boolean): void {
    this.leftHand.setActive(state);
    this.rightHand.setActive(state);
    this.weapon.setActive(state);
    this.head.setActive(state);
    //this.healthBar.setActive(state);
    this.characterBody.setActive(state);
    if (state === false) {
      this.weapon.world.remove(this.weapon.body);
      this.characterBody.world.remove(this.characterBody.body);
    }
    // this.player.setActive(state);
    this.setActive(state);
  }

  setVisibleState(state: boolean): void {
    this.leftHand.setVisible(state);
    this.rightHand.setVisible(state);
    this.weapon.setVisible(state);
    this.head.setVisible(state);
    //this.healthBar.clearDraw();
    this.characterBody.setVisible(state);
  }

  attack(e?: Event): void {
    if (e) {
      e.preventDefault();
    }
    this.setState('attacking');
    this.leftHand.launchAttackCurve();
    this.rightHand.launchOpposedAttackCurve();
    // reset position to avoid moving after attack
    // TODO: change the logic, player is doing a 180°
    this.characterBody.currentPosition.set(this.characterBody.x, this.characterBody.y);
    this.characterBody.targetPosition.set(this.characterBody.currentPosition.x, this.characterBody.currentPosition.y);
  }

  getHit(): void {
    if (0 < this.health) {
      this.health -= 20;
    } else {
      this.setState('dead');
    }
  }

  moveToTarget(targetPos: Phaser.Math.Vector2): void {
    this.movable.moveToTarget(this.characterBody.currentPosition, targetPos);
    this.movable.rotateToTarget(this.characterBody.currentPosition, targetPos);
  }

  moveRandom(): void {
    this.movable.moveRandom(this.characterBody.currentPosition, 128);
  }

  update(): void {
    //
  }
}
