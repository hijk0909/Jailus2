// enemy_b1.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = 50;

// Enemy_B1：ボス（ステージ１）
export class Enemy_B1 extends Enemy {

    constructor(scene){
        super(scene);
        this.z = GLOBALS.LAYER.LAYER3.Z + 10;
        this.collision = { width :100, height : 300};
        this.scale = 1.0;
        this.life = 80;
        this.speed = 0.3;
        this.count = COOLDOWN_INTERVAL;
        this.score = 3000;
    }

    init(pos){
        super.init(pos);
        this.boss = true;

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_boss_1')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_boss_1")) {
            this.scene.anims.create({key: "anims_boss_1",
                frames: this.scene.anims.generateFrameNumbers('ss_boss_1',
                    { start: 0, end: 1}),
                frameRate: 6, repeat: -1
            });
        }
        this.sprite.play("anims_boss_1");
    }

    update(){
        super.update();
        this.velocity = GameState.player.pos.clone().subtract(this.pos).normalize().scale(this.speed);
        this.pos.add(this.velocity);
        super.update();
        this.count -= 1;
        if (this.count < 0){
            this.count = COOLDOWN_INTERVAL;
            this.shoot();
            this.shoot(-15);
            this.shoot(+15);
            this.shoot(-30);
            this.shoot(+30);
        }
    }

    destroy(){
        super.destroy();
    }
}