import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import GeneratePage from "./pages/GeneratePage";
import EditPage from "./pages/EditPage";
import "./App.css"; 

function App() {
  // ① 起動時：localStorage から読み込む（無ければ空配列）
  const [contents, setContents] = useState(() => {
    const saved = localStorage.getItem("contents");
    return saved ? JSON.parse(saved) : [];
  });

  // ② contents が変わるたび：localStorage に保存する
  useEffect(() => {
    localStorage.setItem("contents", JSON.stringify(contents));
  }, [contents]);

  function addContent(newItem) {
    setContents([newItem, ...contents]);
  }

  // id の1件だけを、changes の内容で書き換える
  function updateContent(id, changes) {
    setContents(
      contents.map((c) => (c.id === id ? { ...c, ...changes } : c))
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <div className="title">
        <h1>インバウンド向け和菓子</h1>
      </div>
      <NavBar />

      <Routes>
        <Route path="/" element={<DashboardPage contents={contents} />} />
        <Route path="/generate" element={<GeneratePage onAdd={addContent} />} />
        <Route
          path="/edit/:id"
          element={<EditPage contents={contents} onUpdate={updateContent} />}
        />
      </Routes>
    </div>
  );
}

export default App;
