import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./App.css";

// 画面サイズを取得するためのカスタムフック
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}
import {
  Button,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { blue, yellow } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import { useSudoku } from "./hooks/useSudoku";
import { NUMBERS, type Level } from "./utils/sudokuLogic";

/**
 * ナンバープレース（数独）のメイン・アプリケーションコンポーネント
 */
function App() {
  const { matrix, initialBoard, selectedCell, level, setLevel, setSelectedCell, completed, handleGenerate, onClickNumberButton, onClickCancelButton } = useSudoku();
  const [windowWidth, windowHeight] = useWindowSize();

  // コンポーネントの初回マウント時に一度だけ盤面を自動生成する
  useEffect(() => {
    handleGenerate();
  }, [])

  return (
    <>
      {completed && <Confetti width={windowWidth} height={windowHeight} recycle={false} numberOfPieces={500} />}
      <div className="flex flex-col justify-center items-center min-h-screen max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">My Number Place</h1>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            onClick={handleGenerate}
            variant="contained"
            size="small"
            sx={{ fontSize: "0.8rem", px: 1.5, py: 0.5, height: "32px" }}
          >
            問題生成
          </Button>
          <Select 
            size="small" 
            value={level} 
            defaultValue="easy" 
            onChange={(e) => setLevel(e.target.value as Level)}
            sx={{ fontSize: "0.8rem", height: "32px" }}
          >
            <MenuItem value="easy" sx={{ fontSize: "0.8rem" }}>Easy</MenuItem>
            <MenuItem value="medium" sx={{ fontSize: "0.8rem" }}>Medium</MenuItem>
            <MenuItem value="hard" sx={{ fontSize: "0.8rem" }}>Hard</MenuItem>
            <MenuItem value="debug" sx={{ fontSize: "0.8rem" }}>debug</MenuItem>
          </Select>
        </Stack>
        <div className="w-full max-w-[480px] aspect-square mt-4 relative px-2 sm:px-0">
          <div className={`transition-all duration-700 ${completed ? "blur-sm grayscale-[50%]" : ""}`}>
            <TableContainer>
              <Table>
                <TableBody sx={{ border: 2, bgcolor: alpha(blue[500], 0.2) }}>
                  {matrix.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          onClick={() => {
                            setSelectedCell([rowIndex, cellIndex])
                          }}
                          key={cellIndex}
                          align="center"
                          sx={{
                            fontSize: { xs: "1.1rem", sm: "1.5rem" },
                            fontWeight: "bold",
                            px: { xs: "4px", sm: "12px" },
                            py: { xs: "6px", sm: "8px" },
                            borderBottom: 2,
                            // 3x3ブロックの水平方向の境界線を強調表示
                            borderBottomColor:
                              rowIndex % 3 === 2 ? "black" : "grey.400",
                            borderRight: 2,
                            // 3x3ブロックの垂直方向の境界線を強調表示
                            borderRightColor:
                              cellIndex % 3 === 2 ? "black" : "grey.400",
                            // 選択中のセルの背景色
                            bgcolor: selectedCell[0] === rowIndex && selectedCell[1] === cellIndex ? alpha(yellow[200], 0.5) : "inherit",
                            // 初期盤面の数字が0でない場合は、ポインターイベントを無効にする
                            ...(initialBoard[rowIndex][cellIndex] !== 0 && { pointerEvents: "none", color: "grey.800", bgcolor: alpha(blue[200], 0.5) }),
                            ...(completed && { pointerEvents: "none", color: "grey.600", bgcolor: "white" })
                          }}
                        >
                          {cell || "\u00A0"}
                        </TableCell> // cell || "\u00A0" で、0のときに &nbsp;（ノーブレークスペース）を表示
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {completed && <p className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 drop-shadow-2xl bg-white/80 backdrop-blur-md px-4 py-4 md:px-8 md:py-6 rounded-2xl border-2 border-white/50 absolute top-1/2 left-1/2 animate-slide-up-bounce z-50 whitespace-nowrap">🎉 Completed! 🎊</p>}
        </div>
        <div className="w-full max-w-[480px] mt-4 px-2 sm:px-0">
          <div className="flex w-full overflow-hidden rounded border border-gray-400">
            {NUMBERS.map((n) => (
              <button
                key={n}
                onClick={onClickNumberButton}
                disabled={completed}
                className="flex-[1] min-w-0 px-0 h-11 sm:h-12 text-[1.1rem] sm:text-[1.2rem] text-inherit border-r border-gray-400 enabled:hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent cursor-pointer"
              >
                {n}
              </button>
            ))}
            <button
              onClick={onClickCancelButton}
              disabled={completed}
              className="flex-[1.5] min-w-0 px-0 h-11 sm:h-12 text-[0.55rem] sm:text-[0.6rem] font-medium bg-red-200/20 enabled:hover:bg-red-200/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-inherit cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

