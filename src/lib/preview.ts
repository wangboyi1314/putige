/** 免费预览截断，避免用户误以为已看完付费内容 */
export function truncatePreview(text: string, maxChars = 160): string {
  const cleaned = text.replace(/\n{3,}/g, "\n\n").trim();
  if (!cleaned) return "";
  if (cleaned.length <= maxChars) return cleaned;
  const cut = cleaned.slice(0, maxChars);
  const lastBreak = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("！"), cut.lastIndexOf("？"));
  const body = lastBreak > 40 ? cut.slice(0, lastBreak + 1) : cut.replace(/\s+\S*$/, "");
  return `${body}\n\n…（完整详批需付费解锁）`;
}
