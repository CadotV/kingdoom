import Enemy from './enemy';
import Player from '@entities/player/player';

const KEY_ENEMY = 'enemy';

export default class EnemyPool extends Phaser.GameObjects.Group implements EnemyPoolInterface {
  constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {}) {
    const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
      classType: Enemy,
      maxSize: -1,
    };

    super(scene, Object.assign(defaults, config));
  }

  spawn(x = 0, y = 0, key: string = KEY_ENEMY, player: Player): Enemy {
    const enemy: Enemy = this.get(x, y, key);
    enemy.player = player;

    enemy.setActiveState(true);
    enemy.setVisibleState(true);

    return enemy;
  }

  despawn(enemy: Enemy): void {
    this.kill(enemy);
    enemy.setActiveState(false);
    enemy.setVisibleState(false);
  }

  initializeWithSize(size: number): void {
    if (this.getLength() > 0 || size <= 0) {
      return;
    }

    this.createMultiple({
      key: KEY_ENEMY,
      quantity: size,
      visible: false,
      active: false,
    });
  }

  /** Extends methods */
  // instead of instantiating class directly, use the Factory
  create(x: number, y: number, key: string, frame: string | number, visible: boolean, active: boolean): EnemyInterface {
    if (x === undefined) {
      x = 0;
    }
    if (y === undefined) {
      y = 0;
    }
    if (key === undefined) {
      key = this.defaultKey;
    }
    if (frame === undefined) {
      frame = this.defaultFrame;
    }
    if (visible === undefined) {
      visible = true;
    }
    if (active === undefined) {
      active = true;
    }

    // TODO: set isFull functionnal
    //  Pool?
    // if (this.isFull()) {
    //   return null;
    // }

    const child: EnemyInterface = this.scene.add.kdEnemy(this.scene, x, y, key); // Factory pattern

    child.setActive(active);

    this.add(child);

    return child;
  }
}

Phaser.GameObjects.GameObjectFactory.register('enemyPool', function() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return this.updateList.add(new EnemyPool(this.scene));
});

// TODO: put in a const file
export { KEY_ENEMY };
