// enemy.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 180,
    HARD : 30
}

// Enemy_3：固定砲台
export class Enemy_3 extends Enemy {

    constructor(scene){
        super(scene);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.life = 2;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(24);
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        this.shot_count -= 1;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot();
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}