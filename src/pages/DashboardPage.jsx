import { Link } from "react-router-dom";
import ContentCard from "../components/ContentCard";

function DashboardPage({ contents }) {

  const published = contents.filter((c) => c.status === "公開").length;
  const done = contents.filter((c) => c.status === "完成").length;
  const draft = contents.filter((c) => c.status === "下書き").length;

  return (
    <div>
      <h2>生成したコンテンツ（{contents.length}件）</h2>
      <p style={{ color: "#6b7280" }}>
        公開 {published} / 完成 {done} / 下書き {draft}
      </p>

      {contents.length === 0 ? (
        <p>まだありません。「生成する」から作ってみましょう。</p>
      ) : (
        contents.map((item) => (
          <Link
            key={item.id}
            to={`/edit/${item.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ContentCard
              name={item.name}
              body={item.body}
              status={item.status}
            />
          </Link>
        ))
      )}
    </div>
  );
}

export default DashboardPage;