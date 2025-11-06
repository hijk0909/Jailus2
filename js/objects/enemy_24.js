// enemy_24.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';
import { Enemy_24a } from './enemy_24a.js';
import { Effect_Exp } from './effect_exp.js';

const NUM_SATELLITE = 8;
const STEP_ANGLE = 1;
const ROTATE_ACCEL_AMPLITUDE = 5;
const ROTATE_ACCEL_SPEED = 0.02;
const ORBIT_RADIUS = 64;
const ORBIT_MODULATION_AMPLITUDE = 16;
const ORBIT_MODULATION_SPEED = 0.02;
const COLOR_CHANGE_SPEED = 1;

const COOLDOWN_INTERVAL = {
    EASY : 140,
    HARD : 80
}

// Enemy_24：曼荼羅（コア）
export class Enemy_24 extends Enemy {

    constructor(scene){
        super(scene);
        this.children = [NUM_SATELLITE];
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.collision = { width : 48, height : 48};
        this.angle = 0;
        this.life = 2;
        this.rotate_angle = 0;
        this.rotate_accel_phase = 0;
        this.orbit_modulation_phase = 0;
        this.color_change_phase = 0;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(86);

        for (let i = 0; i < NUM_SATELLITE; i++){
            const child =new Enemy_24a(this.scene);
            child.init(pos);
            GameState.enemies.push(child);
            this.children[i] = child;
        }
        this.update_children(this.children, this.pos, this.angle);
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        this.angle += STEP_ANGLE * GameState.ff;
        this.sprite.angle = this.angle;
        this.sprite.setTint(this.tint_color(this.angle));
        this.update_children(this.children, this.pos);

        super.update();

        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_fix(45);
            this.shoot_fix(135);
            this.shoot_fix(225);
            this.shoot_fix(315);
            if (GameState.difficulty >= 350){
                this.shoot_fix(0);
                this.shoot_fix(90);
                this.shoot_fix(180);
                this.shoot_fix(270);
            }
        }
    }

    update_children(){
        this.rotate_accel_phase += ROTATE_ACCEL_SPEED * GameState.ff;
        this.rotate_angle += ROTATE_ACCEL_AMPLITUDE * Math.sin(this.rotate_accel_phase);
        this.orbit_modulation_phase += ORBIT_MODULATION_SPEED * GameState.ff;
        const radius = ORBIT_RADIUS + ORBIT_MODULATION_AMPLITUDE * Math.sin(this.orbit_modulation_phase);
        this.color_change_phase += COLOR_CHANGE_SPEED * GameState.ff;

        for (let i = 0; i < NUM_SATELLITE; i++){
            const child = this.children[i];
            if (child && child.alive){
                const x = this.pos.x + radius * Math.cos(Phaser.Math.DegToRad(i*45 + this.rotate_angle));
                const y = this.pos.y + radius * Math.sin(Phaser.Math.DegToRad(i*45 + this.rotate_angle));
                child.pos = new Phaser.Math.Vector2(x,y);
                child.sprite.setTint(this.tint_color(i*45 + this.color_change_phase));
            }
        }
    }

    tint_color(angle){
        const H = (angle % 360) / 360;
        const L = 0.6 + 0.25 * Math.sin(H * 2 * Math.PI - Math.PI * 0.5);
        return Phaser.Display.Color.HSLToColor(H,1,L).color;
    }

    destroy(){
        super.destroy();

        for (let i = 0; i < NUM_SATELLITE; i++){
            const child = this.children[i];
            if (child && child.alive){
                child.alive = false;
                const eff = new Effect_Exp(this.scene);
                eff.init(child.pos);
                GameState.effects.push(eff);    
            }
        }
    }
}