import { NUMBERS } from "../utils/sudokuLogic";

type NumberPadProps = {
  onClickNumberButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  completed: boolean;
  isRunning: boolean;
  isMemoMode: boolean;
  onClickMemoNumber: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const NumberPad = ({
  onClickNumberButton,
  completed,
  isRunning,
  isMemoMode,
  onClickMemoNumber,
}: NumberPadProps) => {
  return (
    <div className="grid grid-cols-9 gap-1 sm:gap-2">
      {NUMBERS.map((n) => (
        <button
          key={n}
          onClick={isMemoMode ? onClickMemoNumber : onClickNumberButton}
          disabled={completed || !isRunning}
          className="aspect-4/5 sm:aspect-square flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-800 text-slate-200 text-lg sm:text-2xl font-semibold shadow-md border border-slate-700 hover:bg-slate-700 hover:-translate-y-1 hover:shadow-cyan-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          {n}
        </button>
      ))}
    </div>
  );
};
