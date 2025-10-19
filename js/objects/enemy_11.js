// enemy_11.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const ANGULAR_SPEED = 10;
const RADIUS = 30;
const COOLDOWN_INTERVAL = {
    EASY : 120,
    HARD : 60
}

// Enemy_11：うねうね
export class Enemy_11 extends Enemy {

    constructor(scene){
        super(scene);
        this.shot_count = 0;
        this.z = GLOBALS.LAYER.LAYER3.Z;
        this.collision = { width :24, height : 24};
        this.state = 0;
        this.velocity = new Phaser.Math.Vector2(-6,0);
        this.duration = 60;
        this.center = new Phaser.Math.Vector2(0,0);
        this.angle = 0;
        this.target_angle = 0;
        this.angular_speed = ANGULAR_SPEED;
        this.radius = RADIUS;
        this.cw = true;
    }

    init(pos){
        super.init(pos);
        this.state = 0;

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(52);
        this.sprite.angle = 270;
    }


    update(time, delta){

        if (this.state === 0){            
            // ◆[0] 等速直線運動
            // 一定速度ベクトル V で、一定期間 T だけ直進。
            this.pos.x += this.velocity.x * GameState.ff;
            this.pos.y += this.velocity.y * GameState.ff;
            this.duration -= GameState.ff;
            if (this.duration <= 0){
                // 次の遷移：
                this.cw = Math.random() < 0.5 ? true : false;
                this.orthogonal_to_polar();
                this.target_angle = Math.random() * 150 + 30;
                this.state = 1;
            }
        } else if (this.state === 1){
            // ◆[1] 円周運動
            // 中心 center の周囲を半径 r で回転。
            // 回転方向：cw（true=時計回り、false=反時計回り）。
            // 目標角度：target_angle まで回転したら終了。
            // console.log("enemy_11 state1");
            this.update_angle();
            this.update_circle_position();
            this.sprite.angle = this.cw ? this.angle + 180 : this.angle;
            // console.log("state1:", this.angle, this.target_angle, this.angular_speed);
            if (Math.abs(Phaser.Math.Angle.WrapDegrees(this.angle - this.target_angle)) < this.angular_speed){
                // 次に遷移：
                if (Math.random() < 0.5){
                    // ◇ 再び状態１に入る（ふらふら運動）
                    this.reverse_rotation();
                    this.target_angle = Math.random() * 150 + 30;
                    this.state = 1;
                } else {
                    // ◇ 自機方向を狙う状態2に遷移
                    this.reverse_rotation();
                    this.aim_to_player();
                    this.state = 2;
                }
            }
            this.shot_count -= GameState.ff;
            if (this.shot_count < 0){
                this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
                this.shoot();
            }
        } else if (this.state === 2){
            // 狙い撃ち円周運動
            // 状態：円運動だが、目標角度は「自機方向」。
            // console.log("enemy_11 state2");
            this.update_angle();
            this.update_circle_position();
            this.sprite.angle = this.cw ? this.angle + 180 : this.angle;
            if (Math.abs(Phaser.Math.Angle.WrapDegrees(this.angle - this.target_angle)) < this.angular_speed){
                // 次に遷移
                this.polar_to_orthogonal();
                this.duration = Math.random() * 20 + 20;
                this.state = 0;
            }
        }

        super.update();

    } // End of update(); 

    update_angle() {
        // console.log("update_angle", this.state);
        const as = this.angular_speed;
        if (this.cw) {
            this.angle += as * GameState.ff;
        } else {
            this.angle -= as * GameState.ff;
        }
        this.angle = Phaser.Math.Wrap(this.angle, 0, 360);
    }

    update_circle_position(){
        // console.log("update_circcle_position", this.state);
        const rad = Phaser.Math.DegToRad(this.angle);
        this.pos.x = this.center.x + this.radius * Math.cos(rad);
        this.pos.y = this.center.y + this.radius * Math.sin(rad);
    }

    reverse_rotation(){
        // 回転方向を反転
        this.cw = !this.cw;

        // 現在の円の中心から敵の位置へのベクトル
        const dx = this.pos.x - this.center.x;
        const dy = this.pos.y - this.center.y;

        // 新しい中心 = 現在の中心 + 2 * (敵位置 - 現在中心)
        this.center.x += 2 * dx;
        this.center.y += 2 * dy;

        // 角度の再計算
        // 新しい中心を基準にして、現在位置が円周上のどの角度にあるかを求める
        this.angle = Phaser.Math.RadToDeg(Math.atan2(
            this.pos.y - this.center.y,
            this.pos.x - this.center.x
        ));
    }

    aim_to_player(){
        const dx = GameState.player.pos.x - this.pos.x;
        const dy = GameState.player.pos.y - this.pos.y;
        const d = Math.sqrt(dx*dx + dy*dy);

        // 自機が円の内側に入っていたら接線は引けないのでスキップ
        if (d <= this.radius) return;

        // 中心→自機 方向の角度
        const baseAngle = Math.atan2(dy, dx);
        // 接線の角度偏差
        const offset = Math.acos(this.radius / d);

        let targetRad;
        if (!this.cw) {
            // 時計回り → 自機に向かう側の接点は +offset 側
            targetRad = baseAngle + offset;
        } else {
            // 反時計回り → -offset 側
            targetRad = baseAngle - offset;
        }

        this.target_angle = Phaser.Math.Wrap(Phaser.Math.RadToDeg(targetRad), 0, 360);
        // console.log("aim_to_player", this.target_angle);
    }

    polar_to_orthogonal(){
        const angleRad = Phaser.Math.DegToRad(this.angle);
        const angularSpeedRad = Phaser.Math.DegToRad(this.angular_speed);

        // 接線方向の速度
        const speed = this.radius * angularSpeedRad;

        if (this.cw) {
            this.velocity.x = -speed * Math.sin(angleRad);
            this.velocity.y = speed * Math.cos(angleRad);
        } else {
            this.velocity.x = speed * Math.sin(angleRad);
            this.velocity.y = -speed * Math.cos(angleRad);
        }
    }

    orthogonal_to_polar(){
        const offsetAngle = this.cw ? Phaser.Math.DegToRad(90) : Phaser.Math.DegToRad(-90);
        const offset = this.velocity.clone().normalize().rotate(offsetAngle).scale(this.radius);
        this.center = this.pos.clone().add(offset);
        this.angle = Phaser.Math.RadToDeg(Math.atan2(this.pos.y - this.center.y, this.pos.x - this.center.x));
    }
} // End of Enemy_11