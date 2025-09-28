// effect.js
import { GLOBALS } from '../GameConst.js';
import { Effect } from './effect.js';
import { MyMath } from '../utils/MathUtils.js';

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
                frameRate: 12, repeat: 0
            });
        }
        this.sprite.on('animationcomplete', (animation, frame) => {
            if (animation.key === 'eff_exp_anims') {
                this.alive = false;
            }
        });
        this.sprite.play('eff_exp_anims');

        // パーティクルの設定
        this.set_particle();
    }

    set_particle(){
        if (!this.scene.textures.exists('img_exp')){
            let graphics = this.scene.add.graphics();
            graphics.fillStyle(0xff7000, 1);
            graphics.beginPath();
            let ox = 20;
            let oy = 20;
            graphics.moveTo(0 + ox, -20 + oy);
            graphics.lineTo(4 + ox, -4 + oy);
            graphics.lineTo(20 + ox, 0 + oy);
            graphics.lineTo(4 + ox, 4 + oy);
            graphics.lineTo(0 + ox, 20 + oy);
            graphics.lineTo(-4 + ox, 4 + oy);
            graphics.lineTo(-20 + ox, 0 + oy);
            graphics.lineTo(-4 + ox, -4 + oy);
            graphics.closePath();
            graphics.fillPath();
            graphics.generateTexture('img_expl', 40, 40);
            graphics.destroy();
        }
        this.emitter = this.scene.add.particles(0, 0, 'img_expl',{
            speed: { min: 155, max: 200 },
            scale: { start: 1, end: 0.5 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,
            blendMode: 'ADD',
            quantity: 60 // 一度に何個放出するか
        });
        this.emitter.explode(60, this.pos.x, this.pos.y); 
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