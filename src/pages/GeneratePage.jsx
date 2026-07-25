import { useState } from "react";

function GeneratePage({ onAdd }) {
  const [name, setName] = useState("");
  const [feature, setFeature] = useState("");
  const [purpose, setTone] = useState("やさしい");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

    const prompt = `あなたはECサイトのコピーライターです。
        次の和菓子の商品説明文を特徴${feature}と用途:${purpose}を踏まえて、
        日本語、英語、スペイン語、中国語（簡体字）、中国語（繁体字）、韓国語で、
        用途に合わせて書いてください。
        商品名:${name}`;

//     const prompt = `あなたはECサイトのコピーライターです。
// 次の商品の説明文を、${tone}トーンで、100文字程度で書いてください。
// 商品名:${name}
// 特徴:${feature}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      // 生成に失敗（キー違い・レート制限など）。落とさず知らせて止める
      alert("生成に失敗しました。\n" + (data.error?.message || ("エラー " + res.status)));
      setLoading(false);
      return;
    }
    const text = data.choices[0].message.content;

    const newItem = {
      id: Date.now(),
      name: name,
      body: text,
      status: "下書き",
    };

    onAdd(newItem); // ← App に「これを追加して」とお願いする
    setLoading(false);
  }

  return (
    <div>
      <h2>生成する</h2>

      <label>商品名</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: Tシャツ" />

      <label>特徴（カンマ区切りでOK）</label>
      <input value={feature} onChange={(e) => setFeature(e.target.value)} placeholder="例: 夏用・軽い・白" />

      <label>用途</label>
      <select value={purpose} onChange={(e) => setTone(e.target.value)}>
        <option value="ECサイト説明文">ECサイト説明文</option>
        <option value="SNS用投稿文">SNS用投稿文</option>
        <option value="店頭POP">店頭POP</option>
      </select>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "生成中…" : "生成する"}
      </button>

      <p style={{ color: "#6b7280", marginTop: 12 }}>
        生成すると「ダッシュボード」に追加されます。
      </p>
    </div>
  );
}

export default GeneratePage;