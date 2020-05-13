/**
 * Basically, TypeScript has two kind of module types declaration: "local" (normal modules) and ambient (global).
 * The second kind allows to write global modules declaration that are merged with existing modules declaration.
 * What are the differences between this files?
 *
 * d.ts files are treated as an ambient module declarations only if they don't have any imports.
 * If you provide an import line, it's now treated as a normal module file, not the global one,
 * so augmenting modules definitions doesn't work.
 */

declare interface EnemyInterface extends Phaser.GameObjects.GameObject {
  attachListener(): void;
  attack(): void;
  getHit(): void;
  moveRandom(): void;
  moveToPlayer(playerPos: Phaser.Math.Vector2): void;
  moveAngle(normDirection: Phaser.Math.Vector2): void;
  distanceFromPlayer(): number;
  detectPlayer(): void;
  setActiveState(state: boolean): void;
  setVisibleState(state: boolean): void;
  update(): void;
  preUpdate(): void;
}

declare namespace Phaser.GameObjects {
  interface GameObjectFactory {
    kdEnemy(
      scene: Phaser.Scene,
      x: number,
      y: number,
      texture: string,
      player?: import('../player/player').default,
    ): EnemyInterface;
  }
}
