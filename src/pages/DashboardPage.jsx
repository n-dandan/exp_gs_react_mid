import { useState } from "react";
import { Link } from "react-router-dom";
import ContentCard from "../components/ContentCard";
import { TYPE_OPTIONS } from "../contentTypes";

// 絞り込み・並び替えのプルダウン共通スタイル
const selectStyle = {
  padding: "7px 10px",
  fontSize: 14,
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  background: "#ffffff",
};

function DashboardPage({ contents, onDelete }) {
  // 状態ごとの件数（Day2 宿題②「件数表示」の答え）
  const countBy = (s) => contents.filter((c) => c.status === s).length;

  // 検索キーワード（入力欄の値を state で持つ = 制御コンポーネント）
  const [keyword, setKeyword] = useState("");
  // ステータスの絞り込み（"すべて" のときは絞り込まない）
  const [statusFilter, setStatusFilter] = useState("すべて");
  // 用途の絞り込み（"すべて" / "ec" / "sns" / "pop"）
  const [typeFilter, setTypeFilter] = useState("すべて");
  // 並び順（"new" = 新しい順 / "old" = 古い順）
  const [sortOrder, setSortOrder] = useState("new");

  const query = keyword.trim().toLowerCase();
  const isFiltered =
    query !== "" || statusFilter !== "すべて" || typeFilter !== "すべて";

  // ①商品名 → ②ステータス → ③用途 の順に絞り込み、最後に並び替え
  const visibleContents = contents
    .filter((c) => (query ? c.name.toLowerCase().includes(query) : true))
    .filter((c) => (statusFilter === "すべて" ? true : c.status === statusFilter))
    .filter((c) => (typeFilter === "すべて" ? true : c.type === typeFilter))
    // id は生成時の Date.now()（=作成順）。sort は配列を書き換えるが、
    // ここでの配列は filter が作った新しい配列なので props の contents は無傷
    .sort((a, b) => (sortOrder === "new" ? b.id - a.id : a.id - b.id));

  return (
    <div>
      <h2>生成したコンテンツ（{contents.length}件）</h2>
      <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 12px" }}>
        公開 {countBy("公開")} / 完成 {countBy("完成")} / 下書き {countBy("下書き")}
      </p>
      {/* 商品名で絞り込む検索欄 */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="商品名で検索"
          style={{
            flex: 1,
            padding: "8px 10px",
            fontSize: 14,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
          }}
        />
        {isFiltered && (
          <span style={{ color: "#6b7280", fontSize: 13, whiteSpace: "nowrap" }}>
            {visibleContents.length}件
          </span>
        )}
      </div>

      {/* ステータスの絞り込みと並び替え */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="すべて">すべてのステータス</option>
          <option value="公開">公開</option>
          <option value="完成">完成</option>
          <option value="下書き">下書き</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={selectStyle}
        >
          <option value="new">新しい順</option>
          <option value="old">古い順</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="すべて">すべての用途</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {contents.length === 0 ? (
        <p>まだありません。「生成する」から作ってみましょう。</p>
      ) : visibleContents.length === 0 ? (
        <p style={{ color: "#6b7280" }}>条件に一致するコンテンツはありません。</p>
      ) : (
        visibleContents.map((item) => (
          <Link
            key={item.id}
            to={`/edit/${item.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ContentCard
              name={item.name}
              body={item.body}
              status={item.status}
              type={item.type}
              onDelete={() => onDelete(item.id)}
            />
          </Link>
        ))
      )}
    </div>
  );
}

export default DashboardPage;