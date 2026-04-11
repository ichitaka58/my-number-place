import { useEffect, useState } from "react";
import { generateDisplayTimer } from "../utils/time";

export const useTimer = (isRunning: boolean) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    // 1秒ずつカウントアップしていく処理
    const timerId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    // クリーンアップ関数 timerIdをクリアする
    return () => clearInterval(timerId);
  }, [isRunning]);

  // 画面表示用のタイマー00:00形式を生成
  const displayTimer = generateDisplayTimer(seconds);

  return {
    displayTimer,
  };
};
