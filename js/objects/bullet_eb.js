// bullet_e.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';

const INJECTION_SPEED = 330;
const GRAVITY = 90;
const TIME_SCALE = 2.0;

export class Bullet_EB extends Bullet {
// Ballistic Missile

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.projectile_data = null;
        this.z = GLOBALS.LAYER.LAYER2.Z;
        this.collision = { width : 0, height : 0};
        this.z_lock = false;
    }

    init(pos){
        super.init(pos);
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_bullet')
        .setOrigin(0.5, 0.5)
        .setFrame(12)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER2.Z) -1)
        .setVisible(false);

    }

    // 発射初期化（呼び出し側で target と V を渡す）
    createBallistic(start, target, V) {
        const dx = target.x - start.x;
        const dz = target.z - start.z;
        const dy = -(target.y - start.y);
        const R = Math.hypot(dx, dz);
        const phi = Math.atan2(dz, dx); // 方位
        if (R === 0) {
            // 水平距離が0（※垂直投射にはしない）
            // console.warn('zero horizontal distance');
            this.alive = false;
            return null;
        }
        const V2 = V*V;
        const term = V2*V2 - GRAVITY *(GRAVITY *R*R + 2*dy*V2);
        if (term < 0) {
            // 到達不可（※初速Vが不足）
            // console.warn('no ballistic solution with this V');
            this.alive = false;
            return null;
        }
        const sqrtTerm = Math.sqrt(term);
        const tan1 = (V2 + sqrtTerm) / (GRAVITY  * R);
        // const tan2 = (V2 - sqrtTerm) / (g * R);
        const theta1 = Math.atan(tan1); // 高角寄り（通常）
        // const theta2 = Math.atan(tan2); // 低角寄り（平射に近い）

        const cosT = Math.cos(theta1);
        const sinT = Math.sin(theta1);

        this.projectile_data = {
            targetPos : target,
            startPos : start,
            t : 0,
            vx: V * cosT * Math.cos(phi),
            vy: - V * sinT, //Phaser座標用に下向き変換
            vz: V * cosT * Math.sin(phi),
            theta: theta1,
            phi: phi,
            flightTime: R / ( V * cosT),
            flightRatio : 0
        };
        // console.log("projectile_data", this.projectile_data);
        return;
    }

    updateBallistic(dt) {
        if (!this.projectile_data) return;

        const p = this.projectile_data;
        p.t += dt * TIME_SCALE;
        const sx = p.startPos.x + p.vx * p.t;
        const sz = p.startPos.z + p.vz * p.t;
        const sy = p.startPos.y + p.vy * p.t + 0.5 * GRAVITY * p.t * p.t;
        p.flightRatio = p.t / p.flightTime;

        let finalZ = sz;
        if (!this.z_lock) {
            // 目標に十分近ければロック
            if (Math.abs(finalZ - p.targetPos.z) / Math.abs(p.startPos.z - p.targetPos.z) < 0.01) {
                this.z_lock = true;
                // finalZ = p.targetPos.z;
            }
        } else {
            finalZ = p.targetPos.z;
        }

        this.pos.x = sx;
        this.pos.y = sy;
        this.z = finalZ;
        // console.log("update pos,z:", this.pos.x, this.pos.y, this.z);
    }


    set_ballistic(start_z){
        const start = {x:this.pos.x, y:this.pos.y, z:start_z};
        const target = {x:GameState.player.pos.x, y:GameState.player.pos.y, z:GLOBALS.LAYER.LAYER3.Z};
        this.createBallistic(start, target, INJECTION_SPEED);
    }

    update(time, delta){
        this.sprite.setVisible(true);
        this.updateBallistic(delta / 1000);
        if (this.z_lock){
            this.collision = { width :64, height :64};
            this.sprite.setTint(0xff8000);           
        } else {
            this.collision = { width : 0, height : 0};
            if (this.projectile_data){
                const tintColor = MyMath.get_interpolate_color(0x404040, 0xffffff, (this.projectile_data.flightRatio));
                this.sprite.setTint(tintColor);
            }
        }
        if (!MyMath.inView(this.pos, this.z)){
            this.alive = false;
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}