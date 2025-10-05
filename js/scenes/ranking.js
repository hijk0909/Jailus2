// ranking.js
import { GLOBALS } from "../GameConst.js";
import { GameState } from '../GameState.js';

const ROW_HEIGHT = 24;
const FONT_SIZE = 16;

export class Ranking {
    constructor(scene){
      this.scene = scene;
      this.org_x = (this.scene.game.canvas.width - 432) / 2;
      this.org_y = 155;
    }

    // ランキングのサーバへの登録
    static set_net_ranking(name, score, stage){
        fetch(GLOBALS.RANKING_URL, {
            method: "POST",
            body: JSON.stringify({ name, score, stage })
        })
        .then(res => res.text())
        .then(txt => {
            // console.log("Server response:", txt);
            this.get_net_ranking();
        })
        .catch(err => console.error(err));
    }

    // ランキングのサーバからの取得
    static get_net_ranking(){
      fetch(GLOBALS.RANKING_URL)
        .then(res => res.json())
        .then(data => {
            GameState.ranking.daily = data.daily;
            GameState.ranking.monthly = data.monthly;
            GameState.ranking.alltime = data.alltime;
            // console.log("get_net_ranking:", data);
            }
        )
        .catch(err => console.error(err));
    }

    // ランキングの表示
    show_ranking_table(ranking) {

        if (ranking == null) return;
        // console.log("show_ranking_table : ranking", ranking);

        let yPosition = this.org_y; // テキストの初期Y座標
        this.clear_ranking_table();
        const headerText = 'RANK NAME      STAGE   SCORE';
        const text2 = this.scene.add.bitmapText(this.org_x - FONT_SIZE * 1, yPosition - ROW_HEIGHT, 'myFont', headerText, FONT_SIZE).setTint(0x00ffff);
        text2.setName('rankingText');

        // 配列をループして各要素を処理
        ranking.forEach((item, index) => {
            const rank = (index + 1).toString().padStart(2, ' ');

            // 名前が null / undefined の場合 ""とし、数値の場合も文字列に変換
            const name = (item.name ?? "").toString().padEnd(8, ' ');
            const score = (item.score).toString().padStart(7, ' ');
            const stage = (item.stage).toString().padStart(3, ' ');
            // 表示する文字列をフォーマット
            const displayText = `${rank}. ${name}  [${stage}] ${score}`;
            const text = this.scene.add.bitmapText(this.org_x, yPosition, 'myFont', displayText, FONT_SIZE);
            text.setName('rankingText');   // 後からクリアできるように名前を設定
            // 次のテキストのY座標を調整（行間を空ける）
            yPosition += ROW_HEIGHT;
        }); // End of forEach
    } // End of show_ranking

    // ランキング表示のクリア
    clear_ranking_table(){
        // 既存のランキング表示をクリアする（複数回呼び出される場合）
        this.scene.children.getAll().forEach(child => {
            if (child.name === 'rankingText') {
                child.destroy();
            }
        });
    }

    // nameの位置の返却
    get_name_position(rank){
        return new Phaser.Math.Vector2(this.org_x + 16 * 4, this.org_y + rank * ROW_HEIGHT);
    }

    // ◆何位に入るかの判定
    static get_new_rank(ranking, newScore) {
        for (let i = 0; i < ranking.length; i++) {
            if (newScore > ranking[i].score) {
                return i; // i番目に入る
            }
        }
        if (ranking.length < 10) {
            return ranking.length; // 10位未満なら末尾に追加
        }
        return -1; // 入れない
    }

    // ◆新スコアをランキングに仮挿入（名前は空文字）
    static insert_temp_score(ranking, newScore, newStage) {
        const newRank = this.get_new_rank(ranking, newScore);
        if (newRank === -1) return ranking; // 変化なし
        const newEntry = { name: "", score: newScore, stage: newStage };
        // 配列をコピーして挿入
        const newRanking = [
            ...ranking.slice(0, newRank),
            newEntry,  
            ...ranking.slice(newRank, 9) // 9位まで（10位は落ちる）
        ];
        return newRanking;
    }

    // ◆3名前入力後にランキングを更新
    static update_name(ranking, rank, name) {
        ranking[rank].name = name;
        return ranking;
    }
}