// enemy_10.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Enemy } from './enemy.js';

const SPEED_MAX = 24;
const ACCEL = 0.4;
const ACCEL_INTERVAL = 12;
const LINEAR_INTERVAL = 38;
const STOP_INTERVAL = 10;

const DIR = {
    UP : 0,
    RIGHT : 1,
    DOWN : 2,
    LEFT : 3
}

const VEC = {
    0 : new Phaser.Math.Vector2(0, -1),
    1 : new Phaser.Math.Vector2(1, 0),
    2 : new Phaser.Math.Vector2(0, 1),
    3 : new Phaser.Math.Vector2(-1, 0)
}

const FRAME_MOVE = [
    [47, 48],
    [43, 44],
    [45, 46],
    [41, 42]
];

const FRAME_STAY = [40, 49, 50, 49, 40];

// Enemy_10：目玉
export class Enemy_10 extends Enemy {

    constructor(scene){
        super(scene);
        this.speed = 0;
        this.accel = this.accel;
        this.z = GLOBALS.LAYER.LAYER3.Z;
        this.collision = { width :24, height : 24};
        this.state = 0;
        this.state_count = ACCEL_INTERVAL;
        this.stay = 0;
        this.stay_count = 0;
        this.dir = DIR.LEFT;
    }

    init(pos){

        super.init(pos);
        this.state = 0;

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(40);
    }

    update(time, delta){

        this.pos.x -= GameState.scroll_dx;

        if (this.state === 0){
            // 0.加速
            this.sprite.setFrame(FRAME_MOVE[this.dir][0]);
            this.speed = Math.min(SPEED_MAX, this.speed + ACCEL * GameState.ff);
            this.pos.x += VEC[this.dir].x * GameState.ff * this.speed;
            this.pos.y += VEC[this.dir].y * GameState.ff * this.speed;
            this.state_count -= GameState.ff;
            if (this.state_count <= 0){
                this.state = 1;
                this.state_count = LINEAR_INTERVAL;
            }
        } else if (this.state === 1){
            // 1.等速
            this.sprite.setFrame(FRAME_MOVE[this.dir][1]);
            this.pos.x += VEC[this.dir].x * GameState.ff * this.speed;
            this.pos.y += VEC[this.dir].y * GameState.ff * this.speed;
            this.state_count -= GameState.ff;
            if (this.state_count <= 0){
                this.state = 2;
                this.state_count = ACCEL_INTERVAL;
            }
        } else if (this.state === 2){
            // 2.減速
            this.sprite.setFrame(FRAME_MOVE[this.dir][0]);
            this.speed = Math.max(0, this.speed - ACCEL * GameState.ff);
            this.pos.x += VEC[this.dir].x * GameState.ff * this.speed;
            this.pos.y += VEC[this.dir].y * GameState.ff * this.speed;
            this.state_count -= GameState.ff;
            if (this.state_count <= 0){
                this.state = 3;
                this.stay = 0;
                this.stay_count = 10;
            }
        } else if (this.state === 3){
            // 3.まばたき
            this.stay_count -= GameState.ff;
            if (this.stay_count < 0){
                this.stay += 1;
                this.stay_count = 10;
                if (this.stay > 4){
                    this.state = 4;
                    this.state_count = STOP_INTERVAL;
                    this.shoot_fix(-45);
                    this.shoot_fix(-135);
                    this.shoot_fix(45);
                    this.shoot_fix(135);
                }
            }
            this.sprite.setFrame(FRAME_STAY[this.stay]);
        } else if (this.state === 4){
            // 4.停止
            this.sprite.setFrame(FRAME_STAY[0]);
            this.state_count -= GameState.ff;
            if (this.state_count <= 0){
                this.state = 0;
                this.state_count = ACCEL_INTERVAL;
                const dx = this.pos.x - GameState.player.pos.x;
                const dy = this.pos.y - GameState.player.pos.y;
                if (Math.abs(dx) > Math.abs(dy)){
                    this.dir = dx < 0 ? DIR.RIGHT : DIR.LEFT;
                } else {
                    this.dir = dy < 0 ? DIR.DOWN : DIR.UP;
                }
            }
        }
        super.update();

    } // End of update();

    destroy(){
        super.destroy();
    }

} // End of Enemy_9