import { useState } from "react";
import "./App.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { blue, lightBlue } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";

function App() {
  /**
   * 配列内の要素をランダムに並び替える関数
   * 配列を入力し、要素を並び替えた配列にして返す
   */
  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const matrix: number[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => 0),
  );
  const [newMatrix, setNewMatrix] = useState<number[][]>(matrix);

  const generateArray = () => {

    const blockA: number[] = Array.from({ length: 9 }, () => 0);
    const blockB: number[] = Array.from({ length: 9 }, () => 0);
    const blockC: number[] = Array.from({ length: 9 }, () => 0);
    const blockD: number[] = Array.from({ length: 9 }, () => 0);
    const blockE: number[] = Array.from({ length: 9 }, () => 0);
    const blockF: number[] = Array.from({ length: 9 }, () => 0);
    const blockG: number[] = Array.from({ length: 9 }, () => 0);
    const blockH: number[] = Array.from({ length: 9 }, () => 0);
    const blockI: number[] = Array.from({ length: 9 }, () => 0);

    for (let i = 0; i < 9; i++) {
      let count = 0;
      do {
        let rowNumbers = shuffleArray([...numbers]);
        // i行目を一旦0でリセットする
        matrix[i].fill(0);

        for (let j = 0; j < 9; j++) {
          const column: number[] = matrix.map((row) => row[j]);
          if (i < 3 && j < 3) {
            blockA[3 * i + j] = 0;
            const num =
              rowNumbers.find(
                (n) => !column.includes(n) && !blockA.includes(n),
              ) || 0;
            matrix[i][j] = num;
            blockA[3 * i + j] = num;
            rowNumbers = rowNumbers.filter((n) => n !== num);
          } else if (i < 3 && j < 6) {
            blockB[3 * i + j - 3] = 0;
            const num =
              rowNumbers.find(
                (n) => !column.includes(n) && !blockB.includes(n),
              ) || 0;
            matrix[i][j] = num;
            blockB[3 * i + j - 3] = num;
            rowNumbers = rowNumbers.filter((n) => n !== num);
          } else if (i < 3 && j < 9) {
            blockC[i * 3 + j - 6] = 0;
            const num =
              rowNumbers.find(
                (n) => !column.includes(n) && !blockC.includes(n),
              ) || 0;
            matrix[i][j] = num;
            blockC[i * 3 + j - 6] = num;
            rowNumbers = rowNumbers.filter((n) => n !== num);
          } else if (i < 6 && j < 3) {
            blockD[(i - 3) * 3 + j] = 0;
            const num =
              rowNumbers.find(
                (n) => !column.includes(n) && !blockD.includes(n),
              ) || 0;
            matrix[i][j] = num;
            blockD[(i - 3) * 3 + j] = num;
            rowNumbers = rowNumbers.filter((n) => n !== num);
          } else if (i < 6 && j < 6) {
            blockE[(i - 3) * 3 + j - 3] = 0;
            const num =
              rowNumbers.find(
                (n) => !column.includes(n) && !blockE.includes(n),
              ) || 0;
            matrix[i][j] = num;
            blockE[(i - 3) * 3 + j - 3] = num;
            rowNumbers = rowNumbers.filter((n) => n !== num);
          } else if (i < 6 && j < 9) {
            blockF[(i - 3) * 3 + j - 6] = 0;
            const num =
              rowNumbers.find(
                (n) => !column.includes(n) && !blockF.includes(n),
              ) || 0;
            matrix[i][j] = num;
            blockF[(i - 3) * 3 + j - 6] = num;
            rowNumbers = rowNumbers.filter((n) => n !== num);
          } else if (i < 9 && j < 3) {
            blockG[(i - 6) * 3 + j] = 0;
            const num =
              rowNumbers.find(
                (n) => !column.includes(n) && !blockG.includes(n),
              ) || 0;
            matrix[i][j] = num;
            blockG[(i - 6) * 3 + j] = num;
            rowNumbers = rowNumbers.filter((n) => n !== num);
          } else if (i < 9 && j < 6) {
            blockH[(i - 6) * 3 + j - 3] = 0;
            const num =
              rowNumbers.find(
                (n) => !column.includes(n) && !blockH.includes(n),
              ) || 0;
            matrix[i][j] = num;
            blockH[(i - 6) * 3 + j - 3] = num;
            rowNumbers = rowNumbers.filter((n) => n !== num);
          } else if (i < 9 && j < 9) {
            blockI[(i - 6) * 3 + j - 6] = 0;
            const num =
              rowNumbers.find(
                (n) => !column.includes(n) && !blockI.includes(n),
              ) || 0;
            matrix[i][j] = num;
            blockI[(i - 6) * 3 + j - 6] = num;
            rowNumbers = rowNumbers.filter((n) => n !== num);
          } else {
            console.error("配列が不正です");
          }
        }
        count++;
        console.log(count);
        console.log(`${i + 1}行目`);
        console.log(matrix[i]);
      } while (matrix[i].includes(0) && count < 10);
    }

    const hasZero = matrix.some((row) => row.includes(0));
    if (hasZero) console.error("配列に0が混じっています");
    console.log(matrix);

    setNewMatrix(matrix);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Number Place</h1>
        <button
          onClick={generateArray}
          className="bg-gray-300 border px-4 rounded-lg mb-4 hover:cursor-pointer hover:bg-gray-400"
        >
          生成
        </button>
        <div className="size-120">
          <TableContainer>
            <Table>
              <TableBody sx={{ border: 2, bgcolor: alpha(blue[500], 0.2) }}>
                {newMatrix.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          borderBottom: 2,
                          borderBottomColor:
                            rowIndex % 3 === 2 ? "black" : "grey.400",
                          borderRight: 2,
                          borderRightColor:
                            cellIndex % 3 === 2 ? "black" : "grey.400",
                        }}
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

