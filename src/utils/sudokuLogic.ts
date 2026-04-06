
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/**
 * 配列をFisher-Yatesシャッフルのアルゴリズムでランダムに並び替える（非破壊）
 *
 * @param {readonly number[]} array - シャッフルする元の配列
 * @returns {number[]} シャッフルされた新しい配列
 */
export const shuffled = (array: readonly number[]): number[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};


/**
 * 9x9の空のグリッド（すべての要素が0）を生成する
 * 
 * @returns {number[][]} 9x9の2次元配列
 */
export const createEmptyGrid = (): number[][] => {
    const emptyGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
    return emptyGrid;
};

/**
 * 指定されたマス (row, col) に数字 (num) を配置可能か判定する。
 * ナンバープレースのルールに従い、行、列、および 3x3 ブロック内に同じ数字が既に存在しないかを確認する。
 *
 * @param {number[][]} grid - 現在の数独盤面
 * @param {number} row - 行のインデックス (0-8)
 * @param {number} col - 列のインデックス (0-8)
 * @param {number} num - 配置しようとしている数字 (1-9)
 * @returns {boolean} 配置可能な場合はtrue、そうでない場合はfalse
 */
const isValid = (
    grid: number[][],
    row: number,
    col: number,
    num: number,
): boolean => {
    // 行チェック
    if (grid[row].includes(num)) return false;

    // 列チェック
    for (let r = 0; r < 9; r++) {
        if (grid[r][col] === num) return false;
    }

    // 3×3ブロックチェック
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
            if (grid[r][c] === num) return false;
        }
    }

    return true;
};

/**
 * バックトラッキングアルゴリズムを用いて、ランダムで有効な数独の完全な盤面を生成する。
 * セル (0, 0) から (8, 8) まで順に再帰的に数字を試し、行・列・ブロックの制約を満たせなければ前の状態へ戻る。
 *
 * @returns {number[][]} 完成した9x9の数独盤面
 */
export const generateNumberPlace = (): number[][] => {
    const grid = createEmptyGrid();

    const solve = (pos: number): boolean => {
        if (pos === 81) return true;

        const row = Math.floor(pos / 9);
        const col = pos % 9;
        const candidates = shuffled(NUMBERS);

        for (const num of candidates) {
            if (isValid(grid, row, col, num)) {
                grid[row][col] = num;
                if (solve(pos + 1)) return true;
                grid[row][col] = 0; // バックトラック
            }
        }
        return false;
    };
    solve(0); // 空の盤面から始めると必ずtrueになる
    return grid;
};

/**
 * 与えられた盤面の解の数を計算するバックトラッキング関数。
 * 解が唯一か複数かを判定するため、解が2つ見つかった時点で探索を打ち切る。
 *
 * @param {number[][]} grid - 現在の数独盤面
 * @param {number} pos - 現在確認しているマスのインデックス (0-80)
 * @param {{ value: number }} count - 解の数を保持する参照用オブジェクト
 * @returns {number} 盤面の解の数（最大2）
 */
export const countSolutions = (grid: number[][], pos: number = 0, count = { value: 0 }): number => {
    // 81マスすべてを埋め終わった場合、解が1つ見つかったとしてカウント
    if (pos === 81) {
        count.value++;
        return count.value;
    }
    const row = Math.floor(pos / 9);
    const col = pos % 9;

    // すでに数字が入っているマスはスキップして次のマスへ
    if (grid[row][col] !== 0) {
        return countSolutions(grid, pos + 1, count);
    }

    // 空白マスに対して1〜9の数字を順に試す
    for (let num = 1; num <= 9; num++) {
        // 処理の最適化のため、すでに2つの解が見つかっている場合は探索を打ち切る
        if (count.value >= 2) break;

        if (isValid(grid, row, col, num)) {
            grid[row][col] = num; // 数字を仮置き
            countSolutions(grid, pos + 1, count); // 次のマスを再帰的に探索
            grid[row][col] = 0; // バックトラック（元に戻して次の数字を試す）
        }
    }
    return count.value;
}

// レベルの型を定義
export type Level = "easy" | "medium" | "hard" | "debug";

/**
 * 問題の難易度レベルに応じて、盤面から削るマスの数を決定する関数
 * "easy": 40〜49マスの空白
 * "medium": 50〜54マスの空白
 * "hard": 固定で最大60マスの空白
 *
 * @param {Level} level - 選択された難易度
 * @returns {number} 消去するマスの数
 */
export const selectLevel = (level: Level): number => {
    switch (level) {
        case "easy":
            return Math.floor(Math.random() * 10) + 40;
        case "medium":
            return Math.floor(Math.random() * 5) + 50;
        case "hard":
            return 60;
        case "debug":
            return Math.floor(Math.random() * 10) + 1;
    }
}

/**
 * 問題生成：完成盤面からマスを消していく
 * 問題として成立するため、解が必ず1つ（一意）になるようにマスを削除する。
 *
 * @param {number[][]} solvedGrid - 完成した9x9の数独盤面
 * @param {number} blanks - 消すマスの最大値 (デフォルト: 40)
 * @returns {number[][]} 生成された数独問題
 */
export const generatePuzzle = (solvedGrid: number[][], blanks: number = 40): number[][] => {
    // 元の盤面に影響を与えないよう、新しく盤面をコピー
    const grid = solvedGrid.map(row => [...row]);
    // どの順番でマスを消していくかをランダムにするため、0〜80の位置番号をシャッフル
    const positions = shuffled(Array.from({ length: 81 }, (_, i) => i));
    let removed = 0; // 実際に空白にしたマスの数

    for (const pos of positions) {
        if (removed >= blanks) break; // 指定した数のマスを消し終わったら終了

        const row = Math.floor(pos / 9);
        const col = pos % 9;

        // 消すマスの数字を後で戻せるように一時退避
        const backup = grid[row][col];
        grid[row][col] = 0; // マスを空白(0)にする

        // そのマスを空白にした盤面のコピーを探索に渡し、解がいくつあるか調べる
        if (countSolutions(grid.map(r => [...r])) === 1) {
            // 解が1つの場合（問題が成立する）、そのまま空白にして消した数をカウントアップ
            removed++;
        } else {
            // 解が2つ以上になる場合、一意な解答にならなくなるため数字を元に戻す
            grid[row][col] = backup;
        }
    }

    return grid;
}

/**
 * 2つの数独盤面が等しいかどうかを判定する
 * @param grid1 1つ目の数独盤面
 * @param grid2 2つ目の数独盤面
 * @returns 2つの盤面が等しい場合は true、そうでない場合は false
 */
export const areGridsEqual = (grid1: number[][], grid2: number[][]): boolean => {
    if (grid1.length !== grid2.length) return false;
    return grid1.every((row, i) => {
        if (row.length !== grid2[i].length) return false;
        return row.every((cell, j) => cell === grid2[i][j]);
    });
}


