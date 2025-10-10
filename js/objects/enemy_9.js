// enemy_9.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = 240;
const SPEED = 2.5;
const TILE_SIZE = 32 / MyMath.get_disp_ratio(GLOBALS.LAYER.LAYER3.Z);

const DIR = {
    UP : 0,
    RIGHT : 1,
    DOWN : 2,
    LEFT : 3
}

const VEC = {
    0 : new Phaser.Math.Vector2(0, -1),
    1 : new Phaser.Math.Vector2(1, 0),
    2 : new Phaser.Math.Vector2(0, 1),
    3 : new Phaser.Math.Vector2(-1, 0)
}

// Enemy_9：歯車
export class Enemy_9 extends Enemy {

    constructor(scene){
        super(scene);
        this.speed = SPEED;
        this.count = COOLDOWN_INTERVAL;
        this.z = GLOBALS.LAYER.LAYER3.Z;
        this.collision = { width :24, height : 24};
        this.state = 0;
        this.clockwise = true;
        this.dir = DIR.LEFT;
        this.current_tile_x = 0;
        this.current_tile_y = 0;
        this.grahpics = null;
    }

    init(pos){

        super.init(pos);
        this.state = 0;
        this.move_to_empty();

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(12);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy9_clockwise")) {
            this.scene.anims.create({key: "anims_enemy9_clockwise",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 12, end: 15}),
                frameRate: 16, repeat: -1
            });
        }
        if (!this.scene.anims.exists("anims_enemy9_counterclockwise")) {
            this.scene.anims.create({key: "anims_enemy9_counterclockwise",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 15, end: 12}),
                frameRate: 16, repeat: -1
            });
        }

        this.graphics = this.scene.add.graphics().setDepth(3);
    }

    update(time, delta){
        let moveAmount = this.speed * GameState.ff;
        let nextPos = this.pos.clone().add(VEC[this.dir].clone().scale(moveAmount));

        if (this.state === 0){
            // 【フリーモード】
            const aheadPos = this.getAheadPos(nextPos, this.dir);
            if (this.isHittingTile(aheadPos)){
                this.state = 1;
                this.setCurrentTile(aheadPos);
                if (nextPos.y < GLOBALS.FIELD.HEIGHT / 2){
                    this.sprite.play("anims_enemy9_clockwise");
                    this.dir = DIR.DOWN;
                    this.clockwise = true;
                } else {
                    this.sprite.play("anims_enemy9_counterclockwise");
                    this.dir = DIR.UP;
                    this.clockwise = false;
                }
            }
        } else if (this.state === 1){
            // 【吸着モード】

            this.count -= 1;
            if (this.count < 0){
                this.count = COOLDOWN_INTERVAL;
                this.shoot();
            }

            const aheadPos = this.getAheadPos(nextPos, this.dir);
            if (this.isHittingTile(aheadPos)) {
                // １．進行方向に障害物があった
                this.setCurrentTile(aheadPos);
                if (!this.clockwise){
                    this.dir = (this.dir === 3) ? 0 : this.dir + 1 ;
                } else {
                    this.dir = (this.dir === 0) ? 3 : this.dir - 1 ;
                }
                nextPos = this.getAlignedPos(nextPos,this.dir, this.clockwise);
            } else if (this.isLeavingCurrentTile(nextPos, this.dir)) {
                // ２．現在吸着しているタイルから離れようとしている
                let sidePos = this.getSidePos(nextPos, this.dir, this.clockwise);
                if (this.isHittingTile(sidePos)){
                    // 次のタイルに吸着しつつ直進
                    this.setCurrentTile(sidePos);
                    // ★以下の１行は本来は省略可能なはず
                    nextPos = this.getAlignedPos(nextPos,this.dir, this.clockwise);
                } else {
                    // 同じタイルに吸着しつつ曲がる
                    if (this.clockwise){
                        this.dir = (this.dir === 3) ? 0 : this.dir + 1 ;
                    } else {
                        this.dir = (this.dir === 0) ? 3 : this.dir - 1 ;
                    }
                    nextPos = this.getAlignedPos(nextPos,this.dir, this.clockwise);
                }
            } else {
                // そのまま進む
            }
            nextPos.x -= GameState.scroll_dx;
            this.current_tile_x -= GameState.scroll_dx;
        }
        this.pos = nextPos;
        super.update();
        this.draw();
    } // End of update();

    move_to_empty(){
        let start_y = this.pos.y;
        for (let diff = 0; diff < GLOBALS.FIELD.HEIGHT; diff += TILE_SIZE){
            if (start_y + diff < GLOBALS.FIELD.HEIGHT){
                if (!GameState.bg.is_terrain_at_point(this.pos.x, start_y + diff)){
                    this.pos.y = start_y + diff;
                    break;
                }
            }
            if (start_y - diff > 0){
                if (!GameState.bg.is_terrain_at_point(this.pos.x, start_y - diff)){
                    this.pos.y = start_y - diff;
                    break;
                }
            }
        }
    }

    isHittingTile(pos){
        return GameState.bg.is_terrain_at_point(pos.x, pos.y);
    }

    isLeavingCurrentTile(pos, dir){
        const back_x = pos.x - VEC[dir].x * this.collision.width / 2;
        const back_y = pos.y - VEC[dir].y * this.collision.height / 2;
        if (dir === DIR.UP){
            if (back_y < this.current_tile_y) return true;
        } else if (dir === DIR.DOWN){
            if (back_y > this.current_tile_y + TILE_SIZE - 1) return true;
        } else if (dir === DIR.LEFT){
            if (back_x < this.current_tile_x ) return true;
        } else if (dir === DIR.RIGHT){
            if (back_x > this.current_tile_x + TILE_SIZE - 1) return true;
        }
        return false;
    }

    setCurrentTile(pos){
        const tile = GameState.bg.get_tile(pos.x, pos.y);
        if (tile && tile.index !== -1){
            const tilePos = MyMath.map_pos_to_global_pos(new Phaser.Math.Vector2(tile.pixelX, tile.pixelY));
            this.current_tile_x = tilePos.x;
            this.current_tile_y = tilePos.y;
            // console.log("setCurrentTile", pos, tilePos);
        }   
    }

    getAheadPos(pos, dir){
        const ahead_x = pos.x + VEC[dir].x * this.collision.width / 2;
        const ahead_y = pos.y + VEC[dir].y * this.collision.height / 2;
        return new Phaser.Math.Vector2(ahead_x, ahead_y);
    }

    getSidePos(pos, dir, cw){
        let offset_x = 0;
        let offset_y = 0;
        if (cw){
            // 時計回り
            if  (dir === DIR.UP){
                offset_x = TILE_SIZE;
            } else if (dir === DIR.RIGHT){
                offset_y = TILE_SIZE;
            } else if (dir === DIR.DOWN){
                offset_x = -TILE_SIZE;
            } else if (dir === DIR.LEFT){
                offset_y = -TILE_SIZE;
            }
        } else {
            // 反時計回り
            if  (dir === DIR.UP){
                offset_x = -TILE_SIZE;
            } else if (dir === DIR.RIGHT){
                offset_y = - TILE_SIZE;
            } else if (dir === DIR.DOWN){
                offset_x = TILE_SIZE;
            } else if (dir === DIR.LEFT){
                offset_y = TILE_SIZE;
            }
        }
        return new Phaser.Math.Vector2(pos.x + offset_x, pos.y + offset_y);
    }

    getAlignedPos(pos, dir, cw){
        let new_x = pos.x;
        let new_y = pos.y;
        if (cw){
            // 時計回り
            if  (dir === DIR.UP){
                new_x = this.current_tile_x - this.collision.width / 2;
            } else if (dir === DIR.RIGHT){
                new_y = this.current_tile_y - this.collision.height /2;
            } else if (dir === DIR.DOWN){
                new_x = this.current_tile_x + TILE_SIZE + this.collision.width / 2;
            } else if (dir === DIR.LEFT){
                new_y = this.current_tile_y + TILE_SIZE + this.collision.height / 2;
            }
        } else {
            // 反時計回り
            if  (dir === DIR.UP){
                new_x = this.current_tile_x + TILE_SIZE + this.collision.width / 2;
            } else if (dir === DIR.RIGHT){
                new_y = this.current_tile_y + TILE_SIZE + this.collision.height / 2;
            } else if (dir === DIR.DOWN){
                new_x = this.current_tile_x - this.collision.width / 2;
            } else if (dir === DIR.LEFT){
                new_y = this.current_tile_y - this.collision.height /2;
            }
        }
        return new Phaser.Math.Vector2(new_x, new_y);        
    }

    draw() {
        if (this.state === 1){
            this.graphics.clear();
            this.graphics.lineStyle(2, 0xff0000);
            this.graphics.strokeRect(
                MyMath.global_x_to_disp_x(this.current_tile_x, this.z),
                MyMath.global_y_to_disp_y(this.current_tile_y, this.z),
                TILE_SIZE * MyMath.get_disp_ratio(this.z),
                TILE_SIZE * MyMath.get_disp_ratio(this.z));
        }
    }

    destroy(){
        if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING &&
            this.state === 0){
            // 打ち返し弾
            this.shoot();
        }
        super.destroy();
    }

} // End of Enemy_9