// ローカルストレージへの保存キー名を変数に入れる
// as constをつけることで、readOnlyの固有名に固定される
export const STORAGE_KEYS = {
  matrix: "currentMatrix",
  memos: "currentMemos",
  userName: "userName",
  timer: "timer",
  initialBoard: "initialBoard",
  solvedBoard: "solvedBoard",
} as const;

/**
 * ローカルストレージの保存データを削除する
 */
export const removeSavedGame = () => {
  localStorage.removeItem(STORAGE_KEYS.matrix);
  localStorage.removeItem(STORAGE_KEYS.memos);
  localStorage.removeItem(STORAGE_KEYS.userName);
  localStorage.removeItem(STORAGE_KEYS.timer);
  localStorage.removeItem(STORAGE_KEYS.initialBoard);
  localStorage.removeItem(STORAGE_KEYS.solvedBoard);
};
