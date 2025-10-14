// DrawUtils.js
import { GameState } from '../GameState.js';

const FONT_SIZE = 16;
const ROW_HEIGHT = 24;
const SHOCKWAVE_DURATION = 120;

// ◆オブジェクトを奥に倒してスクロールさせるシェーダー
export class ScrollPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game,
            renderer: game.renderer,
            fragShader: document.getElementById('scrollShader').textContent
        });
    }
}

// ◆オブジェクトを波状に歪ませるシェーダー
export class RipplePipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game,
            renderer: game.renderer,
            fragShader: document.getElementById('rippleShader').textContent
        });
    }
}

// ◆衝撃波（ポストエフェクトシェーダー）
export class ShockwavePostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game) {
    super({
      game: game,
      renderer: game.renderer,
      fragShader: document.getElementById('shockwaveShader').textContent,
      uniforms: ['time', 'center', 'radius'],
      renderTarget: true   // PostFX は通常レンダーターゲットを使う
    });

    // 状態を保持
    this._time = 0;
    this._center = { x: 0.5, y: 0.5 };
    this._radius = 0.0;
    this._resolution = { width: game.canvas.width, height: game.canvas.height};
  }

  // 描画直前に uniform をまとめて渡す（安全策）
  onPreRender() {
    this.set1f('time', this._time);
    this.set2f('center', this._center.x, this._center.y);
    this.set1f('radius', this._radius);
    this.set2f('resolution', this._resolution.width, this._resolution.height);
  }
}

// ◆衝撃波の管理クラス
export class Shockwave {
    constructor(scene){
        this.scene = scene;
        this.scene.cameras.main.setPostPipeline(ShockwavePostFX);
        this.shader = this.scene.cameras.main.getPostPipeline(ShockwavePostFX);
        this.shader._time = 0;
        this.shader._center = {x:0.5, y:0.5};
        this.shader._radius = 0.0; 
        this.count = 0;
    }

    start(pos){
        // console.log("shockwave.start");
        this.count = SHOCKWAVE_DURATION;
        this.shader._time = 0;
        this.shader._radius = 0.5;
        this.shader._center.x = pos.x / this.scene.game.canvas.width;
        this.shader._center.y = 1 - pos.y / this.scene.game.canvas.height;
    }

    update(){
        if (this.count > 0){
            this.count -= GameState.ff;
            const t = (SHOCKWAVE_DURATION - this.count);
            if (this.shader) {
                if (this.count <= 0){
                    this.stop();
                } else {
                    this.shader._time = t * 0.01;
                }
            }
        }
    }
    stop(){
        this.shader._time = 0;
        this.shader._radius = 0;
    }
}

// ◆オブジェクトをノイズ化するシェーダー
export class GlitchPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game,
            renderer: game.renderer,
            fragShader: document.getElementById('glitchShader').textContent
        });
    }
}

// ◆ビットマップフォントで文章を表示する
export class Sentences {
    constructor(scene, sentences, options = {}) {
        this.scene = scene;
        this.posY = options.posY || 50;
        this.font = options.font || 'myFont';
        this.fontSize = options.fontSize || FONT_SIZE;
        this.rowHeight = options.rowHeight || ROW_HEIGHT;
        this.speed = options.speed || 5; // フレーム数で1文字表示
        this.baseColor = options.baseColor || 0x90ff90;
        this.onFinished = options.onFinished || null;
        this.sentences = sentences.map(s => this.parseLine(s));

        this.objs = []; // 各行ごとにセグメントオブジェクトの配列
        this.counter = 0;
        this.finished = false;

        // カーソル（どの行・どのセグメント・何文字目か）
        this.lineIndex = 0;
        this.segIndex = 0;
        this.charIndex = 0;

        this.initObjects();
    }

    // "FIRST ${0xff0000}ROW" → [ {text:"FIRST ", color:...}, {text:"ROW", color:...} ]
    parseLine(str) {
        const regex = /\$\{(0x[0-9a-fA-F]+)\}/g;
        let segments = [];
        let lastIndex = 0;
        let currentColor = this.baseColor;

        let match;
        while ((match = regex.exec(str)) !== null) {
            if (match.index > lastIndex) {
                segments.push({
                    text: str.slice(lastIndex, match.index),
                    color: currentColor
                });
            }
            currentColor = parseInt(match[1]); // 新しい色
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < str.length) {
            segments.push({
                text: str.slice(lastIndex),
                color: currentColor
            });
        }
        return segments;
    }

    initObjects() {
        let posY = this.posY;
        for (let line of this.sentences) {
            const lineWidth = line.reduce((sum, seg) => sum + seg.text.length, 0) * this.fontSize;
            let posX = (this.scene.game.canvas.width - lineWidth) / 2;

            let objsForLine = [];
            for (let seg of line) {
                const obj = this.scene.add.bitmapText(posX, posY, this.font, "", this.fontSize).setTint(seg.color).setDepth(3);
                // console.log("add_text",posX,posY,this.font,this.fontSize,seg.color);
                obj.setName("sentenceText");
                objsForLine.push({ obj, text: seg.text, color: seg.color });
                posX += seg.text.length * this.fontSize;
            }
            this.objs.push(objsForLine);
            posY += this.rowHeight;
        }
    }

    update() {
        if (this.finished) return;
        this.counter++;
        if (this.counter < this.speed) return;
        this.counter = 0;

        let line = this.objs[this.lineIndex];
        let seg = line[this.segIndex];

        // 次の文字を追加
        this.charIndex++;
        seg.obj.setText(seg.text.slice(0, this.charIndex));

        // セグメントの文字列が終わったら次へ
        if (this.charIndex >= seg.text.length) {
            this.segIndex++;
            this.charIndex = 0;

            // 行のセグメントが終わったら次の行へ
            if (this.segIndex >= line.length) {
                this.lineIndex++;
                this.segIndex = 0;
            }
        }

        // 全行終わったら終了
        if (this.lineIndex >= this.objs.length) {
            this.finished = true;
            if (this.onFinished) {
                this.onFinished();
                this.onFinished = null; // 一回きり
            }
        }
    }

    clear() {
        this.scene.children.getAll().forEach(child => {
            if (child.name === "sentenceText") child.destroy();
        });
    }
}