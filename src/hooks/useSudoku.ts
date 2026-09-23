import { useState } from "react";
import {
  createEmptyGrid,
  generateNumberPlace,
  selectLevel,
  generatePuzzle,
  areGridsEqual,
  type Level,
  clearMemosAfterPlacement,
} from "../utils/sudokuLogic";

export const useSudoku = () => {
  // 数独の現在の盤面状態を管理するステート（初期状態は空のグリッド）
  const [matrix, setMatrix] = useState<number[][]>(createEmptyGrid);
  // 初期盤面の状態（初期配置された固定の数字）を保持するステート
  const [initialBoard, setInitialBoard] = useState<number[][]>(createEmptyGrid);
  // 現在選択されているセルの座標 [行インデックス, 列インデックス] を保持するステート
  const [selectedCell, setSelectedCell] = useState<number[]>([]);
  // 選択された難易度レベル（"easy" | "medium" | "hard"）を保持するステート
  const [level, setLevel] = useState<Level>("easy");
  // 完成盤面を保持するステート
  const [solvedBoard, setSolvedBoard] = useState<number[][]>(createEmptyGrid);
  // 完成したかどうかを保持するステート
  const [completed, setCompleted] = useState<boolean>(false);

  // memosの初期値 9×9のマスにSet{}が入る
  const createEmptyMemos = (): Set<number>[][] =>
    Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => new Set<number>()),
    );
  // 仮置きのメモ数字を管理するステート
  const [memos, setMemos] = useState<Set<number>[][]>(createEmptyMemos);
  // 手の履歴を管理するステート
  const [history, setHistory] = useState<
    { matrix: number[][]; memos: Set<number>[][] }[]
  >([]);

  // 「生成」ボタンがクリックされたときの処理
  // 新しい盤面を生成し、ステートを更新してUIを再レンダリングする
  const handleGenerate = () => {
    setCompleted(false);
    setSelectedCell([]);
    setHistory([]); // 手の履歴をクリアする
    // 選択した問題のレベルに応じて、盤面から消すマスの数を決定する
    const blanks = selectLevel(level);
    // 完成盤面を生成する
    const solvedGrid = generateNumberPlace();
    // 完成盤面をコピーして保存する
    setSolvedBoard(solvedGrid.map((row) => [...row]));
    // 完成盤面からマスを消して問題盤面を生成する
    const puzzle = generatePuzzle(solvedGrid, blanks);
    // 問題盤面をコピーして保存する
    setInitialBoard(puzzle.map((row) => [...row]));
    // 問題盤面を現在の盤面として設定する
    setMatrix(puzzle);
    // メモ数字も初期化する
    setMemos(createEmptyMemos);
  };

  /**
   * 数字ボタンがクリックされたときの処理
   * ボタンの数字を選択している盤面のマスに入れる
   * @param {React.MouseEvent<HTMLButtonElement>} e - クリックイベント
   */
  const onClickNumberButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedCell.length === 2) {
      const selectedRow: number = selectedCell[0]; // 選択したセルの行インデックス
      const selectedCol: number = selectedCell[1]; // 選択したセルの列インデックス
      const value = Number(e.currentTarget.innerText); // NumberPadで選択した数字を取得
      // 選択した数字が選択したマスにすでに入っている場合、終了
      if (matrix[selectedRow][selectedCol] === value) return;
      // 今の状態のmatrix、memosを履歴に保存する
      setHistory((prev) => [...prev, { matrix, memos }]);
      const newMatrix = matrix.map((row) => [...row]); // 盤面ステートをコピー
      newMatrix[selectedRow][selectedCol] = value; // 選択したマスに取得した数字を入れる
      setMatrix(newMatrix);
      // 選択セルに数字を置いた後、関連するメモ数字を消した新しいメモ配列を返す
      const newMemos = clearMemosAfterPlacement(
        memos,
        selectedRow,
        selectedCol,
        value,
      );
      setMemos(newMemos);
      // 盤面が正解盤面と等しければ、completed = true;
      if (areGridsEqual(newMatrix, solvedBoard)) {
        setCompleted(true);
      }
    }
  };

  /**
   * 置いた数字をキャンセルする処理
   * 選択中のセルが存在する場合、そのセルの値を 0（空白）に戻す
   */
  const onClickCancelButton = () => {
    if (selectedCell.length === 2) {
      if (matrix[selectedCell[0]][selectedCell[1]] === 0) return;
      setHistory((prev) => [...prev, { matrix, memos }]);
      const newMatrix = matrix.map((row) => [...row]);
      newMatrix[selectedCell[0]][selectedCell[1]] = 0;
      setMatrix(newMatrix);
    }
  };

  /**
   * メモモードONの時、選択セルのメモ数字を追加／削除する
   */
  const onClickMemoNumber = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedCell.length === 2) {
      const selectedRow: number = selectedCell[0]; // 選択したセルの行インデックス
      const selectedCol: number = selectedCell[1]; // 選択したセルの列インデックス
      if (matrix[selectedRow][selectedCol] !== 0) return;
      setHistory((prev) => [...prev, { matrix, memos }]);
      const value = Number(e.currentTarget.innerText);
      const newMemos = memos.map((row) => row.map((cell) => new Set(cell)));
      const cellMemos = newMemos[selectedRow][selectedCol];
      if (cellMemos.has(value)) {
        cellMemos.delete(value);
      } else {
        cellMemos.add(value);
      }
      setMemos(newMemos);
    }
  };

  /**
   * 手を元に戻す
   */
  const onClickUndoButton = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setMatrix(last.matrix);
    setMemos(last.memos);
    setHistory((prev) => prev.slice(0, -1));
  };

  /**
   * 手の履歴をクリアする関数
   * @returns void;
   */
  const clearHistory = () => setHistory([]);

  // 履歴（元に戻せる手）があるかどうか
  const canUndo: boolean = history.length > 0;

  return {
    matrix,
    initialBoard,
    selectedCell,
    level,
    solvedBoard,
    completed,
    memos,
    setMatrix,
    setInitialBoard,
    setMemos,
    setLevel,
    setSolvedBoard,
    setSelectedCell,
    handleGenerate,
    onClickNumberButton,
    onClickCancelButton,
    onClickMemoNumber,
    onClickUndoButton,
    clearHistory,
    canUndo,
  };
};
