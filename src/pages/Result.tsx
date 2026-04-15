import { BottomNavigation } from "../components/BottomNavigation";

const Result = () => {
  return (
      <div className="min-h-screen bg-slate-950 font-['Inter',sans-serif] text-slate-100 flex flex-col items-center justify-center pt-8 pb-24 px-4 overflow-x-hidden">
        <div className="text-center p-10 bg-slate-900 border-2 border-cyan-400 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 tracking-wider drop-shadow-lg">
            Result
          </h1>
          <div className="mb-8">
            {/* <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name..."
              className="w-64 p-3 text-lg bg-slate-950 text-cyan-300 border-2 border-slate-600 rounded-lg placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            /> */}
          </div>
          <div>
            {/* <button
              onClick={handleStart}
              className="px-8 py-3 text-xl font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-300 border border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]"
            >
              Start Game
            </button> */}
          </div>
        </div>
        <BottomNavigation />
      </div>
  );
};

export default Result;