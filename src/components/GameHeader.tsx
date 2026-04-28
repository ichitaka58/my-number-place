
/**
 * GameHeaderコンポーネントのプロパティ定義
 * @property {Level} level - 現在選択中の難易度（easy/medium/hard/debug）
 * @property {React.Dispatch<React.SetStateAction<Level>>} setLevel - 難易度を変更するための状態更新関数
 * @property {function} handleStartNewGame - 新しいゲームを開始するための関数
 */

/**
 * ヘッダーコンポーネント
 */
export const GameHeader = () => {
  return (
    <div className="flex justify-center items-center w-full max-w-120 mb-6 sm:mb-4">
      <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] whitespace-nowrap">
        My Number Place
      </h1>
    </div>
  );
};
