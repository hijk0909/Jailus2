// enemy_b4.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = 55;

// Enemy_B4：ボス（ステージ４）
export class Enemy_B4 extends Enemy {

    constructor(scene){
        super(scene);
        this.z = GLOBALS.LAYER.LAYER3.Z + 10;
        this.collision = { width :200, height : 180};
        this.scale = 1.0;
        this.life = 140;
        this.speed = 0.3;
        this.shot_count = COOLDOWN_INTERVAL;
        this.score = 3000;
    }

    init(pos){
        super.init(pos);
        this.boss = true;

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_boss_4')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_boss_4")) {
            this.scene.anims.create({key: "anims_boss_4",
                frames: this.scene.anims.generateFrameNumbers('ss_boss_4',
                    { start: 0, end: 1}),
                frameRate: 12, repeat: -1
            });
        }
        this.sprite.play("anims_boss_4");
    }

    update(){
        super.update();
        this.velocity = GameState.player.pos.clone().subtract(this.pos).normalize().scale(this.speed * GameState.ff);
        this.pos.add(this.velocity);
        super.update();
        this.shot_count -= 1;
        if (this.shot_count < 0){
            this.shot_count = COOLDOWN_INTERVAL;
            this.shoot();
            this.shoot(0, -170);
            this.shoot(0, 170, 50);
            this.shoot(0, 0, -50);
        }
    }

    destroy(){
        super.destroy();
    }
}