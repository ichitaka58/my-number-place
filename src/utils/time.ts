// 画面に表示するタイマーを00:00形式にする関数
export const generateDisplayTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const minToStr = String(min).padStart(2, "0");
    const sec = seconds % 60;
    const secToStr = String(sec).padStart(2, "0");
    const displayTimer = `${minToStr}:${secToStr}`;
    return displayTimer;
};