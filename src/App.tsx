import { useState } from "react";
import "./App.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { blue } from "@mui/material/colors";
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
 * ナンバープレース（数独）のメイン・アプリケーションコンポーネント
 */
function App() {
  // 数独の盤面状態を管理するステート（初期状態は空のグリッド）
  const [matrix, setMatrix] = useState<number[][]>(createEmptyGrid());

  // 「生成」ボタンがクリックされたときの処理
  // 新しい盤面を生成し、ステートを更新してUIを再レンダリングする
  const handleGenerate = () => {
    const newGrid = generateNumberPlace();
    setMatrix(newGrid);
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
                        key={cellIndex}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          borderBottom: 2,
                          // 3x3ブロックの水平方向の境界線を強調表示
                          borderBottomColor:
                            rowIndex % 3 === 2 ? "black" : "grey.400",
                          borderRight: 2,
                          // 3x3ブロックの垂直方向の境界線を強調表示
                          borderRightColor:
                            cellIndex % 3 === 2 ? "black" : "grey.400",
                        }}
                      >
                        {cell || "\u00A0"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

export default App;

