// player.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet_P } from '../objects/bullet_p.js';
import { Bullet_PM } from '../objects/bullet_pm.js';

const MISSILE_CONTROL = 8;

export class Player extends Drawable {

    constructor(scene){
        super(scene);
        this.speed = 4.8;
        this.collision = { width : 20, height : 10};
    }

    init(pos){
        super.init(pos);
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_player')
        .setOrigin(0.5, 0.5)
        .setFrame(0)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) - 1);
        // アニメーションの設定
        if (!this.scene.anims.exists("anims_player")) {
            this.scene.anims.create({key: "anims_player",
                frames: this.scene.anims.generateFrameNumbers('ss_player',
                    { start: 0, end: 1}),
                frameRate: 32, repeat: -1
            });
        }
        this.sprite.play("anims_player");
    }

    update(){
        let dx = 0, dy = 0;
        if (GameState.i_up){dy = -1;}
        if (GameState.i_down){dy = 1;}
        if (GameState.i_left){dx = -1;}
        if (GameState.i_right){dx = 1;}
        this.move(dx,dy);
        super.update();

        if (GameState.i_button && !GameState.i_button_before){
            this.shoot_laser();
            this.shoot_missile(dx);
        }
    }

    move(dx,dy){
        const x_min = MyMath.disp_x_to_global_x(0, GLOBALS.LAYER.LAYER3.Z);
        let new_x = Math.min(GLOBALS.FIELD.WIDTH,  Math.max(x_min, this.pos.x + dx * this.speed));
        let new_y = Math.min(GLOBALS.FIELD.HEIGHT, Math.max(0, this.pos.y + dy * this.speed));

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

        // 消失点の移動
        const VANISH_POINT_MIN = 100;
        const VANISH_POINT_MAX = GLOBALS.FIELD.HEIGHT - 100;
        GameState.vanish_point = this.pos.y / GLOBALS.FIELD.HEIGHT * (VANISH_POINT_MAX - VANISH_POINT_MIN) + VANISH_POINT_MIN;
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
    }

    shoot_laser(){
        const bp = new Bullet_P(this.scene);
        bp.init(this.pos);
        GameState.bullets_p.push(bp);
    }

    shoot_missile(dx){
        const bpm = new Bullet_PM(this.scene);
        bpm.init(this.pos);
        bpm.set_velocity(new Phaser.Math.Vector2(dx * MISSILE_CONTROL,0));
        GameState.bullets_p.push(bpm);
    }

    destroy(){
        super.destroy();
    }
}