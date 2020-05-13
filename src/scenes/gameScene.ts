/**
 * @author       Valentin Cadot <valentin.cadot@gmail.com>
 * @copyright    2020 KingDoom
 */

import EnemyHandPNG from '@assets/enemy_hand.png';
import HandPNG from '@assets/hand.png';
import FootPNG from '@assets/foot.png';
import EntityBodyPNG from '@assets/characterBody.png';
import HeadPNG from '@assets/head.png';
import SwordPNG from '@assets/sword.png';
import Camera from '../camera';
import Enemy from '@entities/enemy/enemy';
import Player from '@entities/player/player';
// import { GAMECONFIG } from '@config/gameConfig';
import Pointer from '@controls/pointer';
import Map from '@map/map';
import Phaser from 'phaser';

// GameObjects pool
import { KEY_ENEMY } from '@entities/enemy/enemyPool';
const INFO_FORMAT = `Size:       %1
Spawned:    %2
Despawned:  %3`;

export default class GameScene extends Phaser.Scene {
  // world: Phaser.Physics.Matter.World;
  // player: Player;
  mainCamera!: Camera;
  map!: Map;
  private infoText!: Phaser.GameObjects.Text;
  private enemies!: EnemyPoolInterface;

  constructor(public player: Player, public matterWorld: Phaser.Physics.Matter.World, public pointer: Pointer) {
    super({ key: 'GameScene' });

    // this.enemies = new Phaser.GameObjects.Group(this, { classType: Enemy });
    //this.enemies = new Phaser.GameObjects.Group(this);
  }

  init(): void {
    this.mainCamera = new Camera(0, 0, this.scale.width, this.scale.height);
    this.matterWorld = this.matter.world;
    //this.world.setBounds(0, 0, GAMECONFIG.width, GAMECONFIG.height);

    /** Tilemap */
    this.map = new Map(this);

    // Gamepad
    this.attachListener();
  }

  preload(): void {
    this.load.image('player', EntityBodyPNG);
    this.load.image('hand', HandPNG);
    this.load.image('sword', SwordPNG);
    this.load.image('enemy', EntityBodyPNG);
    this.load.image('enemy_hand', EnemyHandPNG);
    this.load.image('head', HeadPNG);
    this.load.image('foot', FootPNG);

    /** Tilemap */
    this.map.preload();
  }

  create(): void {
    this.map.createTilemap();
    this.player = new Player(this, 200, 200, 'player', 8);
    this.pointer = new Pointer(this, this.input.manager, 0);
    this.enemies = this.add.enemyPool();
    for (let index = 0; index < 1; index++) {
      //this.spawnEnemy(400, 400, KEY_ENEMY);
    }
    // this.mainCamera.followEntityBody(this.player.characterBody);
    this.cameras.main.startFollow(this.player.characterBody);
    this.infoText = this.add.text(0, 0, '');
  }

  attachListener(): void {
    if (this.input.gamepad === undefined) {
      return;
    } else {
      this.input.gamepad.once('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
        console.log('gamepad connected');
        console.log(pad);
      });
      this.input.gamepad.once('disconnected', (pad: Phaser.Input.Gamepad.Gamepad) => {
        console.log('gamepad disconnected');
        console.log(pad);
      });

      // test
      this.input.keyboard.on('keydown', (key: Phaser.Input.Keyboard.Key) => {
        if (key.keyCode === Phaser.Input.Keyboard.KeyCodes.A) {
          this.spawnEnemy(100, 100, KEY_ENEMY);
        }
      });
    }

    // this.checkCollision();
  }

  spawnEnemy(x: number, y: number, key: string) {
    if (!this.enemies) {
      return;
    }

    const enemy: Enemy = this.enemies.spawn(x, y, key, this.player);
    //this._enemies.initializeWithSize(5);

    return enemy;
  }

  // TODO: set in a separate class
  // checkCollision(): void {
  //   // TODO: add gameObjRef typing
  //   this.matter.world.on(
  //     'collisionstart',
  //     (event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
  //       if (
  //         ('weapon' === bodyA.label && 'enemy' === bodyB.label) ||
  //         ('enemy' === bodyA.label && 'weapon' === bodyB.label)
  //       ) {
  //         let gameObjRef = undefined; // Player / Enemy
  //         if (this.player.leftHand.isAttacking) {
  //           console.log('colliding');
  //           if ('enemy' === bodyA.label) {
  //             gameObjRef = bodyA.gameObject.parentRef;
  //           } else if ('enemy' === bodyB.label) {
  //             gameObjRef = bodyB.gameObject.parentRef;
  //           }
  //           gameObjRef.getHit();
  //         }
  //       }
  //     },
  //   );
  // }

  // TODO: set listener in class, too much computation while world is idle
  checkDead(): void {
    this.enemies.children.each(child => {
      const enemy = child as Enemy;
      if ('dead' === enemy.state) {
        this.enemies.despawn(enemy);
      }
    });
  }

  update(): void {
    this.checkDead();
    // Game Pool Info
    const size = this.enemies.getLength();
    const used = this.enemies.getTotalUsed();
    const text = Phaser.Utils.String.Format(INFO_FORMAT, [size, used, size - used]);
    this.infoText.setText(text);
    this.infoText.setPosition(this.cameras.main.worldView.left, this.cameras.main.worldView.top);
  }
}
