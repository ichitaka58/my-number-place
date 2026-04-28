import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { Level } from "../utils/sudokuLogic";
import InputLabel from "@mui/material/InputLabel";

type LevelSelectProps = {
    level: Level;
    setLevel: React.Dispatch<React.SetStateAction<Level>>;
}

export const LevelSelectButton = ({ level, setLevel }: LevelSelectProps) => {
    return (
        <div className="absolute left-0 pl-2">
            <FormControl variant="outlined" size="small">
                <InputLabel 
                    id="level-select-label"
                    sx={{ 
                        color: '#94a3b8', 
                        fontSize: '0.8rem',
                        // ラベルの初期位置を小さくしたSelectボックスの中央に合わせる
                        transform: 'translate(14px, 6px) scale(1)',
                        '&.MuiInputLabel-shrink': {
                            transform: 'translate(14px, -7px) scale(0.75)',
                        },
                        '&.Mui-focused': { color: '#22d3ee' } 
                    }}
                >
                    Level
                </InputLabel>
                <Select 
                    labelId="level-select-label"
                    value={level} 
                    label="Level"
                    onChange={(e) => setLevel(e.target.value as Level)} 
                    sx={{ 
                        color: "#f1f5f9",
                        width: "90px", // 幅を少し狭く
                        height: "30px", // 高さを小さく
                        fontSize: "0.8rem", // フォントサイズを小さく
                        '.MuiSelect-select': {
                            padding: '4px 8px', // 内側の余白を小さく
                        },
                        '.MuiOutlinedInput-notchedOutline': { borderColor: '#475569' }, 
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#22d3ee' }, 
                        '.MuiSvgIcon-root': { color: '#94a3b8', width: '0.9em', height: '0.9em' } // 矢印も少し小さく
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: '#1e293b', 
                                color: '#f1f5f9',
                                border: '1px solid #475569',
                            }
                        }
                    }}
                >
                    <MenuItem value="easy" sx={{ fontSize: '0.8rem', minHeight: '32px' }}>Easy</MenuItem>
                    <MenuItem value="medium" sx={{ fontSize: '0.8rem', minHeight: '32px' }}>Medium</MenuItem>
                    <MenuItem value="hard" sx={{ fontSize: '0.8rem', minHeight: '32px' }}>Hard</MenuItem>
                    <MenuItem value="debug" sx={{ fontSize: '0.8rem', minHeight: '32px' }}>Debug</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};