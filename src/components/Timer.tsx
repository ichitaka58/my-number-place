import { useEffect } from "react";
import { useTimer } from "../hooks/useTimer";
import type { Level } from "../utils/sudokuLogic";
import { createResult } from "../lib/api";

/**
 * Timerコンポーネントのプロパティ定義
 * @property {boolean} completed - ゲームがクリアされたかどうかを示すフラグ
 * @property {boolean} autoStart - Timerマウント時にカウントを自動で開始するかどうかのフラグ
 */
type TimerProps = {
  completed: boolean;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string;
  level: Level;
};

/**
 * ゲームの経過時間を管理・表示するタイマーコンポーネント
 * 内部で useTimer フックを使用し、状態を管理しています。
 */
export const Timer = ({
  completed,
  isRunning,
  setIsRunning,
  userName,
  level,
}: TimerProps) => {
  const { displayTimer, seconds } = useTimer(isRunning);

  // ゲームクリア時にタイマーを停止し、クリア結果をサーバーに保存する
  useEffect(() => {
    if (completed) {
      setIsRunning(false);
      // サーバーへの保存
      createResult(userName, seconds, level);
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
