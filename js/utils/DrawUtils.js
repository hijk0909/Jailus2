// DrawUtils.js

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