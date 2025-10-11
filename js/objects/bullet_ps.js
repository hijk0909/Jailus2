// bullet_ps.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';

const ANIM_STEP_MAX = 3;

// 自弾：スプレッド
export class Bullet_PS extends Bullet {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.collision = { width : 32, height : 16};
        this.life = -1;
        this.anim_count = 0;
        this.anim_step = 0;
    }

    anim_def = {
        0: {frame: 8, collision:{width:24, height:24}, period:5},
        1: {frame: 9, collision:{width:32, height:32}, period:5},
        2: {frame:10, collision:{width:60, height:60}, period:8},
        3: {frame:11, collision:{width:60, height:60}, period:5}
    }

    init(pos){
        super.init(pos);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_bullet')
        .setOrigin(0.5, 0.5)
        .setFrame(8)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) - 1)
        .setVisible(false);

        this.anim_step = 0;
        this.set_anim();
    }

    set_velocity(vel){
        this.velocity = vel;
    }

    update(){
        this.pos.x -= GameState.scroll_dx;

        this.anim_count -= GameState.ff;
        if (this.anim_count <= 0){
            this.anim_step += 1;
            if (this.anim_step > ANIM_STEP_MAX){
                this.alive = false;
            } else {
                this.set_anim();
            }
        }

        if (!MyMath.inView(this.pos, this.z)){
            this.alive = false;
        }
        this.sprite.setVisible(true);
        super.update();
    }

    set_anim(){
        this.sprite.setFrame(this.anim_def[this.anim_step].frame);
        this.anim_count = this.anim_def[this.anim_step].period;
        this.collision = this.anim_def[this.anim_step].collision;        
    }

    _hit_terrain(){
        // 地形に当たっていても何もしない
    }

    destroy(){
        super.destroy();
    }
}