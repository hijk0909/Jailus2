// effect.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Effect } from './effect.js';
import { MyMath } from '../utils/MathUtils.js';

export class Effect_Ext extends Effect {

    constructor(scene){
        super(scene);
    }

    init(pos){
        super.init(pos);
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_effect')
        .setOrigin(0.5, 0.5)
        .setFrame(0)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z));

        if (!this.scene.anims.exists('eff_ext_anims')) {
            this.scene.anims.create({key:'eff_ext_anims',
                frames: this.scene.anims.generateFrameNumbers('ss_effect', { start: 8, end: 15 }),
                frameRate: 12, repeat: 0
            });
        }
        this.sprite.on('animationcomplete', (animation, frame) => {
            if (animation.key === 'eff_ext_anims') {
                this.alive = false;
            }
        });
        this.sprite.play('eff_ext_anims');
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        super.update();
    }

    destroy(){
        super.destroy();
    }
}