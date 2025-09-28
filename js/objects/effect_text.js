// effect_text.js
import { Effect } from './effect.js';

const EFF_PERIOD_TEXT =120;

export class Effect_Text extends Effect {

    constructor(scene){
        super(scene);
        this.counter = 0;
        this.text = null;
        this.textObject = null;
    }

    init(pos){
        super.init(pos);
        this.counter = EFF_PERIOD_TEXT;
    }

    set_text(txt) {
        this.text = txt;
        this.textObject = this.scene.add.text(this.pos.x, this.pos.y, this.text, {
            fontFamily: 'Helvetica, Arial',
            fontSize: '28px',
            color: '#ffeedd',
            stroke: '#ff0000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
    }

    update(){
        super.update();
        const t = EFF_PERIOD_TEXT - this.counter;
        this.textObject.setPosition(this.pos.x, getBouncingY(t, this.pos.y, 30, 80));
        const dur = 20;
        if ( this.counter < dur ){
            const r = dur - this.counter;
            this.textObject.setScale(1 + r/dur);
            this.textObject.setAlpha(this.counter/dur);
        }
        this.counter -= 1;
        if (this.counter <= 0){
            this.alive = false;
        }
    }

    destroy(){
        super.destroy();
        if ( this.textObject ){
            this.textObject.destroy();
            this.textObject = null;
        }
    }
} // End of class Effect_Text

function getBouncingY(t, Y0, DY, T) {
    if (t >= T) return Y0;

    let timePassed = 0;
    let duration = T / 2;
    let height = DY;
    let cycle = 0;

    // 各バウンドのフェーズを探す
    while (t > timePassed + duration) {
        timePassed += duration;
        duration /= 2;
        height /= 2;
        cycle++;
    }

    // 現在のバウンド内での進行度（0～1）
    let localT = (t - timePassed) / duration;

    // 放物線を描く： y = -4h * (x - 0.5)^2 + h
    let offset = -4 * height * Math.pow(localT - 0.5, 2) + height;

    return Y0 - offset;
}