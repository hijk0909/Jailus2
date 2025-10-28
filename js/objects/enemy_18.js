// enemy_18.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const MAX_VY = 0.3; //上下方向の速度のランダム幅

// Enemy_18： 隕石
export class Enemy_18 extends Enemy {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(-1,0);
        this.speed = 3;
        this.life = 2;
        this.score = 20;
    }

    init(pos){
        super.init(pos);

        const y = Math.random() * MAX_VY - MAX_VY / 2;
        this.velocity = new Phaser.Math.Vector2(-1,y).normalize();

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy18")) {
            this.scene.anims.create({key: "anims_enemy18",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 72, end: 75}),
                frameRate: 4, repeat: -1
            });
        }
        this.sprite.play("anims_enemy18");
    }

    update(){
        this.pos.add(this.velocity.clone().scale(this.speed * GameState.ff));
        super.update();
    }

    destroy(){
        super.destroy();
    }
}