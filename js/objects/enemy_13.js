// enemy_13.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 60,
    HARD : 45
}

const ACCEL = 0.3;
const DECEL = 0.3;
const MAX_SPEED = 5;
const COASTING_PERIOD = 60;

// Enemy_13：イカタコ
export class Enemy_13 extends Enemy {
   
    constructor(scene){
        super(scene);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.state = 0;
        this.state_count = COASTING_PERIOD;
        this.speed = MAX_SPEED;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(64);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy13_open")) {
            this.scene.anims.create({key: "anims_enemy13_open",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 66, end: 68}),
                frameRate: 12, repeat: 0
            });
        }
        if (!this.scene.anims.exists("anims_enemy13_close")) {
            this.scene.anims.create({key: "anims_enemy13_close",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 69, end: 71}),
                frameRate: 32, repeat: 0
            });
        }
        this.sprite.on('animationcomplete', (animation, frame) => {
            if (animation.key === 'anims_enemy13_open') {
                this.state = 3;
                this.sprite.play("anims_enemy13_close");
            }
            // else if (animation.key === 'anims_enemy13_close') {
            //    this.state = 0;
            //    this.sprite.setFrame(64);
            //}
        });
    }

    update(){

        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_fix(285);
            this.shoot_fix(255);
        }

        if (this.state === 0){
            // [0] 惰性
            this.state_count -= GameState.ff;
            if (this.state_count <= 0){
                this.state = 1;
                this.sprite.setFrame(65);
            }
        } else if (this.state === 1){
            // [1] 減速
            this.speed -= Math.max(0, DECEL * GameState.ff);
            if (this.speed <= 0){
                this.speed = 0;
                this.state = 2;
                this.sprite.play("anims_enemy13_open");
            }
        } else if (this.state === 2){
            // [2] 予備動作（脚を開く）
        } else if (this.state === 3){
            // [3] 加速（脚を閉じる）
            this.speed += Math.min(MAX_SPEED, ACCEL * GameState.ff);
            if (this.speed >= MAX_SPEED){
                this.speed = MAX_SPEED;
                this.state = 0;
                this.state_count = COASTING_PERIOD;
                this.sprite.setFrame(64);
            }
        }

        this.pos.x -= this.speed * GameState.ff;
        super.update();
    }

    destroy(){
        super.destroy();
    }
}