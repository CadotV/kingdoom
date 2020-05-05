import BootScene from '@scenes/bootScene';
import MainMenuScene from '@scenes/mainMenuScene';
import GameScene from '@scenes/gameScene';
import Phaser from 'phaser';
import { MatterWorldConfig } from './matterConfig';

export const GAMECONFIG = {
  width: 896,
  height: 504,
};

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scene: [BootScene, MainMenuScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    //autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAMECONFIG.width,
    height: GAMECONFIG.height,
  },
  parent: 'phaser',
  dom: {
    createContainer: true,
  },
  input: {
    keyboard: true,
    mouse: true,
    gamepad: true,
  },
  // TODO: don't put matter engine in every scene, some don't need physics simulation
  physics: {
    default: 'matter',
    matter: MatterWorldConfig,
  },
};
