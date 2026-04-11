import type { Level } from "../utils/sudokuLogic";

/**
 * GameHeaderコンポーネントのプロパティ定義
 * @property {Level} level - 現在選択中の難易度（easy/medium/hard/debug）
 * @property {React.Dispatch<React.SetStateAction<Level>>} setLevel - 難易度を変更するための状態更新関数
 * @property {function} handleStartNewGame - 新しいゲームを開始するための関数
 */
type GameHeaderProps = {
  level: Level;
  setLevel: React.Dispatch<React.SetStateAction<Level>>;
  handleStartNewGame: () => void;
};

/**
 * 操作ヘッダーコンポーネント
 * アプリのタイトル、難易度の設定プルダウン、および新規ゲームスタートボタンを提供します。
 */
export const GameHeader = ({
  level,
  setLevel,
  handleStartNewGame,
}: GameHeaderProps) => {
  return (
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
          onClick={handleStartNewGame}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base font-semibold py-2 px-4 rounded-lg shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          New Game
        </button>
      </div>
    </div>
  );
};
