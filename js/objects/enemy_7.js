// enemy_7.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = 120;
const SPEED = 2.5;

// Enemy_7：サカナ
export class Enemy_7 extends Enemy {

    constructor(scene){
        super(scene);
        this.speed = SPEED;
        this.count = COOLDOWN_INTERVAL;
        this.z = GLOBALS.LAYER.LAYER3.Z;
        this.collision = { width :12, height : 24};
        this.state = 0;
        this.state_count = 80;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(32)
        .setDepth(MyMath.z_to_depth(this.z));

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy7_to_right")) {
            this.scene.anims.create({key: "anims_enemy7_to_right",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 32, end: 39}),
                frameRate: 16, repeat: 0
            });
        }
        if (!this.scene.anims.exists("anims_enemy7_to_left")) {
            this.scene.anims.create({key: "anims_enemy7_to_left",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 39, end: 32}),
                frameRate: 16, repeat: 0
            });
        }
        this.sprite.on('animationcomplete', (animation, frame) => {
            if (animation.key === 'anims_enemy7_to_left') {
                this.state = 0;
                this.state_count = Math.random()*20 + 40;
            } else if (animation.key === 'anims_enemy7_to_right') {
                this.state = 2;
                this.state_count = Math.random()*20 + 30;
            }
        });

    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        super.update();
        this.count -= 1;
        if (this.count < 0){
            this.count = COOLDOWN_INTERVAL;
            this.shoot();
        }
        if (this.state === 0){
            // ▼左に直進
            this.state_count--;
            this.pos.x -= this.speed * GameState.ff;
            if (this.state_count <= 0){
                this.state = 1;
                this.sprite.play("anims_enemy7_to_right");
                this.dy = Math.random() < 0.5 ? -1 : 1;
            }
        } else if (this.state === 1){
            // ▼右へ反転
            this.pos.y += this.dy;
        } else if (this.state === 2){
            // ▼右に直進
            this.state_count--;
            this.pos.x += this.speed * GameState.ff;
            if (this.state_count <= 0){
                this.state = 3;
                this.sprite.play("anims_enemy7_to_left");
            }
        } else if (this.state === 3){
            // ▼左へ反転
            this.pos.y += this.dy;
        }

    }
    
    destroy(){
        super.destroy();
    }
}