import { useState } from "react";
import ContentCard from "./components/ContentCard";

function App() {
  const [wagashi, setWagashi] = useState("羊羹");
  const [language, setLanguage] = useState("英語");
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]); // 生成物のリスト



  async function handleGenerate() {
    setLoading(true);


    // 入力から「お願い文」を組み立てる
    const prompt = `あなたはECサイトのコピーライターです。
    次の商品の説明文を、${language}で、200文字程度で書いてください。
    商品名:${wagashi}`;

    const key = import.meta.env.VITE_GROQ_API_KEY;
    console.log("KEYある?", !!key, "／ gsk_で始まる?", key?.startsWith("gsk_"));

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.choices[0].message.content;
    const newItem = {
      id: Date.now(), // 重複しない id（ミリ秒の数）
      name: wagashi,
      body: text,
      status: "下書き",
    };

    console.log("status:", res.status, "body:", data);

    if (!res.ok) {
      console.error("エラー " + res.status + "：" + (data.error?.message || "不明"));
      setLoading(false);
      return;
    }
    setContents([newItem, ...contents]);
    setLoading(false);
  }

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h1>Wagashi</h1><br />
      <h2>Japanese sweets</h2>
      <div>
        {/* <div className="box_theme">
          <div className="box_label">
            <label>商品名</label>
          </div>
          <div className="box_input">
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <div className="box_theme">
          <div className="box_label">
            <label>特徴（カンマ区切りでOK）</label>
          </div>
          <div className="box_input">
            <input value={feature} onChange={(e) => setFeature(e.target.value)} /> 
          </div>
        </div> */}
        <div className="box_theme">
          <div className="box_label">
            <label>Wagashi name</label>
          </div>
          <div className="box_input">
            <select value={wagashi} onChange={(e) => setWagashi(e.target.value)}>
              <option value="羊羹 | Yokan">Yokan</option>
              <option value="おはぎ | Ohagi">Ohagi</option>
              <option value="最中 | Monaka">Monaka</option>
              <option value="練り切り | Nerikiri">Nerikiri</option>
              <option value="饅頭 | Manju">Manju</option>
            </select>
          </div>
        </div>
        <div className="box_theme">
          <div className="box_label">
            <label>Language</label>
          </div>
          <div className="box_input">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="英語">English</option>
              <option value="スペイン語">Spanish</option>
              <option value="中国語（簡体字）">Chinese (Simplified)</option>
              <option value="中国語（繁体字）">Chinese (Traditional)</option>
              <option value="日本語">Japnese</option>
            </select>
          </div>
        </div>
        <div className="btn_generate">
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "生成中…" : "生成する"}
          </button>
        </div>
      </div>




      {/* <p style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>{result}</p> */}

      <div className="generated_content_list">
        <h2>生成したコンテンツ（{contents.length}件）</h2>
        {contents.length === 0 ? (
          <p>まだありません。上のフォームから生成してみましょう。</p>
        ) : (
          contents.map((item) => (
            <ContentCard
              key={item.id}
              name={item.name}
              body={item.body}
              status={item.status}
            />
          ))
        )}
      </div>
      
    </div>
  );
}

export default App;