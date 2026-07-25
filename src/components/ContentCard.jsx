import styles from "./ContentCard.module.css";

// ステータスの文字カラーの変更用
const statusStyles = {
  "下書き": styles.draft,
  "完成": styles.done,
  "公開": styles.published,
};


function ContentCard({ name, body, status }) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        <span className={`${styles.status} ${statusStyles[status] || ""}`}>{status}</span>
      </div>
      <p className={styles.body}>{body}</p>
    </div>
  );
}

export default ContentCard;