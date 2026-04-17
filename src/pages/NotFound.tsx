import { Link } from "react-router-dom"
import PATHS from "../router/paths"

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-4xl font-bold">404 NotFound</h1>
            <p className="text-base">お探しのページが見つかりません</p>
            <Link to={PATHS.HOME} className="text-base underline">ホームに戻る</Link>
        </div>
    )
}

export default NotFound