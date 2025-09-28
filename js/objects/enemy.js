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
        if (!MyMath.inView(this.pos, this.z)){
            this.alive = false;
        }
        super.update();
    }

    shoot(){
        // 敵弾の射出
        const be = new Bullet_E(this.scene);
        be.init(this.pos);
        be.set_velocity(this.pos, GameState.player.pos);
        GameState.bullets_e.push(be);
    }

    destroy(){
        super.destroy();
    }
}