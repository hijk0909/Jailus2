// enemy_21.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 50,
    HARD : 30
}

const COLLISION_NORMAL = { width : 32, height : 48};
const COLLISION_NULL   = { width : 0, height : 0};
const STRAIGHT_SPEED = 2;
const STRAIGHT_COUNT = 60;
const SWING_TIMES = 10;
const SWING_COUNT = 8;
const WARP_TIMES = 20;
const WARP_COUNT = 3;

// Enemy_21： デジタル
export class Enemy_21 extends Enemy {

    constructor(scene){
        super(scene);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.life = 2;
        this.collision = COLLISION_NORMAL;
        this.state = 0;
        this.state_count = 120;
        this.swing_times = 0;
        this.swing_count = 0;
        this.warp_times = 0;
        this.warp_count = 0;
        this.pos_old = new Phaser.Math.Vector2(0,0);
        this.pos_new = new Phaser.Math.Vector2(0,0);
        this.velocity = new Phaser.Math.Vector2(-1,0);
    }

    init(pos){

        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy21")) {
            this.scene.anims.create({key: "anims_enemy21",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 80, end: 83}),
                frameRate: 6, repeat: -1
            });
        }
        this.sprite.play("anims_enemy21");
    }

    update(){

        if (this.state === 0){
            // [0] 直進
            this.pos.x -= STRAIGHT_SPEED * GameState.ff;
            this.state_count -= GameState.ff;
            if (this.state_count <= 0){
                this.state = 1;
                this.swing_times = SWING_TIMES;
                this.swing_count = SWING_COUNT;
                this.speed = 6;
                this.random_velocity();
            }

        } else if (this.state === 1){
            // [1] 大きく暴れる
            this.pos.add(this.velocity);
            this.swing_count -= GameState.ff;
            if (this.swing_count < 0){
                this.swing_count = SWING_COUNT;
                this.random_velocity();
                this.swing_times -= 1;
                if (this.swing_times < 0){
                    this.state = 2;
                    this.collision = COLLISION_NULL;
                    this.pos_old = this.pos.clone();
                    this.pos_new = this.pos.clone().add(GameState.player.pos).scale(0.5);
                    this.warp_times = WARP_TIMES;
                    this.warp_count = WARP_COUNT;
                }
            }
            this.shot_count -= GameState.ff;
            if (this.shot_count < 0){
                this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
                this.shoot_aim();
            }
        } else if (this.state === 2){
            // [2] ワープ
            this.warp_count -= GameState.ff;
            if (this.warp_count < 0){
                this.warp_count = WARP_COUNT;
                this.warp_times -= 1;
                this.pos = this.warp_times % 2 === 0 ? this.pos_old : this.pos_new;
                if (this.warp_times < 0){
                    this.state = 3;
                    this.collision = COLLISION_NORMAL;
                    this.swing_times = SWING_TIMES;
                    this.swing_count = SWING_COUNT;
                    this.speed = 2;
                    this.pos = this.pos_new;
                }
            }
        } else if (this.state === 3){
            // [3] 小さく暴れる
            this.pos.add(this.velocity);
            this.swing_count -= GameState.ff;
            if (this.swing_count < 0){
                this.swing_count = SWING_COUNT;
                this.random_velocity();
                this.swing_times -= 1;
                if (this.swing_times < 0){
                    this.state = 0;
                    this.state_count = STRAIGHT_COUNT;
                }
            }
        }
        super.update();
    }

    random_velocity(){
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
        this.velocity =  direction.scale(this.speed);
    }

    destroy(){
        super.destroy();
    }
}