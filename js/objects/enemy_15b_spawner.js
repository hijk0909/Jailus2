// enemy_15b_spawn.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Enemy_15b } from './enemy_15b.js';

export function spawn_vine(parent) {
        const enemy = new Enemy_15b(parent.scene);
        const pos = get_vine_pos(parent);
        enemy.parent = parent;
        enemy.energy = Math.max(1, parent.energy - 1);
        enemy.init(pos);
        GameState.enemies.push(enemy);
        return enemy;
}

export function get_vine_pos(parent) {
        const rad = Phaser.Math.DegToRad(parent.angle);
        const offsetX = Math.cos(rad) * parent.length;
        const offsetY = Math.sin(rad) * parent.length;
        return new Phaser.Math.Vector2(parent.pos.x + offsetX, parent.pos.y + offsetY);
}