export default App;

// switch (true) {
//   case i >= 0 && i < 3:
//     switch (true) {
//       case j >= 0 && j < 3 && !blockA.includes(num):
//         blockA.push(num);
//         matrix[i][j] = num;
//         console.log(matrix);
//         rowNumbers = rowNumbers.filter((n) => n !== num);
//         break;
//       case j >= 3 && j < 6 && !blockB.includes(num):
//         blockB.push(num);
//         matrix[i][j] = num;
//         rowNumbers = rowNumbers.filter((n) => n !== num);
//         break;
//       case j >= 6 && j < 9 && !blockC.includes(num):
//         blockC.push(num);
//         matrix[i][j] = num;
//         rowNumbers = rowNumbers.filter((n) => n !== num);
//         break;
//       default:
//         console.error("不正な処理です。");
//     }
//     break;
//   case i >= 3 && i < 6:
//     switch (true) {
//       case j >= 0 && j < 3 && !blockD.includes(num):
//         blockD.push(num);
//         matrix[i][j] = num;
//         rowNumbers = rowNumbers.filter((n) => n !== num);
//         break;
//       case j >= 3 && j < 6 && !blockE.includes(num):
//         blockE.push(num);
//         matrix[i][j] = num;
//         rowNumbers = rowNumbers.filter((n) => n !== num);
//         break;
//       case j >= 6 && j < 9 && !blockF.includes(num):
//         blockF.push(num);
//         matrix[i][j] = num;
//         rowNumbers = rowNumbers.filter((n) => n !== num);
//         break;
//       default:
//         console.error("不正な処理です。");
//     }
//     break;
//   case i >= 6 && i < 9:
//     switch (true) {
//       case j >= 0 && j < 3 && !blockG.includes(num):
//         blockG.push(num);
//         matrix[i][j] = num;
//         rowNumbers = rowNumbers.filter((n) => n !== num);
//         break;
//       case j >= 3 && j < 6 && !blockH.includes(num):
//         blockH.push(num);
//         matrix[i][j] = num;
//         rowNumbers = rowNumbers.filter((n) => n !== num);
//         break;
//       case j >= 6 && j < 9 && !blockI.includes(num):
//         blockI.push(num);
//         matrix[i][j] = num;
//         rowNumbers = rowNumbers.filter((n) => n !== num);
//         break;
//       default:
//         console.error("不正な処理です。");
//     }
//     break;
// }
// }
// });
