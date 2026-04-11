import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./App.css";

// 画面サイズを取得するためのカスタムフック
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

import { useSudoku } from "./hooks/useSudoku";
import { BottomNavigation } from "./components/BottomNavigation";
import { NumberPad } from "./components/NumberPad";
import { GameHeader } from "./components/GameHeader";
import { Timer } from "./components/Timer";

/**
 * ナンバープレース（数独）のメイン・アプリケーションコンポーネント (Sleek Dark Theme)
 */
function App() {
  const {
    matrix,
    initialBoard,
    selectedCell,
    level,
    setLevel,
    setSelectedCell,
    completed,
    handleGenerate,
    onClickNumberButton,
    onClickCancelButton,
  } = useSudoku();
  const [windowWidth, windowHeight] = useWindowSize();
  // タイマーコンポーネント（<Timer />）をリセットするための識別用ステート
  // 初期値の0は「最初の読み込み時」、1以上は「New Gameが押されてゲームが始まった状態」を表す
  const [gameId, setGameId] = useState(0);

  // 選択されたセルが属するブロック、行、列を特定するためのヘルパー
  const selectedRow = selectedCell[0];
  const selectedCol = selectedCell[1];
  const selectedValue =
    selectedRow >= 0 && selectedCol >= 0
      ? (matrix[selectedRow]?.[selectedCol] ?? 0)
      : 0;

  /**
   * 新しいゲームを開始するハンドラー関数
   * 盤面の事前生成処理を利用し、ゲーム回数（gameId）を進めることでTimerコンポーネントを初期化させます。
   */
  const handleStartNewGame = () => {
    handleGenerate();
    setGameId((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-['Inter',sans-serif] text-slate-100 flex flex-col items-center pt-8 pb-24 px-4 overflow-x-hidden">
      {completed && (
        <Confetti
          width={windowWidth}
          height={windowHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Header Area */}
      <GameHeader
        level={level}
        setLevel={setLevel}
        handleStartNewGame={handleStartNewGame}
      />
      {/* 
        Timer Area 
        - key={gameId}: 値が変わるたびにTimerがアンマウント・再マウントされ、秒数(seconds)が0にリセットされる
        - autoStart={gameId > 0}: 初回アクセス時(0)は停止状態、New Gameボタン押下後(1以上)は自動でタイマーが開始される
      */}
      <Timer key={gameId} completed={completed} autoStart={gameId > 0} />

      {/* Sudoku Grid Area */}
      <div className="w-full max-w-120 aspect-square relative">
        <div
          className={`w-full h-full grid grid-cols-9 bg-slate-900 border-2 border-cyan-400 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-700 ${completed ? "blur-sm grayscale-50" : ""}`}
        >
          {matrix.map((row, rowIndex) =>
            row.map((cell, cellIndex) => {
              // 状態の判定
              const isSelected =
                selectedRow === rowIndex && selectedCol === cellIndex;
              const isInitial = initialBoard[rowIndex][cellIndex] !== 0;

              // 同じ数字のハイライト
              const isSameValue =
                cell !== 0 && selectedValue === cell && !isSelected;

              // スタイリング用クラスの構築
              let bgClass = "bg-slate-900";
              if (completed) {
                bgClass = "bg-slate-900";
              } else if (isSelected) {
                bgClass =
                  "bg-blue-500/30 ring-2 ring-inset ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10";
              } else if (isSameValue) {
                bgClass = "bg-cyan-900/40";
              } else {
                bgClass = "hover:bg-slate-800 transition-colors duration-200";
              }

              let textClass = "";
              if (isInitial) {
                textClass = "text-slate-300 font-bold";
              } else {
                textClass = "text-blue-400 font-medium";
              }
              if (isSameValue) {
                textClass +=
                  " text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]";
              }
              if (completed) {
                textClass = "text-slate-500";
              }

              // 枠線の構築 (3x3ブロックを区切る太い線)
              // `border-slate-600` をベースカラーとし、3x3の区切りだけ太さを変えることで統一感を出す
              const borderBottom =
                rowIndex % 3 === 2 && rowIndex !== 8
                  ? "border-b-[3px]"
                  : "border-b";
              const borderRight =
                cellIndex % 3 === 2 && cellIndex !== 8
                  ? "border-r-[3px]"
                  : "border-r";
              const borderNoneBottom = rowIndex === 8 ? "border-b-0" : "";
              const borderNoneRight = cellIndex === 8 ? "border-r-0" : "";

              return (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  onClick={() => setSelectedCell([rowIndex, cellIndex])}
                  className={`
                    flex items-center justify-center text-xl md:text-3xl cursor-pointer select-none
                    border-slate-600
                    ${bgClass}
                    ${textClass}
                    ${borderBottom} ${borderRight} ${borderNoneBottom} ${borderNoneRight}
                    ${isInitial || completed ? "pointer-events-none" : ""}
                  `}
                >
                  {cell !== 0 ? cell : ""}
                </div>
              );
            }),
          )}
        </div>

        {/* Completed Message */}
        {completed && (
          <p className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-2xl bg-slate-900/80 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 md:px-10 md:py-8 rounded-2xl md:rounded-3xl border border-white/10 absolute top-1/2 left-1/2 animate-slide-up-bounce z-50 whitespace-nowrap shadow-[0_0_50px_rgba(59,130,246,0.3)] pointer-events-none">
            🎉 Completed! 🎊
          </p>
        )}
      </div>

      {/* Number Pad Area */}
      <NumberPad
        onClickNumberButton={onClickNumberButton}
        onClickCancelButton={onClickCancelButton}
        completed={completed}
      />

      {/* Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
}

export default App;
