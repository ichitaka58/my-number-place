import { useEffect, useState } from "react";
import { BottomNavigation } from "../components/BottomNavigation";
import { fetchResults } from "../lib/api";
import type { Record } from "../types";
import { generateDisplayTimer } from "../utils/time";
import mockData from "../mock/mockRecords.json";
import type { Level } from "../utils/sudokuLogic";

const Result = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [mockRecords] = useState(mockData);
  const [selectedLevel, setSelectedLevel] = useState<Level>("easy");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchResults();
      if (data) setRecords(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-['Inter',sans-serif] text-slate-100 flex flex-col items-center justify-center pt-8 pb-24 px-4 overflow-x-hidden">
      <div className="min-w-84 min-h-72 text-center p-10 bg-slate-900 border-2 border-cyan-400 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.5)]">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 tracking-wider drop-shadow-lg">
          Result
        </h1>
        <div className="flex justify-center gap-4 mb-4">
          <button>Easy</button>
          <button>Medium</button>
          <button>Hard</button>
        </div>
        <ul className="space-y-2">
          {loading ? (
            <li className="text-cyan-400">Loading</li>
          ) : (
            records.map((r) => (
              <li
                key={r.id}
                className="flex justify-around items-center border-b-2 border-blue-400 pb-1"
              >
                <span className="w-30 text-left text-sm truncate">
                  {r.userName}
                </span>
                <span className="w-12 text-right text-cyan-400 tabular-nums [text-shadow:0_0_10px_rgba(34,211,238,0.8)]">
                  {generateDisplayTimer(r.time)}
                </span>
                <span className="w-20 text-center text-sm">{r.level}</span>
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
