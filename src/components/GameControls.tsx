import { CiEraser } from "react-icons/ci";
import { LuSquarePen } from "react-icons/lu";
import { MdSaveAlt } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";

type GameControlsProps = {
  onClickCancelButton: () => void;
  completed: boolean;
  isRunning: boolean;
  onToggleMemoMode: () => void;
  isMemoMode: boolean;
  handleStartNewGame: () => void;
  onClickSaveButton: () => void;
};

const GameControls = ({
  onClickCancelButton,
  completed,
  isRunning,
  onToggleMemoMode,
  isMemoMode,
  handleStartNewGame,
  onClickSaveButton,
}: GameControlsProps) => {
  return (
    <div className="flex justify-center mt-2 gap-10">
      {/* 取り消しボタン */}
      <button
        onClick={onClickCancelButton}
        disabled={completed || !isRunning}
        className="cursor-pointer hover:scale-105 text-slate-500 hover:text-slate-200 hover:-translate-y-0.5 active:translate-y-0 transition-all text-2xl flex flex-col items-center justify-center disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
      >
        <CiEraser />
        <span className="text-xs">取消</span>
      </button>
      {/* メモボタン */}
      <button
        onClick={onToggleMemoMode}
        disabled={completed || !isRunning}
        className="relative cursor-pointer hover:scale-105 text-slate-500 hover:text-slate-200 hover:-translate-y-0.5 active:translate-y-0 transition-all text-2xl flex flex-col items-center justify-center disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
      >
        <LuSquarePen />
        {isMemoMode && (
          <span className="absolute top-0 px-1 text-[10px] text-slate-500 bg-slate-200 rounded">
            ON
          </span>
        )}
        <span className="text-xs">メモ</span>
      </button>
      {/* New Game ボタン */}
      <button
        onClick={handleStartNewGame}
        className="cursor-pointer hover:scale-105 text-slate-500 hover:text-slate-200 hover:-translate-y-0.5 active:translate-y-0 transition-all text-2xl flex flex-col items-center justify-center"
      >
        <VscNewFile />
        <span className="text-[10px]">New Game</span>
      </button>
      {/* 一時保存ボタン */}
      <button
        onClick={onClickSaveButton}
        disabled={completed || !isRunning}
        className="cursor-pointer hover:scale-105 text-slate-500 hover:text-slate-200 hover:-translate-y-0.5 active:translate-y-0 transition-all text-2xl flex flex-col items-center justify-center disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
      >
        <MdSaveAlt />
        <span className="text-xs">一時保存</span>
      </button>
    </div>
  );
};

export default GameControls;
