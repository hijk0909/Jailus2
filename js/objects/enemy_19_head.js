// enemy_19_head.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy_19 } from './enemy_19.js';

const STEP_ANGLE = 0.9;

const COOLDOWN_INTERVAL = {
    EASY : 120,
    HARD : 80
}


// Enemy_19_head：火炎竜（頭部クラス）
export class Enemy_19_head extends Enemy_19 {

    constructor(scene){
        super(scene);
        this.angle = 180;
        this.length = 20;
        this.prev = null;
        this.next = null;
        this.parent = null;
        this.life = -1;
        this.speed = 2.4;
        this.shot_count = COOLDOWN_INTERVAL.EASY;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(76);
    }

    update(){
        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_aim();
        }
        super.update();
    }

    _update_child(){
        // this.pos.x -= GameState.scroll_dx;

        this.angle = MyMath.rotate_towards_target(this.pos, GameState.player.pos, this.angle, STEP_ANGLE);
        // console.log("this.angle", this.angle);
        if (this.sprite){
            this.sprite.angle = this.angle - 180;
        }
        const angleRad = Phaser.Math.DegToRad(this.angle);
        this.pos.x += Math.cos(angleRad) * this.speed * GameState.ff;
        this.pos.y += Math.sin(angleRad) * this.speed * GameState.ff;
    }

    hit(amount){
        this.parent.hit(2);
        // super.hit(amount);
    }

    destroy(){
        super.destroy();
    }
}