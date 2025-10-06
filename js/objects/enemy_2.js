// enemy.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';
import { Enemy } from './enemy.js';

// Enemy_2：未使用
export class Enemy_2 extends Enemy {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.speed = 2.0;
        this.center = new Phaser.Math.Vector2(600,300);
        this.center_z = MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z);
        this.radius = 250;
        this.theta = 0;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy2")) {
            this.scene.anims.create({key: "anims_enemy2",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 8, end: 11}),
                frameRate: 16, repeat: -1
            });
        }
        this.sprite.play("anims_enemy2");
    }

    update(){
        super.update();

        this.theta += 0.02;
        this.pos.x = this.center.x + this.radius * Math.sin(this.theta);
        this.pos.y = this.center.y + this.radius * Math.cos(this.theta);
        this.z = this.center_z + this.radius * Math.sin(this.theta);
    }

    destroy(){
        super.destroy();
    }
}