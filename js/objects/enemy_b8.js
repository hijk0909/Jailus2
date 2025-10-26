// enemy_b8.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 90,
    HARD : 40
}
const MIN_X = GLOBALS.FIELD.WIDTH * 0.7;

// Enemy_B8：ボス（ステージ８）
export class Enemy_B8 extends Enemy {

    constructor(scene){
        super(scene);
        this.z = GLOBALS.LAYER.LAYER3.Z + 10;
        this.collision = { width :100, height : 300};
        this.scale = 1.0;
        this.life = 200;
        this.speed = 0.3;
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.score = 3000;
    }

    init(pos){
        super.init(pos);
        this.boss = true;

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_boss_8')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_boss_8")) {
            this.scene.anims.create({key: "anims_boss_8",
                frames: this.scene.anims.generateFrameNumbers('ss_boss_8',
                    { start: 0, end: 1}),
                frameRate: 12, repeat: -1
            });
        }
        this.sprite.play("anims_boss_8");

        // シェーダーの設定
        this.sprite.setPipeline('Glitch');
        this.glitch = this.scene.renderer.pipelines.get('Glitch');
        this.glitch.set1f('time', 0);
        this.glitch.set1f('uDisplace', 1.0);
        this.glitch.set1f('uHueShift', 0.5);
        this.glitch.set1f('uDesaturate', 0.0);

        this.sprite.frameOffset = {x:0, y:0};
        this.sprite.frameScale  = {x:1, y:1};

        // アニメーション更新時の処理
        this.sprite.on('animationupdate', (animation, frame, sprite) => {
            // Atlas全体の大きさ
            const atlasWidth  = sprite.texture.getSourceImage().width;
            const atlasHeight = sprite.texture.getSourceImage().height;

            // Atlas内での現在フレームの位置と大きさ
            const frameX = frame.frame.cutX;
            const frameY = frame.frame.cutY;
            const frameWidth  = frame.frame.width;
            const frameHeight = frame.frame.height;

            // シェーダーに処理範囲を設定
            if(this.glitch) {
                this.glitch.set1i('frame', 1);
                this.glitch.set1f('frameOffsetX', frameX / atlasWidth);
                this.glitch.set1f('frameOffsetY', frameY / atlasHeight);
                this.glitch.set1f('frameWidth', frameWidth / atlasWidth);
                this.glitch.set1f('frameHeight', frameHeight / atlasHeight);
            }
        });
    }

    update(time, delta){
        super.update();
        this.velocity = GameState.player.pos.clone().subtract(this.pos).normalize().scale(this.speed * GameState.ff);
        this.pos.add(this.velocity);
        this.pos.x = Math.max(MIN_X, this.pos.x);
        super.update();

        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_aim();
            if (GameState.difficulty >= 300){
            this.shoot_aim(-15);
            this.shoot_aim(+15);
            }
            if (GameState.difficulty >= 400){
                this.shoot_aim(-30);
                this.shoot_aim(+30);
            }
        }
        // console.log("time",time);
        this.glitch.set1f('time', time);
        const p = (Math.sin(time / 200) + 1) / 2;
        this.glitch.set1f('uDisplace', p);
        this.glitch.set1f('uHueShift', p);
        this.glitch.set1f('uDesaturate', p);
    }

    destroy(){
        super.destroy();
    }
}