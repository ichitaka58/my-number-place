import { useEffect, useState } from "react";
import { BottomNavigation } from "../components/BottomNavigation";
import { fetchResults } from "../lib/api";
import type { Record } from "../types";
import { generateDisplayTimer } from "../utils/time";
import mockData from "../mock/mockRecords.json";
import CircularProgress from "@mui/material/CircularProgress";

const Result = () => {
  // 取得した成績データを保持するステート
  const [records, setRecords] = useState<Record[]>([]);
  // 現在は未使用のモックデータ
  const [mockRecords] = useState(mockData);
  // 選択されている難易度レベル
  const [selectedLevel, setSelectedLevel] = useState<string>("easy");
  // データ取得中かどうかのローディング状態
  const [loading, setLoading] = useState<boolean>(false);

  // 難易度切り替えボタンの定義（[値, 表示名] の形式）
  const LEVEL_OPTIONS: [string, string][] = [
    ["easy", "Easy"],
    ["medium", "Medium"],
    ["hard", "Hard"],
    ["debug", "Debug"]
  ];

  // selectedLevel（選択された難易度）が変更されるたびにデータを取得する
  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // ローディング開始
      const data = await fetchResults();
      if (data) {
        // APIから取得したデータを選択中の難易度でフィルタリングする
        const filteredRecords = data.filter((r) => r.level === selectedLevel);
        setRecords(filteredRecords);
      }
      setLoading(false); // ローディング終了
    };
    loadData();
  }, [selectedLevel]);

  return (
    <div className="min-h-screen bg-slate-950 font-['Inter',sans-serif] text-slate-100 flex flex-col items-center justify-center pt-8 pb-24 px-4 overflow-x-hidden">
      <div className="min-w-84 min-h-72 text-center p-10 bg-slate-900 border-2 border-cyan-400 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.5)]">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 tracking-wider drop-shadow-lg">
          Result
        </h1>
        <div className="flex justify-center gap-4 mb-4">
          {LEVEL_OPTIONS.map(([level, label], index) => (
            <button
              key={index}
              onClick={() => setSelectedLevel(level)}
              className={`cursor-pointer active:scale-95 transition-all border-b-2 border-b-transparent ${selectedLevel === level ? "text-cyan-400  hover:border-cyan-400" : "text-slate-500 hover:text-slate-300 hover:border-slate-300"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {loading ? (
            /* ローディング中はスピナーを表示 */
            <CircularProgress aria-label="Loading..." className="mt-8" />
          ) : records.length === 0 ? (
            /* データが存在しない場合のメッセージ */
            <li className="text-sm mt-8">データがありません</li>
          ) : (
            /* 取得した成績をリスト表示する */
            records.map((record) => (
              <li
                key={record.id}
                className="flex items-center px-4 border-b-2 border-blue-400 pb-1"
              >
                <span className="flex-1 text-left text-sm truncate">
                  {record.userName}
                </span>
                <span className="w-12 text-right text-cyan-400 tabular-nums [text-shadow:0_0_10px_rgba(34,211,238,0.8)]">
                  {generateDisplayTimer(record.time)}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Result;
