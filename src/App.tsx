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
  ButtonGroup,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { blue, red, yellow } from "@mui/material/colors";
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
        <h1 className="text-4xl font-bold mb-4">My Number Place</h1>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={handleGenerate}
            variant="contained"
          >
            問題生成
          </Button>
          <Select size="small" value={level} defaultValue="easy" onChange={(e) => setLevel(e.target.value as Level)}>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
            <MenuItem value="debug">debug</MenuItem>
          </Select>
        </Stack>
        <div className="size-120 mt-4 relative">
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
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            px: "12px",
                            py: "8px",
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
          {completed && <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 drop-shadow-2xl bg-white/80 backdrop-blur-md px-8 py-6 rounded-2xl border-2 border-white/50 absolute top-1/2 left-1/2 animate-slide-up-bounce z-50 whitespace-nowrap">🎉 Completed! 🎊</p>}
        </div>
        <div className="w-120 text-center">
          <ButtonGroup variant="outlined" color="inherit" fullWidth>
            {NUMBERS.map((n) => (
              <Button key={n} onClick={onClickNumberButton} disabled={completed}>{n}</Button>
            ))}
            <Button onClick={onClickCancelButton} sx={{ fontSize: "0.6rem", bgcolor: alpha(red[200], 0.2) }} disabled={completed}>CANCEL</Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
}

export default App;

