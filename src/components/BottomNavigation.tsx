import { Link, useLocation } from "react-router-dom";
import PATHS from "../router/paths";

/**
 * 画面下部に固定表示されるナビゲーションバーコンポーネント
 * 現在のパスと一致するメニュー項目をハイライト表示する
 */
export const BottomNavigation = () => {
  // 現在のパスを取得してアクティブなメニュー項目を判定する
  const { pathname } = useLocation();
  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center px-4 z-50">
      <div
        className={`flex flex-col items-center justify-center ${pathname === PATHS.HOME ? "text-cyan-400 cursor-pointer active:scale-95 transition-transform" : "text-slate-500 hover:text-slate-300 cursor-pointer active:scale-95 transition-all"}`}
      >
        <Link to={PATHS.HOME}>
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-[10px] font-semibold">Home</span>
        </Link>
      </div>
      <div
        className={`flex flex-col items-center justify-center ${pathname === PATHS.RESULT ? "text-cyan-400 cursor-pointer active:scale-95 transition-transform" : "text-slate-500 hover:text-slate-300 cursor-pointer active:scale-95 transition-all"}`}
      >
        <Link to={PATHS.RESULT}>
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-[10px] font-semibold">Result</span>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 cursor-pointer active:scale-95 transition-all">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 mb-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-[10px] font-semibold">Settings</span>
      </div>
    </div>
  );
};
