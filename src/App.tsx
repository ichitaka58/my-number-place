import { useEffect, useState } from "react";
import "./App.css";
import {
  Button,
  ButtonGroup,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { blue, red, yellow } from "@mui/material/colors";
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

/**
 * 問題の難易度レベルに応じて、盤面から削るマスの数を決定する関数
 * "easy": 40〜49マスの空白
 * "medium": 50〜54マスの空白
 * "hard": 固定で最大60マスの空白
 *
 * @param {"easy" | "medium" | "hard"} level - 選択された難易度
 * @returns {number} 消去するマスの数
 */
const selectLevel = (level: "easy" | "medium" | "hard"): number => {
  switch (level) {
    case "easy":
      return Math.floor(Math.random() * 10);
    case "medium":
      return Math.floor(Math.random() * 5) + 50;
    case "hard":
      return 60;
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
const generatePuzzle = (solvedGrid: number[][], blanks: number = 40): number[][] => {
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
const areGridsEqual = (grid1: number[][], grid2: number[][]): boolean => {
  if (grid1.length !== grid2.length) return false;
  return grid1.every((row, i) => {
    if (row.length !== grid2[i].length) return false;
    return row.every((cell, j) => cell === grid2[i][j]);
  });
}


/**
 * ナンバープレース（数独）のメイン・アプリケーションコンポーネント
 */
function App() {
  // 数独の現在の盤面状態を管理するステート（初期状態は空のグリッド）
  const [matrix, setMatrix] = useState<number[][]>(createEmptyGrid());
  // 初期盤面の状態（初期配置された固定の数字）を保持するステート
  const [initialBoard, setInitialBoard] = useState<number[][]>(createEmptyGrid());
  // 現在選択されているセルの座標 [行インデックス, 列インデックス] を保持するステート
  const [selectedCell, setSelectedCell] = useState<number[]>([]);
  // 選択された難易度レベル（"easy" | "medium" | "hard"）を保持するステート
  const [level, setLevel] = useState<"easy" | "medium" | "hard">("easy");
  // 完成盤面を保持するステート
  const [solvedBoard, setSolvedBoard] = useState<number[][]>(createEmptyGrid());
  // 完成したかどうかを保持するステート
  const [completed, setCompleted] = useState<boolean>(false);

  // 「生成」ボタンがクリックされたときの処理
  // 新しい盤面を生成し、ステートを更新してUIを再レンダリングする
  const handleGenerate = () => {
    setCompleted(false);
    setSelectedCell([]);
    const blanks = selectLevel(level);
    // console.log(level);
    // console.log(blanks);
    const solvedGrid = generateNumberPlace();
    setSolvedBoard(solvedGrid.map(row => [...row]));
    const puzzle = generatePuzzle(solvedGrid, blanks);
    setInitialBoard(puzzle.map(row => [...row]));
    setMatrix(puzzle);
  };

  /**
   * 数字ボタンがクリックされたときの処理
   * ボタンの数字を選択している盤面のマスに入れる
   * @param {React.MouseEvent<HTMLButtonElement>} e - クリックイベント
   */
  const onClickNumberButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedCell.length === 2) {
      const value = Number(e.currentTarget.innerText);
      const newMatrix = matrix.map(row => [...row]);
      newMatrix[selectedCell[0]][selectedCell[1]] = value;
      setMatrix(newMatrix);
      if (areGridsEqual(newMatrix, solvedBoard)) {
        setCompleted(true);
        // console.log("Puzzle is completed!");
      }
    }
  }

  /**
   * 置いた数字をキャンセルする処理
   * 選択中のセルが存在する場合、そのセルの値を 0（空白）に戻す
   */
  const onClickCancelButton = () => {
    if (selectedCell.length === 2) {
      const newMatrix = matrix.map(row => [...row]);
      newMatrix[selectedCell[0]][selectedCell[1]] = 0;
      setMatrix(newMatrix);
    }
  }

  // コンポーネントの初回マウント時に一度だけ盤面を自動生成する
  useEffect(() => {
    handleGenerate();
  }, [])

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Number Place</h1>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={handleGenerate}
            variant="contained"
          >
            問題生成
          </Button>
          <Select size="small" value={level} defaultValue="easy" onChange={(e) => setLevel(e.target.value as "easy" | "medium" | "hard")}>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </Stack>
        <div className="size-120 mt-4 relative">
          <TableContainer>
            <Table>
              <TableBody sx={{ border: 2, bgcolor: alpha(blue[500], 0.2) }}>
                {matrix.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        onClick={() => {
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
                          // 選択中のセルの背景色
                          bgcolor: selectedCell[0] === rowIndex && selectedCell[1] === cellIndex ? alpha(yellow[200], 0.5) : "inherit",
                          // 初期盤面の数字が0でない場合は、ポインターイベントを無効にする
                          ...(initialBoard[rowIndex][cellIndex] !== 0 && { pointerEvents: "none", color: "grey.800", bgcolor: alpha(blue[200], 0.5) }),
                          ...(completed && { pointerEvents: "none", color: "grey.600", bgcolor: "white"})
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
          {completed && <p className="text-4xl font-bold text-green-600 text-shadow-lg bg-white p-4 rounded-xl absolute top-1/2 left-1/2 animate-slide-up">Completed!</p>}
        </div>
        <div className="w-120 text-center">
          <ButtonGroup variant="outlined" color="inherit" fullWidth>
            {NUMBERS.map((n) => (
              <Button key={n} onClick={onClickNumberButton}>{n}</Button>
            ))}
            <Button onClick={onClickCancelButton} sx={{ fontSize: "0.6rem", bgcolor: alpha(red[200], 0.2) }}>CANCEL</Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
}

export default App;

