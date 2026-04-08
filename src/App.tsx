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
    <div className="min-h-screen bg-slate-950 font-['Inter',_sans-serif] text-slate-100 flex flex-col items-center pt-8 pb-24 px-4 overflow-x-hidden">
      {completed && <Confetti width={windowWidth} height={windowHeight} recycle={false} numberOfPieces={500} />}
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-[480px] mb-6 gap-4 sm:gap-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] whitespace-nowrap">
          My Number Place
        </h1>
        <div className="flex gap-3 w-full sm:w-auto justify-center">
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
        <div className={`w-full h-full grid grid-cols-9 bg-slate-900 border-2 border-cyan-400 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-700 ${completed ? "blur-sm grayscale-[50%]" : ""}`}>
          {matrix.map((row, rowIndex) => (
            row.map((cell, cellIndex) => {
              // 状態の判定
              const isSelected = selectedRow === rowIndex && selectedCol === cellIndex;
              const isInitial = initialBoard[rowIndex][cellIndex] !== 0;
              
              // 同じ数字のハイライト
              const isSameValue = cell !== 0 && selectedValue === cell && !isSelected;

              // スタイリング用クラスの構築
              let bgClass = "bg-slate-900";
              if (completed) {
                bgClass = "bg-slate-900";
              } else if (isSelected) {
                bgClass = "bg-blue-500/30 ring-2 ring-inset ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10";
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
                textClass += " text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]";
              }
              if (completed) {
                textClass = "text-slate-500";
              }

              // 枠線の構築 (3x3ブロックを区切る太い線)
              // `border-slate-600` をベースカラーとし、3x3の区切りだけ太さを変えることで統一感を出す
              const borderBottom = rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-[3px]" : "border-b";
              const borderRight = cellIndex % 3 === 2 && cellIndex !== 8 ? "border-r-[3px]" : "border-r";
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
           <p className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-2xl bg-slate-900/80 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 md:px-10 md:py-8 rounded-2xl md:rounded-3xl border border-white/10 absolute top-1/2 left-1/2 animate-slide-up-bounce z-50 whitespace-nowrap shadow-[0_0_50px_rgba(59,130,246,0.3)] pointer-events-none">
             🎉 Completed! 🎊
           </p>
        )}
      </div>

      {/* Number Pad Area */}
      <div className="w-full max-w-[480px] mt-6 flex flex-col gap-3 sm:gap-4">
        {/* 数字ボタン: 1列に配置 */}
        <div className="grid grid-cols-9 gap-1 sm:gap-2">
          {NUMBERS.map((n) => (
            <button
              key={n}
              onClick={onClickNumberButton}
              disabled={completed}
              className="aspect-[4/5] sm:aspect-square flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-800 text-slate-200 text-lg sm:text-2xl font-semibold shadow-md border border-slate-700 hover:bg-slate-700 hover:-translate-y-1 hover:shadow-cyan-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {n}
            </button>
          ))}
        </div>
        
        {/* キャンセルボタン: 行を変えて大きく配置 */}
        <div className="flex justify-center mt-2">
          <button
            onClick={onClickCancelButton}
            disabled={completed}
            className="w-full max-w-[200px] py-3 flex items-center justify-center gap-2 rounded-full bg-red-900/30 text-red-400 text-sm sm:text-base font-bold shadow-lg border border-red-900/50 hover:bg-red-900/50 hover:-translate-y-1 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            消去 (Erase)
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full h-16 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center px-4 z-50">
        <div className="flex flex-col items-center justify-center text-cyan-400 cursor-pointer active:scale-95 transition-transform">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span className="text-[10px] font-semibold">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 cursor-pointer active:scale-95 transition-all">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] font-semibold">History</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 cursor-pointer active:scale-95 transition-all">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-[10px] font-semibold">Settings</span>
        </div>
      </div>
    </div>
  );
}

export default App;
