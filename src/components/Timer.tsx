import { useEffect } from "react";
import { useTimer } from "../hooks/useTimer";

/**
 * Timerコンポーネントのプロパティ定義
 * @property {boolean} completed - ゲームがクリアされたかどうかを示すフラグ
 * @property {boolean} autoStart - Timerマウント時にカウントを自動で開始するかどうかのフラグ
 */
type TimerProps = {
  completed: boolean;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * ゲームの経過時間を管理・表示するタイマーコンポーネント
 * 内部で useTimer フックを使用し、状態を管理しています。
 */
export const Timer = ({ completed, isRunning, setIsRunning }: TimerProps) => {
  const { displayTimer } = useTimer(isRunning);

  // ゲームクリア状態（completed）を監視し、trueになればタイマーを停止する
  useEffect(() => {
    if (completed) {
      setIsRunning(false);
    }
  }, [completed, setIsRunning]);


  return (
    <div className="flex gap-4">
      <div className="flex gap-1">
        <p>Timer:</p>
        <p className="w-11">{displayTimer}</p>
      </div>
      <button
        onClick={() => setIsRunning(!isRunning)}
        disabled={completed}
        className="text-xs border-2 border-amber-50 px-2 rounded-2xl"
      >
        pause
      </button>
    </div>
  );
};
