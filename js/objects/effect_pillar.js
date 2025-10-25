// effect_pillar.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { MyMath } from '../utils/MathUtils.js';
import { Effect } from './effect.js';

export class Effect_Pillar extends Effect {

    constructor(scene){
        super(scene);
    }

    init(pos){
        super.init(pos);

        this.z = Math.random()*(GLOBALS.LAYER.LAYER1.Z - GLOBALS.LAYER.LAYER3.Z) + GLOBALS.LAYER.LAYER3.Z;
        this.pos = new Phaser.Math.Vector2(MyMath.disp_x_to_global_x(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, this.z),
            GLOBALS.FIELD.HEIGHT / 2);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_effect_pillar')
        .setScale(1,10)
        .setOrigin(0.5, 0.5)
        .setFrame(0)
        .setTint(this.get_tint_from_z(this.z));

        this.scale = 2.0;

        // アニメーションの定義
        if (!this.scene.anims.exists("anims_effect_pillar")) {
            this.scene.anims.create({
                key: "anims_effect_pillar",
                defaultTextureKey: 'ss_effect_pillar',
                frames: [
                    { frame: 0, duration: 2000 },
                    { frame: 1, duration: 200 },
                    { frame: 2, duration: 200 },
                    { frame: 3, duration: 2000 },
                    { frame: 2, duration: 200 },
                    { frame: 1, duration: 200 }
                ],
                repeat: -1
            });
        }
        this.sprite.play("anims_effect_pillar");
    }

    get_tint_from_z(z){
        const t = (1 - Phaser.Math.Clamp((z - GLOBALS.LAYER.LAYER3.Z) / (GLOBALS.LAYER.LAYER1.Z - GLOBALS.LAYER.LAYER3.Z), 0, 1)) * (1.0 - 0.2) + 0.2;
        const gray = Math.round(t * 255);
        return (gray << 16) | (gray << 8) | gray;
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        if (!MyMath.inView(this.pos, this.z, 200)){
            this.alive = false;
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}