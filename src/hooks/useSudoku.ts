import { useState } from "react";
import { createEmptyGrid, generateNumberPlace, selectLevel, generatePuzzle, areGridsEqual, type Level } from "../utils/sudokuLogic";

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

    // 「生成」ボタンがクリックされたときの処理
    // 新しい盤面を生成し、ステートを更新してUIを再レンダリングする
    const handleGenerate = () => {
        setCompleted(false);
        setSelectedCell([]);
        // 選択した問題のレベルに応じて、盤面から消すマスの数を決定する
        const blanks = selectLevel(level);
        // 完成盤面を生成する
        const solvedGrid = generateNumberPlace();
        // 完成盤面をコピーして保存する
        setSolvedBoard(solvedGrid.map(row => [...row]));
        // 完成盤面からマスを消して問題盤面を生成する
        const puzzle = generatePuzzle(solvedGrid, blanks);
        // 問題盤面をコピーして保存する
        setInitialBoard(puzzle.map(row => [...row]));
        // 問題盤面を現在の盤面として設定する
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

    return {
        matrix,
        initialBoard,
        selectedCell,
        level,
        solvedBoard,
        completed,
        setLevel,
        setSelectedCell,
        handleGenerate,
        onClickNumberButton,
        onClickCancelButton,
    }
}