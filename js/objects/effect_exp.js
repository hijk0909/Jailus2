// effect.js
import { GLOBALS } from '../GameConst.js';
import { Effect } from './effect.js';
import { MyMath } from '../utils/MathUtils.js';

const DRAG = 0.95;

export class Effect_Exp extends Effect {

    constructor(scene){
        super(scene);
        this.emitter = null;
        this.graphics = null;
    }

    init(pos){
        super.init(pos);
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_effect')
        .setOrigin(0.5, 0.5)
        .setFrame(0)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z));

        // アニメーションの設定
        if (!this.scene.anims.exists('eff_exp_anims')) {
            this.scene.anims.create({key:'eff_exp_anims',
                frames: this.scene.anims.generateFrameNumbers('ss_effect', { start: 0, end: 7 }),
                frameRate: 10, repeat: 0
            });
        }
        this.sprite.on('animationcomplete', (animation, frame) => {
            if (animation.key === 'eff_exp_anims') {
                this.alive = false;
            }
        });
        this.sprite.play('eff_exp_anims');

        // パーティクルの設定
        this.update_position(this.sprite);
        this.set_particle();
    }

    set_particle(){
        this.emitter = this.scene.add.particles(0, 0, 'img_expl',{
            speed: { min: 100, max: 140},
            scale: { start: 1, end: 0.0 },
            alpha: { start: 1, end: 0.5 },
            lifespan: 500
            // blendMode: 'ADD'
        });
        this.emitter.explode(30, this.sprite.x, this.sprite.y); 
    }

    update(){
        super.update();
    }

    destroy(){
        super.destroy();
        if ( this.emitter ){
            this.emitter.destroy();
            this.emitter = null;
        }
        if ( this.graphics ){
            this.graphics.destroy();
            this.graphics = null;
        }
    }
}