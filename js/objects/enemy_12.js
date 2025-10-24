// enemy_12.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 120,
    HARD : 45
}
const SPEED_X = 4;
const SPEED_Y_MAX = 2;
const SPEED_Y_ACCEL = 0.05;

// Enemy_12：鳥
export class Enemy_12 extends Enemy {
   
    constructor(scene){
        super(scene);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.speed_y = 0;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(56);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy12")) {
            this.scene.anims.create({key: "anims_enemy12",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 56, end: 61}),
                frameRate: 16, repeat: -1
            });
        }
        this.sprite.play("anims_enemy12");
    }

    update(){
        this.pos.x -= SPEED_X * GameState.ff;
        this.speed_y += this.pos.y > GameState.player.pos.y ? -SPEED_Y_ACCEL * GameState.ff : SPEED_Y_ACCEL * GameState.ff;
        this.speed_y = Math.min(SPEED_Y_MAX, Math.max(-SPEED_Y_MAX, this.speed_y));
        this.pos.y += this.speed_y;
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