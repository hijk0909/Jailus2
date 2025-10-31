// enemy_20.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 300,
    HARD : 45
}

// Enemy_20： トロコイド
export class Enemy_20 extends Enemy {

    constructor(scene){
        super(scene);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.collision = { width : 48, height : 48};
        this.trochoid = null;
        this.color_counter = 0;
        this.k_counter = 0;
        this.life = 10;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'enemy_20_canvas')
        .setOrigin(0.5, 0.5);

        // シェーダーの設定
        this.sprite.setPipeline('Trochoid');
        this.trochoid = this.scene.renderer.pipelines.get('Trochoid');
        // this.trochoid.set1f('k', this.k_counter);
        // this.trochoid.set3f('color', 1.0, 1.0, 0.0);

        const phaserColorInstance = Phaser.Display.Color.HSLToColor(Math.random(), 1, 0.65);
        this.sprite.trochoid_color = { r: phaserColorInstance.red / 256, g: phaserColorInstance.green / 256, b: phaserColorInstance.blue / 256};
        this.sprite.trochoid_k = this.k_counter;
        this.sprite.trochoid_r = Math.random()*0.17 + 0.18;
        this.sprite.trochoid_d = Math.random()*0.21 + 0.03;
    }

    update(time, delta){
        this.pos.x -= GameState.scroll_dx;
        this.k_counter += 0.0022 * GameState.ff;
        this.sprite.trochoid_k = this.k_counter;

        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_aim();
        }
        super.update();
    }

    hit(amount){
        super.hit(amount);
        if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING &&
            GameState.difficulty >= GLOBALS.DIFFICULTY.COUNTER_BULLET){
            // 打ち返し弾
            this.shoot_aim(Math.random()*360);
        }
    }

    destroy(){
        super.destroy();
    }
}