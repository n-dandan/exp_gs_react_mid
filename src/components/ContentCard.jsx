import styles from "./ContentCard.module.css";
import { typeLabel } from "../contentTypes";

// ステータス → 色クラス（Day2 宿題①「色分け」の答え）
const statusClass = {
  "下書き": styles.draft,
  "完成": styles.done,
  "公開": styles.open,
};

// 用途 → 色クラス
const typeClass = {
  ec: styles.typeEc,
  sns: styles.typeSns,
  pop: styles.typePop,
};

function ContentCard({ name, body, status, type, onDelete }) {
  // カードは <Link> の中にあるので、削除ボタンを押したときは
  // 画面遷移（編集ページへのリンク）が起きないように止める
  function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`「${name}」を削除しますか？`)) {
      onDelete();
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.actions}>
          {/* 用途タグ。type を持たない古いデータでは何も出さない */}
          {typeLabel(type) && (
            <span className={`${styles.status} ${typeClass[type] || ""}`}>
              {typeLabel(type)}
            </span>
          )}
          <span className={`${styles.status} ${statusClass[status] || ""}`}>
            {status}
          </span>
          {onDelete && (
            <button type="button" className={styles.delete} onClick={handleDelete}>
              削除
            </button>
          )}
        </div>
      </div>
      <p className={styles.body}>{body}</p>
    </div>
  );
}

export default ContentCard;