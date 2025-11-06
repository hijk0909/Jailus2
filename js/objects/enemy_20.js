// enemy_20.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 300,
    HARD : 45
}

// Enemy_20： トロコイド（スピロデザイン）
export class Enemy_20 extends Enemy {

    constructor(scene){
        super(scene);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.collision = { width : 48, height : 48};
        this.trochoid = null;
        this.color_counter = 0;
        this.k_speed = 0;
        this.k_phase = 0;
        this.k_offset = 0;
        this.k_amplitude = 0;
        this.life = 10;
        this.score = 300;
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

        const H = Math.random();
        const L = 0.6 + 0.25 * Math.sin(H * 2 * Math.PI - Math.PI * 0.5);
        const phaserColorInstance = Phaser.Display.Color.HSLToColor(H, 1, L);
        this.sprite.trochoid_color = { r: phaserColorInstance.red / 256, g: phaserColorInstance.green / 256, b: phaserColorInstance.blue / 256};
        this.sprite.trochoid_R = 0.40;
        // this.sprite.trochoid_r = 0.08 + 0.25 * Math.random();
        const fraction = this.get_reduced_fraction();
        this.sprite.trochoid_r = this.sprite.trochoid_R * (fraction.numerator / fraction.denominator);
        this.sprite.trochoid_d = 0.14 + 0.45 * Math.random();
        this.sprite.trochoid_k = 0;

        this.k_speed = 0.032;
        this.k_phase = Math.random() * Math.PI * 2;
        this.k_offset = 0.75;
        this.k_amplitude = 5.5;
    }

    update(time, delta){
        this.pos.x -= GameState.scroll_dx;

        this.k_phase += this.k_speed * GameState.ff;
        this.sprite.trochoid_k = this.k_amplitude * (Math.cos(this.k_phase)*0.5 + 0.5) + this.k_offset;

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

    get_reduced_fraction() {
        // 最大公約数を求める関数
        function gcd(a, b) {
            return b === 0 ? a : gcd(b, a % b);
        }

        // 分母が一定範囲の、すべての既約分数を生成
        const fractions = [];
        for (let denom = 2; denom <= 7; denom++) {
            for (let numer = 1; numer < denom; numer++) {
                if (gcd(numer, denom) === 1) {
                    fractions.push({ numerator: numer, denominator: denom });
                }
            }
        }

        // ランダムに1つ選択
        const randomIndex = Math.floor(Math.random() * fractions.length);
        return fractions[randomIndex];
    }
}