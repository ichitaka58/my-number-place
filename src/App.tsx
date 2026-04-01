import { useState } from "react";
import "./App.css";
import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { blue, yellow } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";

/** 定数はコンポーネント外に置き、毎レンダリングの再生成を避ける */
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/**
 * 配列をFisher-Yatesシャッフルのアルゴリズムでランダムに並び替える（非破壊）
 *
 * @param {readonly number[]} array - シャッフルする元の配列
 * @returns {number[]} シャッフルされた新しい配列
 */
const shuffled = (array: readonly number[]): number[] => {
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
const createEmptyGrid = (): number[][] => {
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
const generateNumberPlace = (): number[][] => {
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
const countSolutions = (grid: number[][], pos: number = 0, count = { value: 0 }): number => {
  // 81マスすべてを埋め終わった場合、解が1つ見つかったとしてカウント
  if(pos === 81) {
    count.value++;
    return count.value;
  }
  const row = Math.floor(pos / 9);
  const col = pos % 9;
  
  // すでに数字が入っているマスはスキップして次のマスへ
  if(grid[row][col] !== 0) {
    return countSolutions(grid, pos + 1, count);
  }

  // 空白マスに対して1〜9の数字を順に試す
  for(let num = 1; num <= 9; num++) {
    // 処理の最適化のため、すでに2つの解が見つかっている場合は探索を打ち切る
    if(count.value >= 2) break;
    
    if(isValid(grid, row, col, num)) {
      grid[row][col] = num; // 数字を仮置き
      countSolutions(grid, pos + 1, count); // 次のマスを再帰的に探索
      grid[row][col] = 0; // バックトラック（元に戻して次の数字を試す）
    }
  }
  return count.value;
}

/**
 * 問題生成：完成盤面からマスを消していく
 * 問題として成立するため、解が必ず1つ（一意）になるようにマスを削除する。
 *
 * @param {number[][]} solvedGrid - 完成した9x9の数独盤面
 * @param {number} blanks - 消すマスの最大値 (デフォルト: 40)
 * @returns {number[][]} 生成された数独問題
 */
const generatePuzzle = (solvedGrid: number[][], blanks: number = 40): number[][] => {
  // 元の盤面に影響を与えないよう、新しく盤面をコピー
  const grid = solvedGrid.map(row => [...row]);
  // どの順番でマスを消していくかをランダムにするため、0〜80の位置番号をシャッフル
  const positions = shuffled(Array.from({ length: 81 }, (_, i) => i));
  let removed = 0; // 実際に空白にしたマスの数

  for(const pos of positions) {
    if(removed >= blanks) break; // 指定した数のマスを消し終わったら終了

    const row = Math.floor( pos / 9);
    const col = pos % 9;
    
    // 消すマスの数字を後で戻せるように一時退避
    const backup = grid[row][col]; 
    grid[row][col] = 0; // マスを空白(0)にする

    // そのマスを空白にした盤面のコピーを探索に渡し、解がいくつあるか調べる
    if(countSolutions(grid.map(r => [...r])) === 1) {
      // 解が1つの場合（問題が成立する）、そのまま空白にして消した数をカウントアップ
      removed++;
    }else{
      // 解が2つ以上になる場合、一意な解答にならなくなるため数字を元に戻す
      grid[row][col] = backup;
    }
  }
  // 実際に消すことができたマスの数を出力（開発用）
  console.log(removed);
  return grid;
}

/**
 * ナンバープレース（数独）のメイン・アプリケーションコンポーネント
 */
function App() {
  // 数独の盤面状態を管理するステート（初期状態は空のグリッド）
  const [matrix, setMatrix] = useState<number[][]>(createEmptyGrid());
  const [selected, setSelected] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<number[]>([]);

  // 「生成」ボタンがクリックされたときの処理
  // 新しい盤面を生成し、ステートを更新してUIを再レンダリングする
  const handleGenerate = () => {
    const newGrid = generateNumberPlace();
    const puzzle = generatePuzzle(newGrid,60);
    setMatrix(puzzle);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Number Place</h1>
        <button
          onClick={handleGenerate}
          className="bg-gray-300 border px-4 rounded-lg mb-4 hover:cursor-pointer hover:bg-gray-400"
        >
          生成
        </button>
        <div className="size-120">
          <TableContainer>
            <Table>
              <TableBody sx={{ border: 2, bgcolor: alpha(blue[500], 0.2) }}>
                {matrix.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        onClick={() => {
                          setSelected(!selected)
                          setSelectedCell([rowIndex, cellIndex])
                        }}
                        key={cellIndex}
                        align="center"
                        sx={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          px: "12px",
                          py: "8px",
                          borderBottom: 2,
                          // 3x3ブロックの水平方向の境界線を強調表示
                          borderBottomColor:
                            rowIndex % 3 === 2 ? "black" : "grey.400",
                          borderRight: 2,
                          // 3x3ブロックの垂直方向の境界線を強調表示
                          borderRightColor:
                            cellIndex % 3 === 2 ? "black" : "grey.400",
                          bgcolor: selectedCell[0] === rowIndex && selectedCell[1] === cellIndex ? alpha(yellow[200], 0.5) : "inherit",
                        }}
                      >
                        {cell || "\u00A0"}
                      </TableCell> // cell || "\u00A0" で、0のときに &nbsp;（ノーブレークスペース）を表示
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="w-120 text-center">
          <ButtonGroup variant="outlined" color="inherit" fullWidth>
            <Button>1</Button>
            <Button>2</Button>
            <Button>3</Button>
            <Button>4</Button>
            <Button>5</Button>
            <Button>6</Button>
            <Button>7</Button>
            <Button>8</Button>
            <Button>9</Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
}

export default App;

