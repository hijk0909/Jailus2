// enemy_14.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 120,
    HARD : 45
}

const ACCEL = 0.05;
const DECEL = 0.05;
const MAX_SPEED = 1.8;
const STATE_PERIOD = 45;

// Enemy_14：にじり寄り細胞
export class Enemy_14 extends Enemy {
   
    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.speed = MAX_SPEED;
        this.state = 0;
        this.state_count = STATE_PERIOD;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy14")) {
            this.scene.anims.create({key: "anims_enemy14",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 0, end: 2}),
                frameRate: 12, repeat: -1
            });
        }
        this.sprite.play("anims_enemy14");
    }

    update(){

        this.pos.x -= GameState.scroll_dx;

        if (this.state === 0){
            // [0] 停止
            this.state_count -= GameState.ff;
            if (this.state_count < 0){
                this.state = 1;
                this.state_count = STATE_PERIOD;
            }
        } else if (this.state === 1){
            // [1] 追尾・加速
            this.speed = Math.min(MAX_SPEED, this.speed + ACCEL * GameState.ff);
            this.velocity = GameState.player.pos.clone().subtract(this.pos).normalize();
            this.pos.add(this.velocity.clone().scale(this.speed * GameState.ff));
            this.state_count -= GameState.ff;
            if (this.state_count < 0){
                this.state = 2;
                this.state_count = STATE_PERIOD;
            }
        } else if (this.state === 2){
            // [2] 直進
            this.pos.add(this.velocity.clone().scale(this.speed * GameState.ff));
            this.state_count -= GameState.ff;
            if (this.state_count < 0){
                this.state = 3;
                this.state_count = STATE_PERIOD;
            }
        } else if (this.state === 3){
            // [3] 減速
            this.speed = Math.max(0, this.speed - DECEL * GameState.ff);
            this.pos.add(this.velocity.clone().scale(this.speed * GameState.ff));
            this.state_count -= GameState.ff;
            if (this.state_count < 0){
                this.state = 0;
                this.state_count = STATE_PERIOD;
                this.speed = 0;
            }
        }

        super.update();

        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_aim();
        }
    }

    destroy(){
        super.destroy();
    }
}