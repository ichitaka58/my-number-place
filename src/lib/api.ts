import type { Record } from "../types";

// バックエンドAPIのベースURL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8888";

/**
 * ゲームクリア結果をサーバーに保存する
 * @param {string} userName - プレイヤー名
 * @param {number} totalTime - クリアタイム（秒）
 * @param {string} level - ゲームの難易度
 */
export const createResult = async (
  userName: string,
  totalTime: number,
  level: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/clear-times`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        time: totalTime,
        level: level,
      }),
    });
    if (!response.ok) {
      throw new Error("クリアタイムの保存に失敗しました");
    }
  } catch (error) {
    console.error("Error save record:", error);
  }
};

/**
 * サーバーからゲームクリア結果の一覧を取得する
 * @returns {Promise<Record[]>} 取得したレコードの配列
 */
export const fetchResults = async (): Promise<Record[]> => {
  try {
    const response = await fetch(`${API_URL}/api/clear-times`);

    if (!response.ok) {
      throw new Error("クリアタイム一覧取得に失敗しました");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

/**
 * 指定したIDのゲームクリア結果をサーバーから削除する
 * @param {number} id - 削除対象レコードのID
 */
export const deleteResult = async (id: number) => {
  try {
    if(!confirm("このレコードを削除しますか？")) return;
    const response = await fetch(`${API_URL}/api/clear-times/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("クリアタイムの削除に失敗しました");
    }
  } catch (error) {
    console.error("Error deleting record:", error);
    // 呼び出し側でDBとUIの整合性を保つためにエラーを再スロー
    throw error;
  }
};
