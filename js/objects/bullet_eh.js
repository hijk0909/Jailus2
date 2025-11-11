// bullet_eh.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';

const STEP_ANGLE = 3.0;
const ACCEL = 0.2;
const MIN_SPEED = 3.0;
const MAX_SPEED = 8.8;

export class Bullet_EH extends Bullet {
// 敵・追跡弾（homing bullet)
    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.speed = MIN_SPEED;
        this.state = 0;
        this.collision = { width : 16, height : 16};
    }

    init(pos){
        super.init(pos);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_bullet')
        .setOrigin(0.5, 0.5)
        .setFrame(13)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) -1)
        .setVisible(false);

        // アニメーションの設定
        if (!this.scene.anims.exists('bullet_eh_anims')) {
            this.scene.anims.create({key:'bullet_eh_anims',
                frames: this.scene.anims.generateFrameNumbers('ss_bullet', { start: 13, end: 14 }),
                frameRate: 18, repeat: -1
            });
        }
        this.sprite.play('bullet_eh_anims');
    }

    update(){
        if (this.state === 0){
            this.angle = MyMath.rotate_towards_target(this.angle, this.pos, GameState.player.pos, STEP_ANGLE);
            const target_angle = Math.atan2(GameState.player.pos.y - this.pos.y, GameState.player.pos.x - this.pos.x);
            const diff_angle = Phaser.Math.Angle.Wrap(Phaser.Math.DegToRad(this.angle) - target_angle);
            if (Math.abs(diff_angle) < Phaser.Math.DegToRad(STEP_ANGLE)){
                this.state = 1;
            }
        } else if (this.state === 1){
            this.speed = Math.min(MAX_SPEED, this.speed + ACCEL * GameState.ff);
        }
        const angleRad = Phaser.Math.DegToRad(this.angle);
        this.pos.x += Math.cos(angleRad) * this.speed * GameState.ff;
        this.pos.y += Math.sin(angleRad) * this.speed * GameState.ff;

        if (!MyMath.inView(this.pos, this.z)){
            this.alive = false;
        }
        this.sprite.setVisible(true);
        super.update();
    }

    destroy(){
        super.destroy();
    }
}