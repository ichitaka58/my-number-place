import { NUMBERS } from "../utils/sudokuLogic";

type NumberPadProps = {
  onClickNumberButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickCancelButton: () => void;
  completed: boolean;
  isRunning: boolean
};


export const NumberPad = ({ onClickNumberButton, onClickCancelButton, completed, isRunning }: NumberPadProps) => {

    return (
        <div className="w-full max-w-120 mt-6 flex flex-col gap-3 sm:gap-4">
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

            {/* キャンセルボタン: 行を変えて大きく配置 */}
            <div className="flex justify-center mt-2">
                <button
                    onClick={onClickCancelButton}
                    disabled={completed || !isRunning}
                    className="w-full max-w-50 py-3 flex items-center justify-center gap-2 rounded-full bg-red-900/30 text-red-400 text-sm sm:text-base font-bold shadow-lg border border-red-900/50 hover:bg-red-900/50 hover:-translate-y-1 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    消去 (Erase)
                </button>
            </div>
        </div>
    );
}