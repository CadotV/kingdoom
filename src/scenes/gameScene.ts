import EnemyPNG from '@assets/enemy.png';
import EnemyHandPNG from '@assets/enemy_hand.png';
import HandPNG from '@assets/hand.png';
import PlayerPNG from '@assets/player.png';
import SwordPNG from '@assets/sword.png';
import TilesetGround from '@assets/tileset_ground.png';
import TilesetWall from '@assets/tileset_wall.png';
import Camera from '@components/camera';
import Enemy from '@components/enemy/enemy';
import Player from '@components/player';
import { GAMECONFIG } from '@config/gameConfig';
import Pointer from '@controls/pointer';
import Map from '@map/map';
import Phaser from 'phaser';

// GameObjects pool
import EnemyPool, { KEY_ENEMY } from '../components/enemy/enemyPool';
const INFO_FORMAT = `Size:       %1
Spawned:    %2
Despawned:  %3`;

export default class GameScene extends Phaser.Scene {
  // world: Phaser.Physics.Matter.World;
  // player: Player;
  mainCamera: Camera;
  // tilemap: Tilemap;
  private _infoText!: Phaser.GameObjects.Text;
  private _enemies!: InterfaceEnemyPool;

  constructor(
    public player: Player,
    public matterWorld: Phaser.Physics.Matter.World,
    public pointer: Pointer,
    public map: Map,
  ) {
    super({ key: 'GameScene' });

    this.mainCamera = new Camera(0, 0, GAMECONFIG.width, GAMECONFIG.height);
    // this.enemies = new Phaser.GameObjects.Group(this, { classType: Enemy });
    //this.enemies = new Phaser.GameObjects.Group(this);
  }

  init(): void {
    console.log('init gameScene');

    // init world
    this.matterWorld = this.matter.world;
    //this.world.setBounds(0, 0, GAMECONFIG.width, GAMECONFIG.height);

    // Gamepad
    this.attachListener();
  }

  preload(): void {
    console.log('preload stuff');
    this.load.image('player', PlayerPNG);
    this.load.image('hand', HandPNG);
    this.load.image('tileset_ground', TilesetGround);
    this.load.image('tileset_wall', TilesetWall);
    this.load.image('sword', SwordPNG);
    this.load.image('enemy', EnemyPNG);
    this.load.image('enemy_hand', EnemyHandPNG);
  }

  create(): void {
    //this.map = new Map(this);
    this.player = new Player(this, 200, 200, 'player');
    this.pointer = new Pointer(this, this.input.manager, 0);
    this._enemies = this.add.enemyPool();
    for (let index = 0; index < 20; index++) {
      this.spawnEnemy(400, 400, KEY_ENEMY);
    }
    // this.mainCamera.followUnit(this.player.unit);
    this.cameras.main.startFollow(this.player.unit);
    this._infoText = this.add.text(0, 0, '');
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

    this.checkCollision();
  }

  spawnEnemy(x: number, y: number, key: string) {
    if (!this._enemies) {
      return;
    }

    const enemy: Enemy = this._enemies.spawn(x, y, key, this.player);
    //this._enemies.initializeWithSize(5);

    return enemy;
  }

  // TODO: set in a separate class
  checkCollision(): void {
    // TODO: add gameObjRef typing
    this.matter.world.on(
      'collisionstart',
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
        if (
          ('weapon' === bodyA.label && 'enemy' === bodyB.label) ||
          ('enemy' === bodyA.label && 'weapon' === bodyB.label)
        ) {
          let gameObjRef = undefined; // Player / Enemy
          if (this.player.leftHand.isAttacking) {
            console.log('colliding');
            if ('enemy' === bodyA.label) {
              gameObjRef = bodyA.gameObject.parentRef;
            } else if ('enemy' === bodyB.label) {
              gameObjRef = bodyB.gameObject.parentRef;
            }
            gameObjRef.getHit();
          }
        }
      },
    );
  }

  // TODO: set listener in class, too much computation while world is idle
  checkDead(): void {
    this._enemies.children.each(child => {
      const enemy = child as Enemy;
      if ('dead' === enemy.state) {
        this._enemies.despawn(enemy);
      }
    });
  }

  update(): void {
    this.checkDead();
    // Game Pool Info
    const size = this._enemies.getLength();
    const used = this._enemies.getTotalUsed();
    const text = Phaser.Utils.String.Format(INFO_FORMAT, [size, used, size - used]);
    this._infoText.setText(text);
    this._infoText.setPosition(this.cameras.main.worldView.left, this.cameras.main.worldView.top);
  }
}
