// enemy.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = 45;

// Enemy_1：追っかけ敵
export class Enemy_1 extends Enemy {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.shot_count = COOLDOWN_INTERVAL;
        this.speed = 3.5;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy1")) {
            this.scene.anims.create({key: "anims_enemy1",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 4, end: 7}),
                frameRate: 16, repeat: -1
            });
        }
        this.sprite.play("anims_enemy1");
    }

    update(){
        this.velocity = GameState.player.pos.clone().subtract(this.pos).normalize().scale(this.speed * GameState.ff);
        this.pos.add(this.velocity);
        super.update();
        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = COOLDOWN_INTERVAL;
            this.shoot();
        }
    }

    destroy(){
        super.destroy();
    }
}