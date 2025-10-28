// enemy_16.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';
import { Enemy_16a } from './enemy_16a.js';

const NUM_ATOMICS = 8;
const SPHERE_RADIUS = 32;
const SIDE_LENGTH = 102;

const TINTS = [
    0xff0000,
    0xffff00,
    0xffd0d0,
    0xff8000,
    0x00ff00,
    0xc0ffc0,
    0x80c0ff,
    0x4080ff
];

// Enemy_16：アトミック（管理クラス）
export class Enemy_16 extends Enemy {

    constructor(scene){
        super(scene);
        this.children = [NUM_ATOMICS];
        this.theta = 0;
        this.phi = 0;
        this.collision = { width : 0, height : 0};
    }

    init(pos){
        super.init(pos);

        for (let i = 0; i < NUM_ATOMICS; i++){
            const child =new Enemy_16a(this.scene);
            child.init(pos);
            child.sprite.setTint(TINTS[i]);
            GameState.enemies.push(child);
            this.children[i] = child;
        }
        const centers = this.generate_atomic_centers(SPHERE_RADIUS, SIDE_LENGTH);
        this.update_children(centers, this.children, this.pos);
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        const centers = this.generate_atomic_centers(SPHERE_RADIUS, SIDE_LENGTH, this.theta, this.phi);
        this.update_children(centers, this.children, this.pos);
        super.update();
        this.theta += 0.04;
        this.phi += 0.017;
    }

    generate_atomic_centers(r, s, theta = 0, phi = 0) {
        const { Vector3 } = Phaser.Math;

        // 正四面体の頂点
        const baseVerts = [
            new Vector3(1, 1, 1),
            new Vector3(1, -1, -1),
            new Vector3(-1, 1, -1),
            new Vector3(-1, -1, 1)
        ];

        // スケール因子（辺長は 2√2）
        const k = s / (2 * Math.sqrt(2));

        // 頂点球（A,B,C,D）の中心
        const verts = baseVerts.map(v => v.clone().scale(k));

        // 面側の球（E,F,G,H）の中心
        const faces = [
            [0, 1, 2],
            [0, 1, 3],
            [0, 2, 3],
            [1, 2, 3]
        ];

        const faceCenters = [];

        // 四面体全体の重心
        const tetraCenter = verts.reduce(
            (acc, v) => acc.add(v.clone()),
            new Vector3(0, 0, 0)
        ).scale(1 / 4);

        for (const [i1, i2, i3] of faces) {
            const p1 = verts[i1], p2 = verts[i2], p3 = verts[i3];

            // 面の重心
            const centroid = new Vector3(
            (p1.x + p2.x + p3.x) / 3,
            (p1.y + p2.y + p3.y) / 3,
            (p1.z + p2.z + p3.z) / 3
            );

            // 面の法線
            const n = new Vector3()
            .copy(p2)
            .subtract(p1)
            .cross(new Vector3().copy(p3).subtract(p1))
            .normalize();

            // 外向きにそろえる
            if (n.dot(centroid.clone().subtract(tetraCenter)) < 0) n.negate();

            // オフセット距離
            const offset = Math.sqrt(4 * r * r - (s * s) / 3);

            // 面側の球中心
            const faceCenter = centroid.clone().add(n.clone().scale(offset));
            faceCenters.push(faceCenter);
        }

        // 回転
        function rotateZ(v, angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const x = v.x * cos - v.y * sin;
            const y = v.x * sin + v.y * cos;
            return new Vector3(x, y, v.z);
        }

        function rotateX(v, angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const y = v.y * cos - v.z * sin;
            const z = v.y * sin + v.z * cos;
            return new Vector3(v.x, y, z);
        }

        const allCenters = [...verts, ...faceCenters].map(v => {
            // Z軸回り → X軸回り
            const afterZ = rotateZ(v, theta);
            const afterX = rotateX(afterZ, phi);
            return afterX;
        });

        return allCenters; // [A,B,C,D,E,F,G,H]
    }

    update_children(centers, children, pos){
        let hasChild = false;
        for (let i = 0; i < NUM_ATOMICS; i++){
            const child = children[i];
            const center = centers[i];
            // console.log("update_children",i,child,child.alive);
            if (child && child.alive){
                child.pos = new Phaser.Math.Vector2(center.x + pos.x, center.y + pos.y);
                child.z = center.z + GLOBALS.LAYER.LAYER3.Z;
                child.sprite.setTint(MyMath.get_interpolate_color(0x000000, TINTS[i], this.interpolate(center.z, +10, +50, 1.0, 0.6)));
                // console.log("center.z", center.z);
                hasChild = true;
            }
        }
        if (!hasChild){
            // console.log("all children has destroyed");
            this.alive = false;
        }
    }

    interpolate(x, x_min, x_max, y_min, y_max) {
        if (x <= x_min) return y_min;
        if (x >= x_max) return y_max;
        const ratio = (x - x_min) / (x_max - x_min);
        return y_min + ratio * (y_max - y_min);
    }

    destroy(){
        super.destroy();
    }
}