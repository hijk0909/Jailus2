// enemy.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet_E } from './bullet_e.js';
import { Bullet_EH } from './bullet_eh.js';
import { Bullet_EF } from './bullet_ef.js';

const ENEMY_CLIP_MARGIN = 400;
const FLASH_PERIOD = 2;
const FLASH_THRESHOLD = 20;

export class Enemy extends Drawable {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.collision = { width : 32, height : 32};
        this.life = 1;
        this.speed = 1;
        this.score = 100;
        this.boss = false;
        this.big_explosion = false;
        this.flash = false;
        this.flash_counter = 0;
    }

    init(pos){
        super.init(pos);
    }

    update(){
        if (this.flash_counter > 0){
            this.flash_counter -= 1;
            if (this.flash_counter <= 0){
                this.sprite.clearTint();
            }
        }
        if (!MyMath.inView(this.pos, this.z, ENEMY_CLIP_MARGIN)){
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

    shoot_homing_fix(angle = 0, offset_x = 0, offset_y = 0){
        // 敵追尾弾（ホーミング弾）の射出（固定方向）
        const beh = new Bullet_EH(this.scene);
        const pos = new Phaser.Math.Vector2(this.pos.x + offset_x, this.pos.y + offset_y);
        beh.init(pos);
        beh.set_velocity_fix(angle);
        GameState.bullets_e.push(beh);
    }

    shoot_flame_fix(angle = 0, offset_x = 0, offset_y = 0){
        // 火炎弾の射出（固定方向）
        const bef = new Bullet_EF(this.scene);
        const pos = new Phaser.Math.Vector2(this.pos.x + offset_x, this.pos.y + offset_y);
        bef.init(pos);
        bef.set_velocity_fix(angle);
        GameState.bullets_e.push(bef);
    }

    set_flash(){
        if (this.flash){
            this.flash_counter = FLASH_PERIOD;
            const tint_color = this.life > FLASH_THRESHOLD ? 0xe0e0e0 : 0xe08080;
            this.sprite.setTintFill(tint_color);
        }
    }

    hit(amount){
        this.life -= amount;
    }

    destroy(){
        super.destroy();
    }
}