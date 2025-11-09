// effect_drop.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { MyMath } from '../utils/MathUtils.js';
import { Effect } from './effect.js';

const Y_OFFSET = 64;
const Z_OFFSET = 2;
const Y_ACCEL = 0.1;

// しずく：（ステージ8）
export class Effect_Drop extends Effect {

    constructor(scene){
        super(scene);
        this.state = 0;
        this.speed = 0;
        this.scale = 0.8;
    }

    init(pos){
        super.init(pos);

        this.z = Math.random() *(GLOBALS.LAYER.LAYER2.Z - GLOBALS.LAYER.LAYER3.Z) + GLOBALS.LAYER.LAYER3.Z + Z_OFFSET;
        this.pos = new Phaser.Math.Vector2(MyMath.disp_x_to_global_x((Math.random() * 1.5)* GLOBALS.FIELD.WIDTH , this.z),
            0); //上端にに設定

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y + Y_OFFSET, 'ss_effect')
        .setOrigin(0.5, 0.5)
        .setFrame(23)
        .setTint(this.get_tint_from_z(this.z))
        .setVisible(false);
        this.sprite.flipY = true;

        // アニメーションの定義
        if (!this.scene.anims.exists("anims_effect_drop_start")) {
            this.scene.anims.create({
                key: "anims_effect_drop_start",
                frames: this.scene.anims.generateFrameNumbers('ss_effect',
                    { start: 23, end: 18}),
                frameRate: 12, repeat: 0
            });
        }
        if (!this.scene.anims.exists("anims_effect_drop_end")) {
            this.scene.anims.create({
                key: "anims_effect_drop_end",
                frames: this.scene.anims.generateFrameNumbers('ss_effect',
                    { start: 18, end: 23}),
                frameRate: 12, repeat: 0
            });
        }

        this.sprite.on('animationcomplete', (animation, frame) => {
            if (animation.key === 'anims_effect_drop_start') {
                this.state = 1;
                console.log("animationComplete[state 0 end]", this.state);
            } else if (animation.key === 'anims_effect_drop_end') {
                this.alive = false;
            }
        });

        this.sprite.play("anims_effect_drop_start");
        this.sprite.flipY = true;
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        this.sprite.setVisible(true);
        if (this.state === 0){
            // ◆[0] アニメーション終了待ち
        } else if (this.state === 1 ){
            // ◆[1] 落下中
            this.speed += Y_ACCEL * GameState.ff;
            this.pos.y += this.speed;
            // console.log("drop", this.pos.y);
            if (this.pos.y >=  GLOBALS.FIELD.HEIGHT - Y_OFFSET){
                this.sprite.flipY = false;
                this.state = 2;
                this.sprite.play("anims_effect_drop_end");
            }
        } else if (this.state === 2 ){
            // ◆[2] アニメーション終了待ち
        }

        super.update();
    }

    get_tint_from_z(z){
        const t = (1 - Phaser.Math.Clamp((z - GLOBALS.LAYER.LAYER3.Z) / (GLOBALS.LAYER.LAYER2.Z - GLOBALS.LAYER.LAYER3.Z), 0, 1)) * (1.0 - 0.2) + 0.2;
        const gray = Math.round(t * 255);
        return (gray << 16) | (gray << 8) | gray;
    }

    destroy(){
        super.destroy();
    }
}