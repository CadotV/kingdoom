import Phaser from 'phaser';
import { GameConfig } from './config/gameConfig';

window.addEventListener('gamepadconnected', e => {
  console.log('Gamepad connected');
});

const game = new Phaser.Game(GameConfig);
