import Camera from '@components/camera';
import Player from '@components/player';
import { GAMECONFIG } from '@config/gameConfig';
import Pointer from '@controls/pointer';
import Phaser from 'phaser';
import Ennemy from '@components/enemy';

export default class GameScene extends Phaser.Scene {
  // world: Phaser.Physics.Matter.World;
  // player: Player;
  mainCamera: Camera;

  constructor(public player: Player, public world: Phaser.Physics.Arcade.World, public pointer: Pointer) {
    super({ key: 'GameScene' });

    this.mainCamera = new Camera(0, 0, GAMECONFIG.width, GAMECONFIG.height);
  }

  init(): void {
    console.log('init gameScene');

    // init world
    this.world = this.physics.world;
    this.world.setBounds(0, 0, GAMECONFIG.width, GAMECONFIG.height);

    // Gamepad
    this.checkControls();
  }

  preload(): void {
    console.log('preload stuff');
  }

  create(): void {
    this.player = new Player(this, 200, 200, 'player');
    this.pointer = new Pointer(this, this.input.manager, 0);
    const ennemy = new Ennemy(this, 400, 400, 'ennemy', this.player);
  }

  checkControls(): void {
    if (this.input.gamepad) {
      this.input.gamepad.once('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
        console.log('gamepad connected');
        console.log(pad);
      });

      this.input.gamepad.once('disconnected', (pad: Phaser.Input.Gamepad.Gamepad) => {
        console.log('gamepad disconnected');
        console.log(pad);
      });
    }
  }

  update(): void {
    //
  }
}
