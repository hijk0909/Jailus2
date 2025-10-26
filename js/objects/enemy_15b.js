// enemy_15b.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';
import { Enemy_15 } from './enemy_15.js';
import { spawn_vine, get_vine_pos } from './enemy_15b_spawner.js';

const COOLDOWN_INTERVAL = {
    EASY : 120,
    HARD : 30
}

const SPAWN_INTERVAL_1 = 10;
const SPAWN_INTERVAL_2 = 60;

const EXIT_SPEED = 1.5;
const STEP_ANGLE = 10;

// Enemy_15b：植物砲台（蔓）
export class Enemy_15b extends Enemy_15 {

    constructor(scene){
        super(scene);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.spawn_count = SPAWN_INTERVAL_1;
        this.life = 1;
        this.angle = 0;
        this.length = 20;
        this.score = 10;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(9);
        this.update_position(this.sprite);
        this.update_angle();
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        this.sprite.angle = this.angle + 90;

        if (!this.child){
            if (this.energy > 0){
                // 先端かつ根と繋がっているなら弾を発射
                this.shot_count -= GameState.ff;
                if (this.shot_count < 0){
                    this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
                    this.shoot_aim();
                }
            }
            if (this.energy > 1){
                // 先端かつ根と繋がり、かつ余力があれば蔓を伸ばす
                this.spawn_count -= GameState.ff;
                if (this.spawn_count < 0){
                    this.spawn_count = SPAWN_INTERVAL_2;
                    this.child = spawn_vine(this);
                }
            }
        }

        if (this.energy === 0){
            this.pos.x -= EXIT_SPEED * GameState.ff;
        } else {
            this.pos = get_vine_pos(this.parent);
            this.update_angle();
        }

        super.update();
    }

    update_angle(){
        this.angle = MyMath.rotate_towards_target(this.pos, GameState.player.pos, this.parent.angle, STEP_ANGLE);
        this.sprite.angle = this.angle + 90;
    }

    destroy(){
        super.destroy();
    }
}