// enemy.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet_E } from './bullet_e.js';

export class Enemy extends Drawable {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.collision = { width : 32, height : 32};
        this.life = 1;
        this.speed = 1;
        this.score = 100;
        this.boss = false;
    }

    init(pos){
        super.init(pos);
    }

    update(){
        if (!MyMath.inView(this.pos, this.z, 200)){
            this.alive = false;
        }
        super.update();
    }

    shoot_aim(angle = 0, offset_x = 0, offset_y = 0){
        // 敵弾の射出（プレイヤー方向）
        const be = new Bullet_E(this.scene);
        const pos = new Phaser.Math.Vector2(this.pos.x + offset_x, this.pos.y + offset_y);
        be.init(pos);
        be.set_velocity_aim(pos, GameState.player.pos, angle);
        GameState.bullets_e.push(be);
    }

    shoot_fix(angle = 0, offset_x = 0, offset_y = 0){
        // 敵弾の射出（固定方向）
        const be = new Bullet_E(this.scene);
        const pos = new Phaser.Math.Vector2(this.pos.x + offset_x, this.pos.y + offset_y);
        be.init(pos);
        be.set_velocity_fix(angle);
        GameState.bullets_e.push(be);
    }

    destroy(){
        super.destroy();
    }
}