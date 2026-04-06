import { useEffect } from "react";
import "./App.css";
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

  // コンポーネントの初回マウント時に一度だけ盤面を自動生成する
  useEffect(() => {
    handleGenerate();
  }, [])

  return (
    <>
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
                          ...(completed && { pointerEvents: "none", color: "grey.600", bgcolor: "white"})
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
          {completed && <p className="text-4xl font-bold text-green-600 text-shadow-lg bg-white p-4 rounded-xl absolute top-1/2 left-1/2 animate-slide-up">Completed!</p>}
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

