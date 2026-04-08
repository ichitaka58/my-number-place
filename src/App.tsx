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
import { NUMBERS, type Level } from "./utils/sudokuLogic";

/**
 * ナンバープレース（数独）のメイン・アプリケーションコンポーネント (Sleek Dark Theme)
 */
function App() {
  const { matrix, initialBoard, selectedCell, level, setLevel, setSelectedCell, completed, handleGenerate, onClickNumberButton, onClickCancelButton } = useSudoku();
  const [windowWidth, windowHeight] = useWindowSize();

  // コンポーネントの初回マウント時に一度だけ盤面を自動生成する
  useEffect(() => {
    handleGenerate();
  }, []);

  // 選択されたセルが属するブロック、行、列を特定するためのヘルパー
  const selectedRow = selectedCell[0];
  const selectedCol = selectedCell[1];
  const selectedValue = (selectedRow >= 0 && selectedCol >= 0) ? matrix[selectedRow]?.[selectedCol] ?? 0 : 0;

  return (
    <div className="min-h-screen bg-slate-950 font-['Inter',_sans-serif] text-slate-100 flex flex-col items-center py-10 px-4">
      {completed && <Confetti width={windowWidth} height={windowHeight} recycle={false} numberOfPieces={500} />}
      
      {/* Header Area */}
      <div className="flex justify-between items-center w-full max-w-[480px] mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
          SUDOKU
        </h1>
        <div className="flex gap-3">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm md:text-base rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer appearance-none shadow-lg"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="debug">Debug</option>
          </select>
          <button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base font-semibold py-2 px-4 rounded-lg shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Sudoku Grid Area */}
      <div className="w-full max-w-[480px] aspect-square relative">
        <div className={`w-full h-full grid grid-cols-9 bg-slate-700 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl transition-all duration-700 ${completed ? "blur-sm grayscale-[50%]" : ""}`}>
          {matrix.map((row, rowIndex) => (
            row.map((cell, cellIndex) => {
              // 状態の判定
              const isSelected = selectedRow === rowIndex && selectedCol === cellIndex;
              const isInitial = initialBoard[rowIndex][cellIndex] !== 0;
              
              // クロスハイライト (同じ行、同じ列、同じ3x3ブロック)
              const isSameRow = selectedRow === rowIndex;
              const isSameCol = selectedCol === cellIndex;
              const isSameBlock = Math.floor(selectedRow / 3) === Math.floor(rowIndex / 3) && Math.floor(selectedCol / 3) === Math.floor(cellIndex / 3);
              const isRelated = (isSameRow || isSameCol || isSameBlock) && !isSelected && selectedRow !== -1;
              
              // 同じ数字のハイライト
              const isSameValue = cell !== 0 && selectedValue === cell && !isSelected;

              // スタイリング用クラスの構築
              let bgClass = "bg-slate-900";
              if (completed) {
                bgClass = "bg-slate-900";
              } else if (isSelected) {
                bgClass = "bg-blue-500/30 ring-2 ring-inset ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10";
              } else if (isSameValue) {
                bgClass = "bg-cyan-900/40";
              } else if (isRelated) {
                bgClass = "bg-slate-800";
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
                textClass += " text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]";
              }
              if (completed) {
                textClass = "text-slate-500";
              }

              // 枠線の構築 (3x3ブロックを区切る太い線)
              const borderBottom = rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-[3px] border-slate-700" : "border-b border-slate-800/50";
              const borderRight = cellIndex % 3 === 2 && cellIndex !== 8 ? "border-r-[3px] border-slate-700" : "border-r border-slate-800/50";
              const borderNoneBottom = rowIndex === 8 ? "border-b-0" : "";
              const borderNoneRight = cellIndex === 8 ? "border-r-0" : "";

              return (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  onClick={() => setSelectedCell([rowIndex, cellIndex])}
                  className={`
                    flex items-center justify-center text-xl md:text-3xl cursor-pointer select-none
                    ${bgClass}
                    ${textClass}
                    ${borderBottom} ${borderRight} ${borderNoneBottom} ${borderNoneRight}
                    ${(isInitial || completed) ? "pointer-events-none" : ""}
                  `}
                >
                  {cell !== 0 ? cell : ""}
                </div>
              );
            })
          ))}
        </div>
        
        {/* Completed Message */}
        {completed && (
           <p className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-2xl bg-slate-900/80 backdrop-blur-md px-6 py-4 md:px-10 md:py-8 rounded-3xl border border-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-slide-up-bounce z-50 whitespace-nowrap shadow-[0_0_50px_rgba(59,130,246,0.3)] pointer-events-none">
             🎉 Completed! 🎊
           </p>
        )}
      </div>

      {/* Number Pad Area */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 w-full max-w-[480px] mt-8">
        {NUMBERS.map((n) => (
          <button
            key={n}
            onClick={onClickNumberButton}
            disabled={completed}
            className="aspect-square flex items-center justify-center rounded-xl bg-slate-800 text-slate-200 text-xl md:text-2xl font-semibold shadow-lg border border-slate-700 hover:bg-slate-700 hover:-translate-y-1 hover:shadow-cyan-500/20 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {n}
          </button>
        ))}
        <button
          onClick={onClickCancelButton}
          disabled={completed}
          className="aspect-square flex items-center justify-center rounded-xl bg-red-900/30 text-red-400 text-sm font-semibold shadow-lg border border-red-900/50 hover:bg-red-900/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          取消
        </button>
      </div>
    </div>
  );
}

export default App;
