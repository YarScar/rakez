// Minimal, safe-ish markdown -> HTML renderer for small snippets
// Supports: headings (#), bold (**text**), italic (*text*), inline code (`code`), links [text](url), unordered lists (- or *), and paragraphs.
export function renderMarkdownToHtml(md) {
  if (!md) return "";
  // escape HTML
  const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // Normalize line endings
  let text = String(md).replace(/\r\n?/g, "\n");
  text = escapeHtml(text);

  // Code blocks ```
  text = text.replace(/```([\s\S]*?)```/g, (m, code) => `<pre><code>${code.replace(/</g,'&lt;')}</code></pre>`);

  // Inline code `code`
  text = text.replace(/`([^`]+)`/g, (m, code) => `<code>${code}</code>`);

  // Links [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);

  // Bold **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, (m, t) => `<strong>${t}</strong>`);

  // Italic *text*
  text = text.replace(/\*([^*]+)\*/g, (m, t) => `<em>${t}</em>`);

  // Unordered lists
  text = text.replace(/(^|\n)([\*\-] .+(?:\n[\*\-] .+)*)/g, (m, _, list) => {
    const items = list.split(/\n/).map(l => l.replace(/^[\*\-] /, '').trim());
    return `${_ || ''}<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  });

  // Headings
  text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Paragraphs (split by double newlines)
  const parts = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  return parts.map(p => (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<pre') ? p : `<p>${p.replace(/\n/g,'<br/>')}</p>`)).join('\n');
}
