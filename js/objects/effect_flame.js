// effect_drop.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { MyMath } from '../utils/MathUtils.js';
import { Effect } from './effect.js';

// 炎：（ステージ2）
export class Effect_Flame extends Effect {

    constructor(scene){
        super(scene);
    }

    init(pos){
        super.init(pos);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_effect')
        .setOrigin(0.5, 0.75)
        .setFrame(24)
        .setVisible(false);

        // アニメーションの定義
        if (!this.scene.anims.exists("anims_effect_flame")) {
            this.scene.anims.create({
                key: "anims_effect_flame",
                frames: this.scene.anims.generateFrameNumbers('ss_effect',
                    { start: 24, end: 26}),
                frameRate: 12, repeat: -1
            });
        }

        this.sprite.play("anims_effect_flame");
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        this.sprite.setVisible(true);
        super.update();
    }

    destroy(){
        super.destroy();
    }
}