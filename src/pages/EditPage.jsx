import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPage({ contents, onUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = contents.find((c) => c.id === Number(id));
  
  // コピー機能の実装
  const [copied, setCopied] = useState(false); // 他の useState と同じ場所（if (!item) より前）

  const [body, setBody] = useState(item ? item.body : "");
  const [status, setStatus] = useState(item ? item.status : "下書き");

  if (!item) {
    return (
      <div>
        <p>データが見つかりませんでした。</p>
        <button onClick={() => navigate("/")}>ダッシュボードへ戻る</button>
      </div>
    );
  }

  function handleSave() {
    onUpdate(item.id, { body: body, status: status });
    navigate("/");
  }

    //  コピー機能のおまじないを記述
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(body);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // 1.5秒で表示を戻す
        } catch {
            alert("コピーできませんでした。本文を選択して手動でコピーしてください。");
        }
    }

  return (
    <div>
      <h2>コンテンツを編集</h2>
      <p style={{ color: "#6b7280" }}>商品名: {item.name}</p>

      <label>本文</label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        style={{ width: "100%", display: "block", marginBottom: 12 }}
      />

      <label>ステータス</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="下書き">下書き</option>
        <option value="完成">完成</option>
        <option value="公開">公開</option>
      </select>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleSave}>保存する</button>

        <button onClick={handleCopy} style={{ marginLeft: 8 }}>
            {/* useStateのフラグ（true/falseどっちかのときの条件）を使って切り替える😊 */}
            {copied ? "コピーしました" : "本文をコピー"}
        </button>
        
        <button onClick={() => navigate("/")} style={{ marginLeft: 8 }}>
          キャンセル
        </button>
      </div>
    </div>
  );
}

export default EditPage;