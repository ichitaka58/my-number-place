import { NUMBERS } from "../utils/sudokuLogic";
import { CiEraser } from "react-icons/ci";
import { VscNewFile } from "react-icons/vsc";

type NumberPadProps = {
  onClickNumberButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickCancelButton: () => void;
  completed: boolean;
  isRunning: boolean;
  handleStartNewGame: () => void;
};

export const NumberPad = ({
  onClickNumberButton,
  onClickCancelButton,
  completed,
  isRunning,
  handleStartNewGame,
}: NumberPadProps) => {
  return (
    <div className="w-full max-w-120 mt-6 flex flex-col gap-2 sm:gap-2">
      {/* 数字ボタン: 1列に配置 */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {NUMBERS.map((n) => (
          <button
            key={n}
            onClick={onClickNumberButton}
            disabled={completed || !isRunning}
            className="aspect-4/5 sm:aspect-square flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-800 text-slate-200 text-lg sm:text-2xl font-semibold shadow-md border border-slate-700 hover:bg-slate-700 hover:-translate-y-1 hover:shadow-cyan-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-2 gap-10">
        {/* 取り消しボタン */}
        <button
          onClick={onClickCancelButton}
          disabled={completed || !isRunning}
          className="cursor-pointer hover:scale-105 text-slate-500 hover:text-slate-200 hover:-translate-y-0.5 active:translate-y-0 transition-all text-3xl flex flex-col items-center justify-center disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          <CiEraser />
          <span className="text-xs">取消</span>
        </button>
        {/* New Game ボタン */}
        <button
          onClick={handleStartNewGame}
          className="cursor-pointer hover:scale-105 text-slate-500 hover:text-slate-200 hover:-translate-y-0.5 active:translate-y-0 transition-all text-2xl flex flex-col items-center justify-end"
        >
          <VscNewFile />
          <span className="text-xs">New Game</span>
        </button>
      </div>
    </div>
  );
};
