// enemy_8.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const WAIT_PERIOD = 120;
const GRAVITY = 1;
const TILE_SIZE = 32 / MyMath.get_disp_ratio(GLOBALS.LAYER.LAYER3.Z);
const RIGHT_AREA = GLOBALS.FIELD.WIDTH * 0.8;

// Enemy_8：ポップコーン
export class Enemy_8 extends Enemy {

    constructor(scene){
        super(scene);
        this.z = GLOBALS.LAYER.LAYER3.Z;
        this.collision = { width :36, height : 42};
        this.state = 0;
        this.state_count = 80;
        this.dx = 0;
        this.dy = 0;
    }

    init(pos){
        super.init(pos);

        this.move_to_lower();

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(27)
        .setDepth(MyMath.z_to_depth(this.z));

    }

    update(){
        super.update();

        if (this.state === 0){
            // 初期状態
            this.pos.x -= GameState.scroll_dx;
            this.dy = 3;
            this.bounded_move();
        } else if (this.state === 1){
            // 待機
            this.pos.x -= GameState.scroll_dx;
            this.state_count--;
            if (this.state_count <= 0){
                this.state = 2;
                this.dy = -20;
                if (this.pos.x > RIGHT_AREA){
                    this.dx = -4;
                } else {
                    this.dx = Math.random() < 0.5 ? -4 : +4;
                }
            }
        } else if (this.state === 2){
            this.dy += GRAVITY;
            this.bounded_move();
        }
    }

    bounded_move() {
        // X方向の移動
        let nextX = this.pos.x + this.dx;
        let checkY1 = this.pos.y - this.collision.height / 2 + 1;
        let checkY2 = this.pos.y + this.collision.height / 2 - 1;

        // 移動先の「左右辺の中点」を確認
        if (this.dx > 0) {
            // 右移動 → 右辺を確認
            let checkX = nextX + this.collision.width / 2;
            if (GameState.bg.get_terrain(checkX, checkY1) || GameState.bg.get_terrain(checkX, checkY2)) {
                let tileX = Math.floor(checkX / TILE_SIZE);
                nextX = tileX * TILE_SIZE - this.collision.width / 2;
                this.dx *= -1;
            }
        } else if (this.dx < 0) {
            // 左移動 → 左辺を確認
            let checkX = nextX - this.collision.width / 2;
            if (GameState.bg.get_terrain(checkX, checkY1) || GameState.bg.get_terrain(checkX, checkY2)){
                let tileX = Math.floor(checkX / TILE_SIZE);
                nextX = (tileX + 1) * TILE_SIZE + this.collision.width / 2;
                this.dx *= -1;
            }
        }
        this.pos.x = nextX;

        // ==== Y方向の移動 ====
        let nextY = this.pos.y + this.dy;
        let checkX1 = this.pos.x - this.collision.width / 2 + 1;
        let checkX2 = this.pos.x + this.collision.width / 2 - 2;

        if (this.dy > 0) {
            // 下移動 → 下辺を確認
            let checkY = nextY + this.collision.height / 2;
            if (GameState.bg.get_terrain(checkX1, checkY) || GameState.bg.get_terrain(checkX2, checkY)){
                // 地面に衝突
                let tileY = Math.floor(checkY / TILE_SIZE);
                nextY = tileY * TILE_SIZE - this.collision.height / 2;
                // [TEST]
                // this.dy *= -1;
                this.state = 1;
                this.state_count = WAIT_PERIOD;
            }
        } else if (this.dy < 0) {
            // 上移動 → 上辺を確認
            let checkY = nextY - this.collision.height / 2;
            if (GameState.bg.get_terrain(checkX1, checkY) || GameState.bg.get_terrain(checkX2, checkY)){
                // 天井に衝突
                let tileY = Math.floor(checkY / TILE_SIZE);
                nextY = (tileY + 1) * TILE_SIZE + this.collision.height / 2;
                // [TEST]
                // this.dy *= -1;
                this.dx = 0;
                this.state = 0;
            }
        }
        this.pos.y = nextY;
    }

    move_to_upper(){
        for (let y = 0; y < GLOBALS.FIELD.HEIGHT; y += TILE_SIZE){
            if (!GameState.bg.get_terrain(this.pos.x, y)){
                this.pos.y = y + this.collision.height / 2;
                break;
            }
        }
        return;
    }

    move_to_lower(){
        for (let y = GLOBALS.FIELD.HEIGHT - TILE_SIZE; y > 0; y -= TILE_SIZE){
            if (!GameState.bg.get_terrain(this.pos.x, y)){
                this.pos.y = y + this.collision.height / 2;
                break;
            }
        }
    }

    destroy(){
        super.destroy();
    }
}