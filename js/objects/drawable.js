// drawable.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';

export class Drawable {

    constructor(scene){
        this.scene = scene;
        this.pos = new Phaser.Math.Vector2(0, 0);
        this.z = GLOBALS.LAYER.LAYER3.Z;
        this.sprite = null;
        this.alive = true;
        this.scale = 1.0;
        this.collision = { width : 32, height : 32};
        this.drawCollision = false;
        this.grahpics = null;
    }

    init(pos){
        this.pos = pos.clone();
        this.graphics = this.scene.add.graphics().setDepth(3);
    }

    update(){
        this.update_position(this.sprite)
        this.draw();
    }

    update_position(sprite){
        if (sprite){
            const x = MyMath.global_x_to_disp_x(this.pos.x, this.z);
            const y = MyMath.global_y_to_disp_y(this.pos.y, this.z);
            sprite.setPosition(x, y)
            .setScale(MyMath.z_to_sprite_scale(this.z) * this.scale)
            .setDepth(MyMath.z_to_depth(this.z));
        }
    }

    shockwave(){
        const x = MyMath.global_x_to_disp_x(this.pos.x, this.z);
        const y = MyMath.global_y_to_disp_y(this.pos.y, this.z);
        GameState.shockwave.start(new Phaser.Math.Vector2(x,y));
    }

    destroy(){
        this.alive = false;
        if ( this.sprite ){
            this.sprite.destroy();
            this.sprite = null;
        }
        if ( this.graphics ){
            this.graphics.destroy();
            this.graphics = null;
        }
    }

    set_pos(pos){
        this.pos = pos.clone();
    }

    set_z(z){
        this.z = z;
    }

    draw() {
        if ( this.drawCollision ){
            this.graphics.clear();
            this.graphics.lineStyle(2, 0xff0000);
            this.graphics.strokeRect(
                MyMath.global_x_to_disp_x(this.pos.x - this.collision.width / 2, this.z),
                MyMath.global_y_to_disp_y(this.pos.y - this.collision.height / 2, this.z),
                this.collision.width * MyMath.get_disp_ratio(this.z),
                this.collision.height * MyMath.get_disp_ratio(this.z)
            )
        }
    }


    set_alive(alive) {
        this.alive = alive;
    }

    is_alive() {
        return this.alive;
    }

}