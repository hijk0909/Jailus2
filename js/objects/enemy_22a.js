// enemy_22a.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 120,
    HARD : 60
}

const SWING_FREQUENCY = 3.5;
const SWING_HEIGHT = 1.25;

// Enemy_22a： 脳みそ（本体）
export class Enemy_22a extends Enemy {

    constructor(scene){
        super(scene);
        this.speed = 1.5;
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.swing_count = 0;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(54);
    }

    update(){
        this.pos.x -= GameState.scroll_dx * this.speed;

        this.swing_count += SWING_FREQUENCY;
        this.pos.y += Math.sin((this.swing_count / 360) * 2 * Math.PI) * SWING_HEIGHT;

        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_aim();
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}