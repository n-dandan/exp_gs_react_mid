import { useState } from "react";
import { TYPE_OPTIONS, typeLabel } from "../contentTypes";

function GeneratePage({ onAdd }) {
  const [name, setName] = useState("");
  const [feature, setFeature] = useState("");
  // 用途は "ec" / "sns" / "pop" の短い値で持ち、日本語は typeLabel() で取り出す
  const [type, setType] = useState("ec");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ← エラーメッセージ用

  async function handleGenerate() {
    // 入力チェック：name.trim() は前後の空白を除く（"   "だけ→空とみなす）。空なら生成しない
    if (!name.trim()) {
      setError("商品名を入力してください。");
      return;
    }

    setLoading(true);
    setError(""); // 前回のエラーを消す

    try {
      const prompt = `あなたはECサイトのコピーライターです。
        次の和菓子の商品説明文を特徴${feature}と用途:${typeLabel(type)}を踏まえて、
        日本語、英語、スペイン語、中国語（簡体字）、中国語（繁体字）、韓国語で、
        用途に合わせて書いてください。
        商品名:${name}`;

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      // 200番台“以外”は失敗として扱う
      if (!res.ok) {
        throw new Error(`APIエラー（ステータス:${res.status}）`);
      }

      const data = await res.json();
      const text = data.choices[0].message.content;

      const newItem = {
        id: Date.now(),
        name: name,
        body: text,
        status: "下書き",
        type: type, // 用途もデータとして保存 → カードのタグ・絞り込みで使う
      };

      onAdd(newItem);
    } catch (e) {
      console.error(e); // 開発者向け：詳しい内容はコンソールへ
      setError("生成に失敗しました。少し時間をおいて、もう一度お試しください。");
    } finally {
      setLoading(false); // 成功でも失敗でも、必ずローディング解除
    }
  }

  return (
    <div>
      <h2>生成する</h2>

      <label>商品名</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: Tシャツ" />

      <label>特徴（カンマ区切りでOK）</label>
      <input value={feature} onChange={(e) => setFeature(e.target.value)} placeholder="例: 夏用・軽い・白" />

      <label>用途</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        {TYPE_OPTIONS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <button onClick={handleGenerate} disabled={loading || !name.trim()}>
        {loading ? "生成中…" : "生成する"}
      </button>

      {error && (
        <p style={{ color: "#dc2626", marginTop: 12 }}>⚠️ {error}</p>
      )}

      <p style={{ color: "#6b7280", marginTop: 12 }}>
        生成すると「ダッシュボード」に追加されます。
      </p>
    </div>
  );
}

export default GeneratePage;