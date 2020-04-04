import Phaser from 'phaser';
import Player from '@components/player';
import { GAMECONFIG } from '@config/gameConfig';
import Mouse from '@controls/mouse';
import Camera from '@components/camera';

export default class GameScene extends Phaser.Scene {
  // world: Phaser.Physics.Matter.World;
  // player: Player;
  mainCamera: Camera;

  constructor(public player: Player, public world: Phaser.Physics.Matter.World, public mouse: Mouse) {
    super({ key: 'GameScene' });

    this.mainCamera = new Camera(0, 0, GAMECONFIG.width, GAMECONFIG.height);
  }

  init(): void {
    console.log('init gameScene');

    // init world
    this.world = this.matter.world;
    this.world.setBounds(0, 0, GAMECONFIG.width, GAMECONFIG.height);

    // Gamepad
  }

  preload(): void {
    console.log('preload stuff');
  }

  create(): void {
    this.player = new Player(this, this.world, 200, 200, 'player');
    this.mouse = new Mouse(this, this.input.manager);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.player.pointerTargetPosition(pointer.x, pointer.y);
    });

    this.mainCamera.followComponent(this.player.baseComponent);
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
    this.checkControls();
  }
}
