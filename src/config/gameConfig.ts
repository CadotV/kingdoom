import BootScene from '@scenes/bootScene';
import GameScene from '@scenes/gameScene';
import Phaser from 'phaser';
import { MatterWorldConfig } from './matterConfig';

export const GAMECONFIG = {
  width: 896,
  height: 504,
};

export const GameConfig: Phaser.Types.Core.GameConfig = {
  scale: {
    mode: Phaser.Scale.FIT,
    //autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAMECONFIG.width,
    height: GAMECONFIG.height,
  },
  input: {
    keyboard: true,
    mouse: true,
    gamepad: true,
  },
  type: Phaser.AUTO,
  // TODO: don't put matter engine in every scene, some don't need physics simulation
  scene: [BootScene, GameScene],
  physics: {
    default: 'matter',
    matter: MatterWorldConfig,
  },
};
