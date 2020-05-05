declare interface EnemyPoolInterface extends Phaser.GameObjects.Group {
  spawn(x: number, y: number, key: string, player: import('../player/player').default): import('./enemy').default;
  despawn(enemy: import('./enemy').default): void;
  initializeWithSize(size: number): void;
}

declare namespace Phaser.GameObjects {
  interface GameObjectFactory {
    enemyPool(): EnemyPoolInterface;
  }
}