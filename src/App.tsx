import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PATHS from "./router/paths";
import Result from "./pages/Result";

/**
 * アプリケーションのルートコンポーネント
 * ルーティングの設定を行い、各ページコンポーネントをパスに対応させる
 */
function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* ホーム画面 */}
          <Route path={PATHS.HOME} element={<Home />} />
          {/* クリア結果一覧画面 */}
          <Route path={PATHS.RESULT} element={<Result />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
