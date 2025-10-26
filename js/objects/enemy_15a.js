// enemy_15a.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';
import { Enemy_15 } from './enemy_15.js';
import { spawn_vine } from './enemy_15b_spawner.js';

const SPAWN_INTERVAL = {
    EASY : 30,
    HARD : 20
}

// Enemy_15a：植物砲台（根本）
export class Enemy_15a extends Enemy_15 {

    constructor(scene){
        super(scene);
        this.spawn_count = SPAWN_INTERVAL.EASY;
        this.length = 32;
        this.life = 5;
        this.energy = 10;
        this.angle = -90;
        this.score = 200;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.7)
        .setFrame(8);
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        if (!this.child){
            this.spawn_count -= GameState.ff;
            if (this.spawn_count < 0){
                this.spawn_count = MyMath.lerp_by_difficulty(SPAWN_INTERVAL.EASY, SPAWN_INTERVAL.HARD);
                this.child = spawn_vine(this);
            }
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}