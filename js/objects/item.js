// item.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';

export class Item extends Drawable {

    constructor(scene){
        super(scene);
        this.collision = { width : 32, height : 32};
    }

    init(pos){
        super.init(pos);
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        super.update();
    }

    effect(){
        //取得時の効果
    }

    destroy(){
        super.destroy();
    }
}