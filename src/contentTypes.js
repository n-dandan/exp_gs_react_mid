// 用途（type）の一覧。
// value = データに保存する値（"ec" / "sns" / "pop"）
// label = 画面表示とプロンプトで使う日本語
// 生成画面・カード・ダッシュボードの3か所で使うので、ここに1つだけ置いて共有する
export const TYPE_OPTIONS = [
  { value: "ec", label: "ECサイト説明文" },
  { value: "sns", label: "SNS用投稿文" },
  { value: "pop", label: "店頭POP" },
];

// "ec" → "ECサイト説明文"（見つからなければ空文字。type を持たない古いデータ対策）
export function typeLabel(type) {
  const found = TYPE_OPTIONS.find((t) => t.value === type);
  return found ? found.label : "";
}
