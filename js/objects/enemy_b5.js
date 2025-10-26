// enemy_b5.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 90,
    HARD : 30
}
const MIN_X = GLOBALS.FIELD.WIDTH * 0.7;

// Enemy_B5：ボス（ステージ５）
export class Enemy_B5 extends Enemy {

    constructor(scene){
        super(scene);
        this.z = GLOBALS.LAYER.LAYER3.Z + 10;
        this.collision = { width :100, height : 280};
        this.scale = 1.0;
        this.life = 150;
        this.speed = 0.3;
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.score = 3000;
    }

    init(pos){
        super.init(pos);
        this.boss = true;

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_boss_5')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_boss_5")) {
            this.scene.anims.create({key: "anims_boss_5",
                frames: this.scene.anims.generateFrameNumbers('ss_boss_5',
                    { start: 0, end: 1}),
                frameRate: 12, repeat: -1
            });
        }
        this.sprite.play("anims_boss_5");
    }

    update(){
        super.update();
        this.velocity = GameState.player.pos.clone().subtract(this.pos).normalize().scale(this.speed * GameState.ff);
        this.pos.add(this.velocity);
        this.pos.x = Math.max(MIN_X, this.pos.x);
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