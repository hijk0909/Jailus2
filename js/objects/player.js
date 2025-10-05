// player.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet_PL } from '../objects/bullet_pl.js';
import { Bullet_PM } from '../objects/bullet_pm.js';

const MISSILE_CONTROL = 1.4;
const COOLDOWN_INTERVAL = 8;

export class Player extends Drawable {

    constructor(scene){
        super(scene);
        this.speed = 4.8;
        this.touch_accel = 1.2;
        this.collision = { width : 20, height : 10};
        this.count = COOLDOWN_INTERVAL;
        this.sprite_barrier = null;
    }

    init(pos){
        super.init(pos);
        // プレイヤー本体
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_player')
        .setOrigin(0.5, 0.5)
        .setFrame(0)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) - 2);
        if (!this.scene.anims.exists("anims_player")) {
            this.scene.anims.create({key: "anims_player",
                frames: this.scene.anims.generateFrameNumbers('ss_player',
                    { start: 0, end: 1}),
                frameRate: 32, repeat: -1
            });
        }
        this.sprite.play("anims_player");
        // バリア
        this.sprite_barrier = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_player')
        .setOrigin(0.5, 0.5)
        .setFrame(8)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) - 1)
        .setVisible(false);
        if (!this.scene.anims.exists("anims_player_barrier")) {
            this.scene.anims.create({key: "anims_player_barrier",
                frames: this.scene.anims.generateFrameNumbers('ss_player',
                    { start: 8, end: 10}),
                frameRate: 24, repeat: -1
            });
        }
        this.set_barrier();
    }

    update(){
        if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
            // 移動
            let dx = 0, dy = 0;
            if (GameState.i_up){dy = -1 * GameState.ff * this.speed;}
            if (GameState.i_down){dy = 1 * GameState.ff * this.speed;}
            if (GameState.i_left){dx = -1 * GameState.ff * this.speed;}
            if (GameState.i_right){dx = 1 + GameState.ff * this.speed;}
            if (GameState.i_touch){
                dx = GameState.i_dx * GameState.ff * this.touch_accel;
                dy = GameState.i_dy * GameState.ff * this.touch_accel;
            }
            this.move(dx,dy);
            // ショット発射
            if (GameState.i_button && this.count === 0){
                this.shoot_laser();
                this.shoot_missile(dx);
                this.count = COOLDOWN_INTERVAL;
            }
            this.count = Math.max(0, this.count - 1);
        }

        super.update();
        if ( this.sprite_barrier ){
            this.update_position(this.sprite_barrier);
        }
    }

    move(dx,dy){
        const x_min = MyMath.disp_x_to_global_x(0, GLOBALS.LAYER.LAYER3.Z);
        let new_x = Math.min(GLOBALS.FIELD.WIDTH,  Math.max(x_min, this.pos.x + dx));
        let new_y = Math.min(GLOBALS.FIELD.HEIGHT, Math.max(0, this.pos.y + dy));

        // ◆地形から押し戻される処理（X軸方向→Y軸方向と逐次処理する）
        if (GameState.bg.is_terrain(new Phaser.Math.Vector2(new_x, this.pos.y), this.collision)){
            new_x = this.pos.x - GameState.scroll_dx;
        }
        if (GameState.bg.is_terrain(new Phaser.Math.Vector2(new_x, new_y), this.collision)){
            new_y = this.pos.y;
        }        
        this.pos.x = new_x;
        this.pos.y = new_y;

        // 壁に押されて画面範囲外に出た場合は圧死
        if (this.pos.x < x_min){
            GameState.stage_state = GLOBALS.STAGE_STATE.FAIL; // console.log("PRESS DEATH");
            this.fail();
        }
    }

    fail(){
        if (!this.scene.anims.exists('anims_player_fail')) {
            this.scene.anims.create({key:'anims_player_fail',
                frames: this.scene.anims.generateFrameNumbers('ss_player', { start: 2, end: 7 }),
                frameRate: 12, repeat: 0
            });
        }
        this.sprite.on('animationcomplete', (animation, frame) => {
            if (animation.key === 'anims_player_fail') {
                this.alive = false;
                this.sprite.setVisible(false);
            }
        });
        this.sprite.play('anims_player_fail');
        this.erase_barrier();
    }

    shoot_laser(){
        const bp = new Bullet_PL(this.scene);
        bp.init(this.pos);
        GameState.bullets_p.push(bp);
    }

    shoot_missile(dx){
        const bpm = new Bullet_PM(this.scene);
        bpm.init(this.pos);
        bpm.set_velocity(new Phaser.Math.Vector2(dx * MISSILE_CONTROL,0));
        GameState.bullets_p.push(bpm);
    }

    // バリア関連のアクセサ
    set_barrier(){
        if (GameState.barrier > 0){
            this.sprite_barrier.setVisible(true);
            this.sprite_barrier.play("anims_player_barrier");
        }
    }
    get_barrier(){
        return GameState.barrier;
    }
    dec_barrier(){
        if (GameState.barrier > 1){
            GameState.barrier -= 1;
        } else {
            GameState.barrier = 0;
            this.erase_barrier();
        }
    }
    erase_barrier(){
        GameState.barrier = 0;
        if (this.sprite_barrier){
            this.sprite_barrier.setVisible(false);
            this.sprite_barrier.stop();
        }
    }

    destroy(){
        if (this.sprite_barrier){
            this.sprite_barrier.destroy();
            this.sprite_barrier = null;
        }
        super.destroy();
    }
}