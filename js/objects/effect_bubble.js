// effect_bubble.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { MyMath } from '../utils/MathUtils.js';
import { Effect } from './effect.js';

const UP_SPEED = 1;
const SWING_AMPLITUDE = 10.0;
const SWING_FREQUENCY = Math.PI * 0.03;

export class Effect_Bubble extends Effect {

    constructor(scene){
        super(scene);
        this.swing_counter = 0;
    }

    init(pos){
        super.init(pos);

        this.z = Math.random() *(GLOBALS.LAYER.LAYER1.Z - GLOBALS.LAYER.LAYER4.Z) + GLOBALS.LAYER.LAYER4.Z;
        this.pos = new Phaser.Math.Vector2(MyMath.disp_x_to_global_x(Math.random() * GLOBALS.FIELD.WIDTH , this.z),
            GLOBALS.FIELD.HEIGHT);
        this.x_center = this.pos.x

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_effect')
        .setOrigin(0.5, 0.5)
        .setFrame(16)
        .setTint(this.get_tint_from_z(this.z))
        .setVisible(false);

        this.scale = 0.4;

        // アニメーションの定義
        if (!this.scene.anims.exists("anims_effect_bubble")) {
            this.scene.anims.create({
                key: "anims_effect_bubble",
                frames: this.scene.anims.generateFrameNumbers('ss_effect',
                    { start: 16, end: 17}),
                frameRate: 8, repeat: -1
            });
        }
        this.sprite.play("anims_effect_bubble");
    }

    get_tint_from_z(z){
        const t = (1 - Phaser.Math.Clamp((z - GLOBALS.LAYER.LAYER4.Z) / (GLOBALS.LAYER.LAYER1.Z - GLOBALS.LAYER.LAYER4.Z), 0, 1)) * (1.0 - 0.2) + 0.2;
        const gray = Math.round(t * 255);
        return (gray << 16) | (gray << 8) | gray;
    }

    update(){
        this.swing_counter += SWING_FREQUENCY;
        // this.x_center -= GameState.scroll_dx;
        this.pos.x = this.x_center + Math.sin(this.swing_counter) * SWING_AMPLITUDE;
        this.pos.y -= UP_SPEED;
        if (!MyMath.inView(this.pos, this.z, 200)){
            this.alive = false;
        }
        this.sprite.setVisible(true);
        super.update();
    }

    destroy(){
        super.destroy();
    }
}