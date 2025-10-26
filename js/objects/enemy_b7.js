// enemy_b7.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 60,
    HARD : 20
}

// Enemy_B7：ボス（ステージ７）
export class Enemy_B7 extends Enemy {

    constructor(scene){
        super(scene);
        this.z = GLOBALS.LAYER.LAYER3.Z + 10;
        this.collision = { width :120, height : 350};
        this.scale = 1.0;
        this.life = 180;
        this.speed = 0.3;
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.score = 3000;
    }

    init(pos){
        super.init(pos);
        this.boss = true;

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_boss_7')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_boss_7")) {
            this.scene.anims.create({key: "anims_boss_7",
                frames: this.scene.anims.generateFrameNumbers('ss_boss_7',
                    { start: 0, end: 1}),
                frameRate: 12, repeat: -1
            });
        }
        this.sprite.play("anims_boss_7");
    }

    update(){
        super.update();
        this.velocity = GameState.player.pos.clone().subtract(this.pos).normalize().scale(this.speed * GameState.ff);
        this.pos.add(this.velocity);
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